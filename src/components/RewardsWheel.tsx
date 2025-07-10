
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const RewardsWheel = ({ onClose, onSpinComplete, user }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const prizes = [
    { points: 50, color: '#ef4444', label: '50 pts' },
    { points: 100, color: '#f97316', label: '100 pts' },
    { points: 25, color: '#eab308', label: '25 pts' },
    { points: 200, color: '#22c55e', label: '200 pts' },
    { points: 75, color: '#3b82f6', label: '75 pts' },
    { points: 150, color: '#8b5cf6', label: '150 pts' },
    { points: 500, color: '#ec4899', label: '500 pts' },
    { points: 300, color: '#06b6d4', label: '300 pts' },
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    // Generate random rotation (at least 5 full spins + random position)
    const spins = 5 + Math.random() * 5;
    const finalRotation = rotation + spins * 360;
    
    setRotation(finalRotation);
    
    // Calculate which prize was landed on
    const normalizedRotation = finalRotation % 360;
    const prizeIndex = Math.floor(((360 - normalizedRotation) / 360) * prizes.length);
    const wonPrize = prizes[prizeIndex];
    
    setTimeout(() => {
      setIsSpinning(false);
      setResult(wonPrize);
      onSpinComplete(wonPrize.points);
    }, 3000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gray-800 rounded-2xl p-8 max-w-md w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Rewards Wheel</h2>
            <p className="text-gray-400 mb-8">Spin to earn points!</p>

            <div className="relative mx-auto w-64 h-64 mb-8">
              {/* Wheel */}
              <motion.div
                className="w-full h-full rounded-full relative overflow-hidden border-4 border-white shadow-2xl"
                animate={{ rotate: rotation }}
                transition={{ duration: 3, ease: "easeOut" }}
              >
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index;
                  const nextAngle = (360 / prizes.length) * (index + 1);
                  
                  return (
                    <div
                      key={index}
                      className="absolute w-full h-full"
                      style={{
                        background: `conic-gradient(from ${angle}deg, ${prize.color} ${angle}deg, ${prize.color} ${nextAngle}deg, transparent ${nextAngle}deg)`,
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((nextAngle * Math.PI) / 180)}%)`
                      }}
                    >
                      <div 
                        className="absolute text-white font-bold text-sm"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${angle + (360 / prizes.length) / 2}deg) translateY(-60px)`
                        }}
                      >
                        {prize.label}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
                <div className="w-4 h-8 bg-white border-2 border-gray-800" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
              </div>

              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full border-4 border-white z-10 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-600 rounded-lg"
              >
                <h3 className="text-xl font-bold">Congratulations!</h3>
                <p>You won {result.points} points!</p>
              </motion.div>
            )}

            <motion.button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                isSpinning 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
              whileHover={!isSpinning ? { scale: 1.05 } : {}}
              whileTap={!isSpinning ? { scale: 0.95 } : {}}
            >
              {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RewardsWheel;
