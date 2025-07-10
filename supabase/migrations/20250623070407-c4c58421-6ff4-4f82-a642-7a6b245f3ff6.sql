
-- Create surveys table to store survey responses
CREATE TABLE public.surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  age_group TEXT,
  is_gamer TEXT,
  gaming_frequency TEXT,
  monthly_spending TEXT,
  interested_features TEXT[], -- Array to store multiple selections
  preferred_rewards TEXT,
  primary_card TEXT,
  suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own surveys
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own surveys
CREATE POLICY "Users can view their own surveys" 
  ON public.surveys 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own surveys
CREATE POLICY "Users can create their own surveys" 
  ON public.surveys 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own surveys
CREATE POLICY "Users can update their own surveys" 
  ON public.surveys 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to award points for survey completion
CREATE OR REPLACE FUNCTION public.award_survey_points(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has already submitted a survey
  IF EXISTS (SELECT 1 FROM public.surveys WHERE surveys.user_id = award_survey_points.user_id) THEN
    RETURN FALSE; -- Already submitted, no points awarded
  END IF;
  
  -- Award 500 points for completing the survey
  UPDATE public.profiles
  SET points = points + 500,
      updated_at = NOW()
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$;
