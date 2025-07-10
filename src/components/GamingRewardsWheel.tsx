
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Gift, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GamingRewardsWheelProps {
  onClose: () => void;
}

const GamingRewardsWheel: React.FC<GamingRewardsWheelProps> = ({ onClose }) => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const prizes = [
    { name: 'Free Credit Card', icon: Trophy, color: 'from-yellow-400 to-orange-500', points: 0, special: true, display: 'Free Card' },
    { name: '1000 Points', icon: Star, color: 'from-purple-400 to-pink-500', points: 1000, special: false, display: '1000' },
    { name: 'Gaming Subscription', icon: Gift, color: 'from-green-400 to-blue-500', points: 0, special: true, display: 'Subscription' },
    { name: '100 Points', icon: Star, color: 'from-blue-400 to-purple-500', points: 100, special: false, display: '100' },
    { name: 'Exclusive Card Access', icon: Zap, color: 'from-red-400 to-pink-500', points: 0, special: true, display: 'VIP Access' },
    { name: '10 Points', icon: Star, color: 'from-cyan-400 to-blue-500', points: 10, special: false, display: '10' },
    { name: 'Extra Spin', icon: Zap, color: 'from-pink-400 to-red-500', points: 0, special: true, display: 'Extra Spin' },
    { name: '1 Point', icon: Star, color: 'from-indigo-400 to-purple-500', points: 1, special: false, display: '1' }
  ];

  const spin = async () => {
    if (!user || !profile || profile.spins < 1 || isSpinning) return;

    setIsSpinning(true);
    
    // Generate weighted random result (higher chance for points)
    const rand = Math.random();
    let selectedIndex;
    
    if (rand < 0.7) {
      // 70% chance for points (indices 1, 3, 5, 7)
      const pointIndices = [1, 3, 5, 7];
      selectedIndex = pointIndices[Math.floor(Math.random() * pointIndices.length)];
    } else {
      // 30% chance for special prizes or extra spin
      selectedIndex = Math.floor(Math.random() * prizes.length);
    }

    const spins = 5 + Math.random() * 5;
    const finalRotation = rotation + (spins * 360) + (selectedIndex * (360 / prizes.length));
    
    setRotation(finalRotation);

    setTimeout(async () => {
      const prize = prizes[selectedIndex];
      setResult(prize.name);
      
      try {
        let pointsToAdd = 0;
        let spinsToDeduct = 1; // Default: deduct 1 spin
        let spinsToAdd = 0;

        if (prize.special) {
          if (prize.name === 'Extra Spin') {
            // For extra spin, we don't deduct a spin, we add one
            spinsToDeduct = 0;
            spinsToAdd = 1;
          }
          // For other special prizes, just deduct the normal spin
        } else {
          pointsToAdd = prize.points;
        }
        
        console.log(`Processing prize: ${prize.name}, spinsToDeduct: ${spinsToDeduct}, spinsToAdd: ${spinsToAdd}`);

        // Calculate new spins value
        const newSpins = Math.max(0, (profile.spins || 0) - spinsToDeduct + spinsToAdd);
        console.log(`Updating spins: ${profile.spins} -> ${newSpins} (deduct: ${spinsToDeduct}, add: ${spinsToAdd})`);
        
        // Update user profile
        const { error } = await supabase
          .from('profiles')
          .update({
            points: (profile.points || 0) + pointsToAdd,
            spins: newSpins,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating profile:', error);
          throw error;
        }

        // Force refresh the profile to get the latest data
        const updatedProfile = await refreshProfile();
        console.log('Profile refreshed, new spins:', updatedProfile?.spins);
        
        // Update local state with the new spins count
        if (updatedProfile) {
          toast({
            title: '🎉 Spin Complete!',
            description: `You now have ${updatedProfile.spins} spins remaining.`,
          });
        }

        if (prize.special) {
          toast({
            title: `🎉 ${prize.name}!`,
            description: prize.name === 'Extra Spin' 
              ? "You earned an extra spin!" 
              : "Congratulations! Contact support to claim your prize.",
          });
        } else {
          toast({
            title: `🎉 You won ${prize.points} points!`,
            description: `Your new balance: ${(profile.points || 0) + pointsToAdd} points`,
          });
        }
        
      } catch (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update your account. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsSpinning(false);
    }, 3000);
  };

  if (!user) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 rounded-2xl p-8 max-w-md w-full relative border border-purple-500/30 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              🎰 Gaming Rewards Wheel
            </h2>
            <p className="text-gray-400">
              Spins remaining: <span className="text-cyan-400 font-bold">{profile?.spins || 0}</span>
            </p>
          </div>

          <div className="relative w-64 h-64 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/50 shadow-lg shadow-cyan-500/25"></div>
            
            <motion.div
              className="w-full h-full rounded-full relative overflow-hidden"
              animate={{ rotate: rotation }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              {prizes.map((prize, index) => {
                const angle = (360 / prizes.length) * index;
                const Icon = prize.icon;
                
                return (
                  <div
                    key={index}
                    className={`absolute w-full h-full bg-gradient-to-r ${prize.color}`}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((360 / prizes.length) * Math.PI / 180)}% ${50 - 50 * Math.sin((360 / prizes.length) * Math.PI / 180)}%)`
                    }}
                  >
                    <div 
                      className="absolute text-white text-center font-bold"
                      style={{
                        top: '25%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${(360 / prizes.length) / 2}deg)`,
                        fontSize: '10px'
                      }}
                    >
                      <Icon className="w-3 h-3 mx-auto mb-1" />
                      <div className="text-xs">{prize.display}</div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-white shadow-lg"></div>
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center mb-4 p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30"
            >
              <h3 className="text-2xl font-bold text-white mb-2">🎉 Congratulations!</h3>
              <p className="text-cyan-400 font-semibold text-lg">{result}</p>
            </motion.div>
          )}

          <button
            onClick={spin}
            disabled={!profile || profile.spins < 1 || isSpinning}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
          >
            {isSpinning ? '🎰 Spinning...' : '🎯 Spin the Wheel!'}
          </button>
          
          {(!profile || profile.spins < 1) && (
            <p className="text-gray-400 text-sm text-center mt-3">
              💡 Refer friends to earn more spins!
            </p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GamingRewardsWheel;
