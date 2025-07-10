
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  points INTEGER DEFAULT 1000,
  spins INTEGER DEFAULT 1,
  last_login_bonus DATE,
  referral_code TEXT UNIQUE DEFAULT SUBSTRING(MD5(RANDOM()::TEXT), 1, 8),
  referred_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table to track referral rewards
CREATE TABLE public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES public.profiles(id) NOT NULL,
  referred_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for referrals
CREATE POLICY "Users can view their referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can insert referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to give daily login bonus
CREATE OR REPLACE FUNCTION public.give_daily_bonus(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  last_bonus DATE;
  today DATE := CURRENT_DATE;
BEGIN
  SELECT last_login_bonus INTO last_bonus
  FROM public.profiles
  WHERE id = user_id;
  
  IF last_bonus IS NULL OR last_bonus < today THEN
    UPDATE public.profiles
    SET points = points + 100,
        last_login_bonus = today,
        updated_at = NOW()
    WHERE id = user_id;
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle referrals
CREATE OR REPLACE FUNCTION public.process_referral(referred_user_id UUID, referral_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  referrer_id UUID;
  referral_count INTEGER;
BEGIN
  -- Find the referrer
  SELECT id INTO referrer_id
  FROM public.profiles
  WHERE profiles.referral_code = process_referral.referral_code
  AND id != referred_user_id;
  
  IF referrer_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if referrer hasn't reached max referrals (3)
  SELECT COUNT(*) INTO referral_count
  FROM public.referrals
  WHERE referrer_id = process_referral.referrer_id;
  
  IF referral_count >= 3 THEN
    RETURN FALSE;
  END IF;
  
  -- Insert referral record
  INSERT INTO public.referrals (referrer_id, referred_id)
  VALUES (referrer_id, referred_user_id);
  
  -- Give spin to referrer
  UPDATE public.profiles
  SET spins = spins + 1,
      updated_at = NOW()
  WHERE id = referrer_id;
  
  -- Update referred user's referred_by
  UPDATE public.profiles
  SET referred_by = referrer_id,
      updated_at = NOW()
  WHERE id = referred_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
