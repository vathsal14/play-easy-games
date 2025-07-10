
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Clock, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TargetRushGameProps {
  onClose: () => void;
}

interface Target {
  id: string;
  x: number;
  y: number;
  color: 'red' | 'blue' | 'yellow' | 'green';
  points: number;
  speed: number;
  direction: { x: number; y: number };
  size: number;
}

const TargetRushGame: React.FC<TargetRushGameProps> = ({ onClose }) => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [targets, setTargets] = useState<Target[]>([]);
  const [targetsHit, setTargetsHit] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const targetColors = [
    { color: 'red', points: 10, speed: 2, size: 60, chance: 40 },
    { color: 'blue', points: 15, speed: 3, size: 50, chance: 30 },
    { color: 'yellow', points: 25, speed: 4, size: 40, chance: 20 },
    { color: 'green', points: 50, speed: 5, size: 30, chance: 10 }
  ];

  const getRandomTargetType = () => {
    const random = Math.random() * 100;
    let accumulator = 0;
    
    for (const targetType of targetColors) {
      accumulator += targetType.chance;
      if (random <= accumulator) {
        return targetType;
      }
    }
    return targetColors[0];
  };

  const spawnTarget = useCallback(() => {
    const targetType = getRandomTargetType();
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y, directionX, directionY;

    switch (edge) {
      case 0: // top
        x = Math.random() * 100;
        y = -5;
        directionX = (Math.random() - 0.5) * 2;
        directionY = 1;
        break;
      case 1: // right
        x = 105;
        y = Math.random() * 100;
        directionX = -1;
        directionY = (Math.random() - 0.5) * 2;
        break;
      case 2: // bottom
        x = Math.random() * 100;
        y = 105;
        directionX = (Math.random() - 0.5) * 2;
        directionY = -1;
        break;
      default: // left
        x = -5;
        y = Math.random() * 100;
        directionX = 1;
        directionY = (Math.random() - 0.5) * 2;
    }

    const newTarget: Target = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      color: targetType.color as 'red' | 'blue' | 'yellow' | 'green',
      points: targetType.points,
      speed: targetType.speed,
      direction: { x: directionX, y: directionY },
      size: targetType.size
    };
    
    setTargets(prev => [...prev, newTarget]);
  }, []);

  const hitTarget = (target: Target) => {
    const streakBonus = Math.floor(streak / 5) * 5;
    const finalPoints = target.points + streakBonus;
    
    setScore(prev => prev + finalPoints);
    setTargetsHit(prev => prev + 1);
    setStreak(prev => {
      const newStreak = prev + 1;
      setMaxStreak(current => Math.max(current, newStreak));
      return newStreak;
    });
    
    setTargets(prev => prev.filter(t => t.id !== target.id));
    
    if (streakBonus > 0) {
      toast({
        title: `🔥 ${streak + 1} Hit Streak!`,
        description: `${finalPoints} points! (+${streakBonus} bonus)`,
      });
    } else {
      toast({
        title: "🎯 Direct Hit!",
        description: `+${finalPoints} points`,
      });
    }
  };

  const missedClick = () => {
    if (streak > 0) {
      setStreak(0);
      toast({
        title: "❌ Missed!",
        description: "Streak reset!",
        variant: "destructive",
      });
    }
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

    const moveTargets = setInterval(() => {
      setTargets(prev => prev.map(target => {
        const newX = target.x + target.direction.x * target.speed;
        const newY = target.y + target.direction.y * target.speed;
        
        return {
          ...target,
          x: newX,
          y: newY
        };
      }).filter(target => 
        target.x > -10 && target.x < 110 && target.y > -10 && target.y < 110
      ));
    }, 50);

    const spawnTimer = setInterval(() => {
      if (targets.length < 8) {
        spawnTarget();
      }
    }, 1000);

    return () => {
      clearInterval(gameTimer);
      clearInterval(moveTargets);
      clearInterval(spawnTimer);
    };
  }, [gameStarted, gameOver, targets.length, spawnTarget]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    setTargets([]);
    setTargetsHit(0);
    setStreak(0);
    setMaxStreak(0);
    spawnTarget();
  };

  const endGame = async () => {
    if (!user || !profile) return;

    try {
      const pointsEarned = Math.floor(score / 5); // 1 point per 5 game score
      
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
        title: `🏆 Target Rush Complete!`,
        description: `Score: ${score} | Earned: ${pointsEarned} points`,
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

  const getTargetColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500 border-red-300';
      case 'blue': return 'bg-blue-500 border-blue-300';
      case 'yellow': return 'bg-yellow-500 border-yellow-300';
      case 'green': return 'bg-green-500 border-green-300';
      default: return 'bg-gray-500 border-gray-300';
    }
  };

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
              🎯 Target Rush
            </h2>
            {!gameStarted ? (
              <div className="space-y-4">
                <p className="text-gray-400">
                  Hit moving targets to earn points! Different colors give different scores. Build streaks for bonus points!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {targetColors.map((type) => (
                    <div key={type.color} className="flex items-center justify-center space-x-2">
                      <div className={`w-6 h-6 rounded-full ${getTargetColor(type.color)}`} />
                      <span className="text-gray-300">{type.points} pts</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                >
                  🚀 Start Rush
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center text-lg">
                <div className="flex space-x-6">
                  <span className="text-cyan-400">Score: {score}</span>
                  <span className="text-yellow-400">Hits: {targetsHit}</span>
                  <span className="text-green-400">Streak: {streak}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-bold">{timeLeft}s</span>
                </div>
              </div>
            )}
          </div>

          {/* Game Area */}
          {gameStarted && !gameOver && (
            <div 
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl h-96 overflow-hidden border-2 border-cyan-500/30 cursor-crosshair"
              onClick={missedClick}
            >
              <AnimatePresence>
                {targets.map((target) => (
                  <motion.button
                    key={target.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      hitTarget(target);
                    }}
                    className={`absolute rounded-full ${getTargetColor(target.color)} border-4 flex items-center justify-center hover:shadow-lg transition-all duration-100 cursor-pointer`}
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      width: `${target.size}px`,
                      height: `${target.size}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Target className="w-4 h-4 text-white" />
                  </motion.button>
                ))}
              </AnimatePresence>
              
              {/* Crosshair */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400/50"></div>
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-cyan-400/50"></div>
                </div>
              </div>
            </div>
          )}

          {gameOver && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center space-y-4"
            >
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">🏆 Rush Complete!</h3>
              <div className="space-y-2">
                <p className="text-cyan-400 text-xl">Final Score: {score}</p>
                <p className="text-yellow-400">Targets Hit: {targetsHit}</p>
                <p className="text-green-400">Max Streak: {maxStreak}</p>
                <p className="text-purple-400">Points Earned: {Math.floor(score / 5)}</p>
              </div>
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

export default TargetRushGame;
