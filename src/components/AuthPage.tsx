
import { useState } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AuthPageProps {
  onClose: () => void;
}

const AuthPage = ({ onClose }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    referralCode: ''
  });

  const { signUp, signIn } = useAuth();

  const validateReferralCode = async (code: string) => {
    if (!code || code.trim() === '') return true; // Optional field
    
    const normalizedCode = code.trim().toUpperCase();
    console.log('Validating referral code:', normalizedCode);
    
    try {
      // Check if referral code exists in profiles table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, referral_code')
        .ilike('referral_code', normalizedCode) // Use ilike for case-insensitive search
        .maybeSingle();

      console.log('Database query result:', { profileData, error });

      if (error) {
        console.error('Error checking referral code:', error);
        return false;
      }

      const isValid = !!profileData;
      console.log('Referral code validation result:', isValid, profileData);
      return isValid;
    } catch (error) {
      console.error('Error in validateReferralCode:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back, gamer!');
          onClose();
        }
      } else {
        // Validate referral code if provided
        if (formData.referralCode) {
          const isValidReferral = await validateReferralCode(formData.referralCode);
          if (!isValidReferral) {
            toast.error('Invalid referral code. Please check and try again.');
            setLoading(false);
            return;
          }
        }

        const { error: signUpError, data } = await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.referralCode || undefined
        );
        
        if (signUpError) {
          toast.error(signUpError.message);
        } else {
          if (formData.referralCode) {
            toast.success('Welcome to Aqube XP! Your account has been created and referral processed.');
          } else {
            toast.success('Welcome to Aqube XP! Your account has been created.');
          }
          onClose();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value // Remove the uppercase conversion here
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-orange-400 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back, Gamer' : 'Join Aqube XP'}
          </h2>
          <p className="text-gray-400">
            {isLogin ? 'Sign in to access your gaming rewards' : 'Start your gaming credit journey today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gamer Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                placeholder="Enter your gamer name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 pr-12"
              placeholder="Enter your password"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-orange-400 transition-colors"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                placeholder="Enter referral code"
                maxLength={8}
              />
              <div className="mt-2">
                <p className="text-xs text-orange-400">Get extra spins by using a friend's referral code!</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
          >
            {isLogin 
              ? "Don't have an account? Join the elite" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
