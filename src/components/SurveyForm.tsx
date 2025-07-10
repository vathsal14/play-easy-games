
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SurveyFormProps {
  onClose: () => void;
}

const SurveyForm = ({ onClose }: SurveyFormProps) => {
  const { user, refreshProfile } = useAuth();
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ageGroup: '',
    isGamer: '',
    gamingFrequency: '',
    monthlySpending: '',
    interestedFeatures: [] as string[],
    preferredRewards: '',
    primaryCard: '',
    suggestions: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        interestedFeatures: [...prev.interestedFeatures, feature]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interestedFeatures: prev.interestedFeatures.filter(f => f !== feature)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to submit the survey');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: surveyError } = await supabase
        .from('surveys')
        .insert({
          user_id: user.id,
          age_group: formData.ageGroup,
          is_gamer: formData.isGamer,
          gaming_frequency: formData.gamingFrequency,
          monthly_spending: formData.monthlySpending,
          interested_features: formData.interestedFeatures,
          preferred_rewards: formData.preferredRewards,
          primary_card: formData.primaryCard,
          suggestions: formData.suggestions
        });

      if (surveyError) {
        console.error('Survey submission error:', surveyError);
        toast.error('Failed to submit survey. Please try again.');
        return;
      }

      const { data: pointsAwarded, error: pointsError } = await supabase.rpc('award_survey_points', {
        user_id: user.id
      });

      if (pointsError) {
        console.error('Points award error:', pointsError);
        toast.error('Survey submitted but failed to award points');
      } else if (pointsAwarded) {
        toast.success('Survey submitted successfully! You earned 500 points!');
        await refreshProfile();
      } else {
        toast.success('Survey submitted successfully!');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900 p-8 rounded-2xl text-center max-w-md"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Login Required</h3>
          <p className="text-gray-400 mb-6">Please log in to participate in the survey and earn points.</p>
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
          >
            Close
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900 p-8 rounded-2xl text-center max-w-md"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-gray-400">Your feedback has been submitted successfully.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Gaming Survey</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {currentSection === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-400">Section 1: About You</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Age Group */}
                  <div>
                    <Label className="text-white text-lg mb-4 block">1. What is your age group?</Label>
                    <RadioGroup 
                      value={formData.ageGroup} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, ageGroup: value }))}
                    >
                      {['Under 18', '18-24', '25-34', '35-44', '45+'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option} 
                            id={`age-${option}`}
                            className="border-gray-400 text-orange-500 focus:ring-orange-500"
                          />
                          <Label htmlFor={`age-${option}`} className="text-gray-300">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Are you a gamer */}
                  <div>
                    <Label className="text-white text-lg mb-4 block">2. Are you a gamer?</Label>
                    <RadioGroup 
                      value={formData.isGamer} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, isGamer: value }))}
                    >
                      {['Yes', 'No'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option} 
                            id={`gamer-${option}`}
                            className="border-gray-400 text-orange-500 focus:ring-orange-500"
                          />
                          <Label htmlFor={`gamer-${option}`} className="text-gray-300">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Gaming Frequency */}
                  <div>
                    <Label className="text-white text-lg mb-4 block">3. How often do you play games?</Label>
                    <RadioGroup 
                      value={formData.gamingFrequency} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gamingFrequency: value }))}
                    >
                      {['Daily', 'Weekly', 'Monthly', 'Rarely'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option} 
                            id={`frequency-${option}`}
                            className="border-gray-400 text-orange-500 focus:ring-orange-500"
                          />
                          <Label htmlFor={`frequency-${option}`} className="text-gray-300">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Monthly Spending */}
                  <div>
                    <Label className="text-white text-lg mb-4 block">4. How much do you spend on gaming monthly?</Label>
                    <RadioGroup 
                      value={formData.monthlySpending} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, monthlySpending: value }))}
                    >
                      {['Less than ₹500', '₹500 - ₹1,000', '₹1,000 - ₹5,000', '₹5,000 - ₹10,000', '₹10,000+'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option} 
                            id={`spending-${option}`}
                            className="border-gray-400 text-orange-500 focus:ring-orange-500"
                          />
                          <Label htmlFor={`spending-${option}`} className="text-gray-300">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button 
                  type="button"
                  onClick={() => setCurrentSection(2)}
                  className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
                >
                  Next Section
                </Button>
              </div>
            </motion.div>
          )}

          {currentSection === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Section 2: Aqube Gaming Credit Card Interest</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Interested Features */}
                  <div>
                    <Label className="text-white text-lg mb-4 block">5. What features of the Aqube Gaming Credit Card interest you the most? (Select all that apply)</Label>
                    <div className="space-y-3">
                      {[
                        'Cashback on gaming purchases',
                        'Exclusive gaming rewards',
                        'Referral bonuses',
                        'Free lifetime card option'
                      ].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`feature-${option}`}
                            checked={formData.interestedFeatures.includes(option)}
                            onChange={(e) => handleFeatureChange(option, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-400 bg-gray-700 text-orange-500 focus:ring-orange-500 focus:ring-2"
                          />
                          <Label htmlFor={`feature-${option}`} className="text-gray-300">{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Rewards */}
                  <div>
                    <Label className="text-white text-lg mb-4 block">6. What kind of rewards would excite you the most?</Label>
                    <RadioGroup 
                      value={formData.preferredRewards} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, preferredRewards: value }))}
                    >
                      {[
                        'Free gaming accessories',
                        'Discounted game purchases',
                        'In-game currencies or credits',
                        'Cashback or discounts on online stores'
                      ].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option} 
                            id={`rewards-${option}`}
                            className="border-gray-400 text-orange-500 focus:ring-orange-500"
                          />
                          <Label htmlFor={`rewards-${option}`} className="text-gray-300">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Primary Card */}
                  <div>
                    <Label className="text-white text-lg mb-4 block">7. Would you consider using the Aqube Gaming Credit Card as your primary credit card?</Label>
                    <RadioGroup 
                      value={formData.primaryCard} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, primaryCard: value }))}
                    >
                      {['Yes', 'No', 'Not sure yet'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option} 
                            id={`primary-${option}`}
                            className="border-gray-400 text-orange-500 focus:ring-orange-500"
                          />
                          <Label htmlFor={`primary-${option}`} className="text-gray-300">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <Label className="text-white text-lg mb-4 block">8. Do you have any suggestions or comments for us?</Label>
                    <Textarea
                      value={formData.suggestions}
                      onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
                      placeholder="Share your thoughts, suggestions, or any feedback..."
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button 
                  type="button"
                  onClick={() => setCurrentSection(1)}
                  className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
                >
                  Previous Section
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                </Button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default SurveyForm;
