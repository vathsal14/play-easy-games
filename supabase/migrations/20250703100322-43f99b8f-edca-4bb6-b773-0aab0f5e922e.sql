
-- Drop existing referrals table and create a new one with proper structure
DROP TABLE IF EXISTS public.referrals;

-- Create a new referrals table with better structure
CREATE TABLE public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referral_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id),
  UNIQUE(referral_code, referred_id)
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create policies for referrals table
CREATE POLICY "Users can view their referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Allow referral creation" ON public.referrals
  FOR INSERT WITH CHECK (true);

-- Update the referral code generation to ensure uniqueness
UPDATE public.profiles 
SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT || id::TEXT), 1, 8))
WHERE referral_code IS NULL OR referral_code = '';

-- Ensure all referral codes are uppercase and unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_referral_code_unique 
ON public.profiles(referral_code) WHERE referral_code IS NOT NULL;
