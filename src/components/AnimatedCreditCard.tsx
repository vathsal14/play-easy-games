
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const AnimatedCreditCard = () => {
  const { profile } = useAuth();
  const displayName = profile?.display_name || 'Gaming Elite';
  return (
    <motion.div
      className="relative w-96 h-60 perspective-1000"
      initial={{ rotateY: -30, rotateX: 15 }}
      animate={{ 
        rotateY: [-30, 5, -30],
        rotateX: [15, -5, 15]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 shadow-2xl transform-gpu preserve-3d">
        {/* Card Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/30 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border border-white/20 rounded-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full"></div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 p-6 flex flex-col justify-between h-full">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white font-bold text-lg">Aqube XP</h3>
              <p className="text-orange-100 text-sm">Elite Gamer</p>
            </div>
            
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <div className="text-white font-mono text-xl tracking-widest">
              •••• •••• •••• 1234
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-orange-100 text-xs uppercase tracking-wide">Cardholder</p>
                <p className="text-white font-semibold truncate max-w-[180px]">{displayName}</p>
              </div>
              <div className="text-right">
                <p className="text-orange-100 text-xs uppercase tracking-wide">Expires</p>
                <p className="text-white font-semibold">12/28</p>
              </div>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/50 to-yellow-400/50 blur-xl -z-10 transform scale-110"></div>
      </div>
    </motion.div>
  );
};

export default AnimatedCreditCard;
