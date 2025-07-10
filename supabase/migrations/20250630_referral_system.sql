-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id),
  referred_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed'))
);

-- Add referral_code column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Create function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  user_id UUID;
BEGIN
  -- Get current user ID
  SELECT auth.uid() INTO user_id;
  
  -- Generate a unique referral code
  LOOP
    code := upper(substr(md5(random()::text), 1, 6));
    
    -- Check if code already exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE referral_code = code) THEN
      -- Create or update the profile with the referral code
      INSERT INTO profiles (id, referral_code)
      VALUES (user_id, code)
      ON CONFLICT (id) DO UPDATE SET referral_code = EXCLUDED.referral_code
      RETURNING referral_code;
      
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to process referral
CREATE OR REPLACE FUNCTION process_referral(referred_user_id UUID, referral_code TEXT)
RETURNS VOID AS $$
BEGIN
  -- Find the referrer
  INSERT INTO referrals (referrer_id, referred_id)
  SELECT p.id, referred_user_id
  FROM profiles p
  WHERE p.referral_code = referral_code
  AND NOT EXISTS (
    SELECT 1 FROM referrals r WHERE r.referrer_id = p.id AND r.referred_id = referred_user_id
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get referral count
CREATE OR REPLACE FUNCTION get_referral_count(user_id UUID)
RETURNS INTEGER AS $$
SELECT COUNT(*)
FROM referrals
WHERE referrer_id = user_id;
$$ LANGUAGE sql;
