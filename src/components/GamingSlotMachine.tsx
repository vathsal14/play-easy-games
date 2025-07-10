
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Gift, Zap, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GamingSlotMachineProps {
  onClose: () => void;
}

const GamingSlotMachine: React.FC<GamingSlotMachineProps> = ({ onClose }) => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [reels, setReels] = useState([0, 0, 0]);

  const symbols = [
    { name: '100 Points', icon: Star, color: 'text-blue-400', points: 100, rarity: 35 },
    { name: '500 Points', icon: Star, color: 'text-purple-400', points: 500, rarity: 25 },
    { name: '1000 Points', icon: Star, color: 'text-yellow-400', points: 1000, rarity: 15 },
    { name: 'Gaming Headset', icon: Gift, color: 'text-green-400', points: 0, special: true, rarity: 10 },
    { name: 'Nintendo Switch', icon: Gamepad2, color: 'text-red-400', points: 0, special: true, rarity: 2 },
    { name: 'Free Credit Card', icon: Trophy, color: 'text-orange-400', points: 0, special: true, rarity: 5 },
    { name: 'Extra Spin', icon: Zap, color: 'text-cyan-400', points: 0, special: true, rarity: 8 }
  ];

  const getRandomSymbol = () => {
    const random = Math.random() * 100;
    let accumulator = 0;
    
    for (const symbol of symbols) {
      accumulator += symbol.rarity;
      if (random <= accumulator) {
        return symbols.indexOf(symbol);
      }
    }
    return 0; // fallback
  };

  const spin = async () => {
    if (!user || !profile || profile.spins < 1 || isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    
    // Animate the reels
    const spinDuration = 2000;
    const spinInterval = 100;
    let elapsed = 0;
    
    const spinAnimation = setInterval(() => {
      setReels([
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length)
      ]);
      elapsed += spinInterval;
      
      if (elapsed >= spinDuration) {
        clearInterval(spinAnimation);
        
        // Determine final result
        const finalSymbolIndex = getRandomSymbol();
        const finalReels = [finalSymbolIndex, finalSymbolIndex, finalSymbolIndex];
        setReels(finalReels);
        
        const prize = symbols[finalSymbolIndex];
        setResult(prize.name);
        
        // Process the prize
        setTimeout(async () => {
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

            // Update user profile with prize rewards
            const newSpins = Math.max(0, (profile.spins || 0) - spinsToDeduct + spinsToAdd);
            console.log(`Updating spins: ${profile.spins} -> ${newSpins} (deduct: ${spinsToDeduct}, add: ${spinsToAdd})`);
            
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

            // Show appropriate toast
            if (prize.special) {
              if (prize.name === 'Nintendo Switch') {
                toast({
                  title: `🎮 JACKPOT! You won a ${prize.name}!`,
                  description: "Contact support to claim your Nintendo Switch.",
                });
              } else if (prize.name === 'Extra Spin') {
                toast({
                  title: `⚡ ${prize.name}!`,
                  description: "You earned an extra spin!",
                });
              } else {
                toast({
                  title: `🎉 ${prize.name}!`,
                  description: "Congratulations! Contact support to claim your prize.",
                });
              }
            } else {
              toast({
                title: `💰 You won ${prize.points} points!`,
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
        }, 1000);
      }
    }, spinInterval);
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
          className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full relative border border-purple-500/30 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              🎰 Gaming Slot Machine
            </h2>
            <p className="text-gray-400">
              Spins remaining: <span className="text-cyan-400 font-bold">{profile?.spins || 0}</span>
            </p>
          </div>

          {/* Slot Machine */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-cyan-500/30">
            <div className="flex justify-center space-x-4 mb-6">
              {reels.map((symbolIndex, reelIndex) => {
                const symbol = symbols[symbolIndex];
                const Icon = symbol.icon;
                
                return (
                  <motion.div
                    key={reelIndex}
                    className="w-20 h-20 bg-black rounded-lg border-2 border-cyan-500/50 flex items-center justify-center"
                    animate={isSpinning ? { y: [0, -10, 0] } : {}}
                    transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
                  >
                    <Icon className={`w-10 h-10 ${symbol.color}`} />
                  </motion.div>
                );
              })}
            </div>

            {/* Prize Display */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {symbols.map((symbol, index) => {
                const Icon = symbol.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 text-gray-400">
                    <Icon className={`w-4 h-4 ${symbol.color}`} />
                    <span>{symbol.name}</span>
                  </div>
                );
              })}
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
            {isSpinning ? '🎰 Spinning...' : '🎯 Pull the Lever!'}
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

export default GamingSlotMachine;
