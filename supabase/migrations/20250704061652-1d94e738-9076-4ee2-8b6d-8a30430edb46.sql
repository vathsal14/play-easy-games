
-- Create a dedicated referral_codes table to store all referral codes
CREATE TABLE public.referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0,
  max_usage INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for referral_codes table
CREATE POLICY "Users can view all referral codes" ON public.referral_codes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own referral codes" ON public.referral_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update referral codes" ON public.referral_codes
  FOR UPDATE USING (true);

-- Insert referral codes for all existing users
INSERT INTO public.referral_codes (user_id, referral_code)
SELECT id, referral_code 
FROM public.profiles 
WHERE referral_code IS NOT NULL
ON CONFLICT (referral_code) DO NOTHING;

-- Create a test referral code for demonstration
INSERT INTO public.referral_codes (user_id, referral_code, usage_count)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'TEST1234',
  0
) ON CONFLICT (referral_code) DO NOTHING;

-- Create or update the test user profile
INSERT INTO public.profiles (id, email, display_name, referral_code, points, spins)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test@example.com',
  'Test User',
  'TEST1234',
  1000,
  1
) ON CONFLICT (id) DO UPDATE SET
  referral_code = 'TEST1234',
  display_name = 'Test User';

-- Function to increment referral code usage
CREATE OR REPLACE FUNCTION public.increment_referral_usage(code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
  max_allowed INTEGER;
BEGIN
  SELECT usage_count, max_usage INTO current_usage, max_allowed
  FROM public.referral_codes
  WHERE referral_code = code;
  
  IF current_usage IS NULL THEN
    RETURN FALSE; -- Code doesn't exist
  END IF;
  
  IF current_usage >= max_allowed THEN
    RETURN FALSE; -- Code has reached max usage
  END IF;
  
  UPDATE public.referral_codes
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE referral_code = code;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
