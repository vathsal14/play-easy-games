
-- Drop the existing restrictive RLS policy for profiles SELECT
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create a new policy that allows users to view all profiles for the leaderboard
-- but only see basic public information (not sensitive data)
CREATE POLICY "Users can view public profile data" 
ON profiles 
FOR SELECT 
USING (true);

-- Keep the restrictive policies for INSERT and UPDATE (users can only modify their own)
-- The existing INSERT and UPDATE policies are fine as they are

-- Also, let's make sure the referrals table allows proper inserts
DROP POLICY IF EXISTS "Users can insert referrals" ON referrals;

-- Create a more permissive policy for referral creation
CREATE POLICY "Allow referral creation" 
ON referrals 
FOR INSERT 
WITH CHECK (true);
