
-- Add login streak columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_date DATE;

-- Function to check and update login streak
CREATE OR REPLACE FUNCTION public.check_login_streak(user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  current_streak INTEGER := 0;
  last_login DATE;
  today DATE := CURRENT_DATE;
  yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
  streak_reward TEXT := '';
  result json;
BEGIN
  SELECT login_streak, last_login_date INTO current_streak, last_login
  FROM public.profiles
  WHERE id = user_id;
  
  -- If never logged in before or last login was more than 1 day ago, reset streak
  IF last_login IS NULL OR last_login < yesterday THEN
    current_streak := 1;
    streak_reward := '';
  -- If last login was yesterday, increment streak
  ELSIF last_login = yesterday THEN
    current_streak := current_streak + 1;
    
    -- Check if 7-day streak completed
    IF current_streak = 7 THEN
      streak_reward := 'You earned a bonus spin for your 7-day streak!';
      -- Give bonus spin
      UPDATE public.profiles
      SET spins = spins + 1
      WHERE id = user_id;
    ELSIF current_streak % 7 = 0 THEN
      streak_reward := 'Amazing! Another 7-day streak completed! +1 spin!';
      -- Give bonus spin for every 7-day streak
      UPDATE public.profiles
      SET spins = spins + 1
      WHERE id = user_id;
    ELSE
      streak_reward := current_streak || ' day streak!';
    END IF;
  -- If already logged in today, don't change streak
  ELSIF last_login = today THEN
    -- Return current streak without changes
    result := json_build_object(
      'streak_count', current_streak,
      'streak_reward', ''
    );
    RETURN result;
  END IF;
  
  -- Update the profile with new streak data
  UPDATE public.profiles
  SET login_streak = current_streak,
      last_login_date = today,
      updated_at = NOW()
  WHERE id = user_id;
  
  result := json_build_object(
    'streak_count', current_streak,
    'streak_reward', streak_reward
  );
  
  RETURN result;
END;
$function$;
