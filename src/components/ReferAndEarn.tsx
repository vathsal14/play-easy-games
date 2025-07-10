
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlusIcon, GiftIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ReferAndEarn = () => {
  const { profile, refreshProfile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [referralUsers, setReferralUsers] = useState([]);

  useEffect(() => {
    if (profile?.id) {
      fetchReferralData();
    }
  }, [profile?.id]);

  // Refresh data more frequently to catch new referrals
  useEffect(() => {
    if (profile?.id) {
      const interval = setInterval(() => {
        fetchReferralData();
        refreshProfile(); // Refresh profile to get updated spins count
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [profile?.id, refreshProfile]);

  const fetchReferralData = async () => {
    if (!profile?.id) return;

    try {
      console.log('Fetching referral data for user:', profile.id);
      
      // Get referrals where this user is the referrer
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          id,
          created_at,
          referral_code,
          referred:profiles!referrals_referred_id_fkey(display_name, email)
        `)
        .eq('referrer_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching referral data:', error);
      } else {
        console.log('Referral data fetched:', data);
        setReferralCount(data?.length || 0);
        setReferralUsers(data || []);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  const copyReferralCode = async () => {
    if (!profile?.referral_code) {
      toast.error('No referral code available');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      toast.success('Referral code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy referral code:', error);
      
      // Fallback method
      try {
        const textArea = document.createElement('textarea');
        textArea.value = profile.referral_code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopied(true);
          toast.success('Referral code copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        } else {
          toast.error('Failed to copy referral code. Please copy manually.');
        }
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        toast.error('Please copy the code manually: ' + profile.referral_code);
      }
    }
  };

  const maxReferrals = 3;
  const remainingReferrals = maxReferrals - referralCount;

  if (!profile) {
    return (
      <div className="py-10 md:py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">Please sign in to access refer and earn</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden" id="refer">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full blur-md animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            Refer & Earn Spins
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Invite friends to join Aqube XP and earn extra spins. Maximum 3 referrals per user.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Referral Code Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-orange-500/30"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <UserPlusIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Your Referral Code</h3>
                <p className="text-gray-400 text-sm">Share this code with friends</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-orange-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xl md:text-2xl font-mono text-orange-400 tracking-wider select-all">
                  {profile.referral_code}
                </span>
                <motion.button
                  onClick={copyReferralCode}
                  className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Copy referral code"
                >
                  {copied ? (
                    <CheckIcon className="w-5 h-5 text-white" />
                  ) : (
                    <ClipboardDocumentIcon className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Referrals made:</span>
                <span className="text-white font-semibold">{referralCount}/{maxReferrals}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(referralCount / maxReferrals) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Remaining:</span>
                <span className="text-orange-400 font-semibold">{remainingReferrals} spins available</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current spins:</span>
                <span className="text-green-400 font-semibold">{profile.spins || 0}</span>
              </div>
            </div>

            {/* Referral List */}
            {referralUsers.length > 0 && (
              <div className="mt-6">
                <h4 className="text-white font-semibold mb-3">Your Referrals:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {referralUsers.map((referral: any, index: number) => (
                    <div key={referral.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2">
                      <span className="text-gray-300 text-sm">
                        {referral.referred?.display_name || referral.referred?.email || 'Unknown User'}
                      </span>
                      <span className="text-green-400 text-xs font-semibold">
                        +1 spin earned
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* How it Works Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-orange-500/30"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <GiftIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">How It Works</h3>
                <p className="text-gray-400 text-sm">Simple steps to earn spins</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Share Your Code",
                  description: "Send your referral code to friends who love gaming"
                },
                {
                  step: "2",
                  title: "Friend Signs Up",
                  description: "They create an account using your referral code"
                },
                {
                  step: "3",
                  title: "Earn Extra Spins",
                  description: "You get +1 spin for each successful referral"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
              className="mt-4 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-500/30"
            >
              <p className="text-blue-400 font-semibold text-sm mb-1">💡 Pro Tip</p>
              <p className="text-gray-300 text-sm">
                Maximum 3 referrals per user. Each referral gives you 1 extra spin for the rewards wheel!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;
