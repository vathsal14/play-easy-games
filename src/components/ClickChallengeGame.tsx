import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Zap, Shield, Bomb } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClickChallengeGameProps {
  onClose: () => void;
}

interface Target {
  id: string;
  x: number;
  y: number;
  type: 'normal' | 'bonus' | 'bomb' | 'shield';
  points: number;
  timeLeft: number;
}

const ClickChallengeGame: React.FC<ClickChallengeGameProps> = ({ onClose }) => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [combo, setCombo] = useState(0);
  const [hasShield, setHasShield] = useState(false);
  const [level, setLevel] = useState(1);

  const targetTypes = [
    { type: 'normal', icon: Target, color: 'text-blue-400', points: 10, chance: 60 },
    { type: 'bonus', icon: Zap, color: 'text-yellow-400', points: 25, chance: 25 },
    { type: 'bomb', icon: Bomb, color: 'text-red-400', points: -15, chance: 10 },
    { type: 'shield', icon: Shield, color: 'text-green-400', points: 5, chance: 5 }
  ];

  const getRandomTargetType = () => {
    const random = Math.random() * 100;
    let accumulator = 0;
    
    for (const targetType of targetTypes) {
      accumulator += targetType.chance;
      if (random <= accumulator) {
        return targetType;
      }
    }
    return targetTypes[0];
  };

  const spawnTarget = useCallback(() => {
    const targetType = getRandomTargetType();
    const newTarget: Target = {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 80 + 10, // 10% to 90% of container width
      y: Math.random() * 70 + 15, // 15% to 85% of container height
      type: targetType.type as 'normal' | 'bonus' | 'bomb' | 'shield',
      points: targetType.points,
      timeLeft: targetType.type === 'bonus' ? 2 : 3
    };
    
    setTargets(prev => [...prev, newTarget]);
  }, []);

  const clickTarget = (target: Target) => {
    if (target.type === 'bomb' && !hasShield) {
      setScore(prev => Math.max(0, prev + target.points));
      setCombo(0);
      toast({
        title: "💥 Bomb Hit!",
        description: `${target.points} points! Combo reset!`,
        variant: "destructive",
      });
    } else if (target.type === 'bomb' && hasShield) {
      setHasShield(false);
      toast({
        title: "🛡️ Shield Protected You!",
        description: "Your shield absorbed the bomb damage!",
      });
    } else if (target.type === 'shield') {
      setHasShield(true);
      setScore(prev => prev + target.points);
      toast({
        title: "🛡️ Shield Activated!",
        description: "You're protected from the next bomb!",
      });
    } else {
      const comboMultiplier = Math.floor(combo / 5) + 1;
      const points = target.points * comboMultiplier;
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      
      if (comboMultiplier > 1) {
        toast({
          title: `🔥 ${combo + 1}x Combo!`,
          description: `${points} points! (${target.points} × ${comboMultiplier})`,
        });
      }
    }
    
    setTargets(prev => prev.filter(t => t.id !== target.id));
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const targetTimer = setInterval(() => {
      setTargets(prev => prev.filter(target => {
        if (target.timeLeft <= 1) {
          if (target.type !== 'bomb') {
            setCombo(0); // Miss penalty
          }
          return false;
        }
        return true;
      }).map(target => ({ ...target, timeLeft: target.timeLeft - 1 })));
    }, 1000);

    const spawnTimer = setInterval(() => {
      if (targets.length < level + 2) {
        spawnTarget();
      }
    }, 1500 - (level * 100)); // Faster spawning as level increases

    return () => {
      clearInterval(gameTimer);
      clearInterval(targetTimer);
      clearInterval(spawnTimer);
    };
  }, [gameStarted, gameOver, targets.length, level, spawnTarget]);

  useEffect(() => {
    // Level up every 100 points
    const newLevel = Math.floor(score / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setTimeLeft(prev => prev + 5); // Bonus time for leveling up
      toast({
        title: `🎉 Level ${newLevel}!`,
        description: "+5 seconds bonus time!",
      });
    }
  }, [score, level]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setCombo(0);
    setHasShield(false);
    setLevel(1);
    spawnTarget();
  };

  const endGame = async () => {
    if (!user || !profile) return;

    try {
      const pointsEarned = Math.floor(score / 10); // 1 point per 10 game score
      
      const { error } = await supabase
        .from('profiles')
        .update({
          points: (profile.points || 0) + pointsEarned,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      
      toast({
        title: `🎮 Game Complete!`,
        description: `Final Score: ${score} | Earned: ${pointsEarned} points`,
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    if (gameOver && score > 0) {
      endGame();
    }
  }, [gameOver]);

  if (!user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full h-[600px] relative border border-purple-500/30 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              🎯 Click Challenge
            </h2>
            {!gameStarted ? (
              <div className="space-y-4">
                <p className="text-gray-400">
                  Click targets to earn points! Avoid bombs, collect shields, and build combos!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {targetTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div key={type.type} className="flex items-center space-x-2">
                        <Icon className={`w-5 h-5 ${type.color}`} />
                        <span className="text-gray-300">{type.points > 0 ? '+' : ''}{type.points}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                >
                  🚀 Start Game
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center text-lg">
                <div className="flex space-x-6">
                  <span className="text-cyan-400">Score: {score}</span>
                  <span className="text-yellow-400">Combo: {combo}</span>
                  <span className="text-purple-400">Level: {level}</span>
                </div>
                <div className="flex items-center space-x-4">
                  {hasShield && <Shield className="w-6 h-6 text-green-400" />}
                  <span className="text-red-400">⏰ {timeLeft}s</span>
                </div>
              </div>
            )}
          </div>

          {/* Game Area */}
          {gameStarted && !gameOver && (
            <div className="relative bg-gray-800 rounded-xl h-96 overflow-hidden border-2 border-cyan-500/30">
              <AnimatePresence>
                {targets.map((target) => {
                  const targetType = targetTypes.find(t => t.type === target.type);
                  const Icon = targetType?.icon || Target;
                  
                  return (
                    <motion.button
                      key={target.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => clickTarget(target)}
                      className="absolute w-16 h-16 rounded-full bg-gray-700 border-2 border-current flex items-center justify-center hover:bg-gray-600 transition-colors"
                      style={{
                        left: `${target.x}%`,
                        top: `${target.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Icon className={`w-8 h-8 ${targetType?.color}`} />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black px-1 rounded">
                        {target.timeLeft}
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {gameOver && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center space-y-4"
            >
              <h3 className="text-2xl font-bold text-white">🎮 Game Over!</h3>
              <p className="text-cyan-400 text-xl">Final Score: {score}</p>
              <p className="text-purple-400">Points Earned: {Math.floor(score / 10)}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  🔄 Play Again
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ClickChallengeGame;
