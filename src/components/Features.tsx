
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, CreditCard, Zap, Trophy, Sparkles, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FeaturesProps {
  onGetStarted?: () => void;
}

const Features = ({ onGetStarted }: FeaturesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { user, signIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGetJerseyClick = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const features = [
    {
      icon: Gamepad2,
      title: 'All-in-One Platform',
      description: 'Access app and card features, including a gaming marketplace and expense tracking tool, for a unified gaming and fintech experience.',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: CreditCard,
      title: 'Transparent Payments',
      description: 'No hidden charges; choose between free and paid card options for extra advantages; enjoy 0% interest on select benefits.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Trophy,
      title: 'Rewards & Perks',
      description: 'Earn points, cashback, and exclusive offers tailored for gamers.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Sparkles,
      title: 'Exclusive Events & Progression',
      description: 'Participate in exclusive events, track your XP progress, and compete on leaderboards to unlock special perks.',
      color: 'from-red-500 to-purple-500'
    },
    {
      icon: Bot,
      title: 'AI Features',
      description: 'Utilize advanced AI tools for personalized recommendations and smart assistance.',
      color: 'from-purple-500 to-blue-500'
    }
  ];

  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % features.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isMobile, features.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            Unlock Gaming Rewards
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the perfect fusion of gaming and financial benefits. Our credit card is designed 
            specifically for gamers who want to maximize their rewards and build credit.
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex space-x-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                  className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:transform hover:scale-105 h-full min-w-[280px] max-w-[300px] snap-center flex-shrink-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-orange-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 leading-relaxed text-center group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="text-center mt-2 text-xs text-gray-500 md:hidden">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              Scroll to explore features
            </span>
          </div>
        </div>

        {/* Special Offer Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/5 to-yellow-500/5 backdrop-blur-sm border border-orange-500/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Left Column - Badge */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/30 to-yellow-500/30 rounded-full blur-lg opacity-75"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-yellow-500 p-6 rounded-full w-48 h-48 flex items-center justify-center">
                  <Trophy className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>
                        {/* Middle Column - Content */}
            <div className="flex flex-col justify-center text-center lg:text-left">
              <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-medium px-3 py-1.5 rounded-full mb-3 self-center lg:self-start">
                Exclusive Pre-registration Offer
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Free Official Esports Jersey
              </h3>
              <p className="text-gray-300 mb-6">
                All pre-registered users will receive an exclusive esports team jersey with their Aqube XP credit card.
              </p>
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={handleGetJerseyClick}
                    className="group relative px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-bold text-base text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
                  >
                    <span className="relative z-10">Secure Your Jersey Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}
              {user && (
                <p className="text-green-400 text-sm font-medium mt-2">
                  ✓ You're registered for the free jersey!
                </p>
              )}
            </div>
            
            {/* Right Column - Visual */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-xl -m-4"></div>
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-orange-500/20">
                  <div className="text-5xl font-black text-orange-500/10 absolute -top-2 right-2"></div>
                  <p className="text-white font-medium text-lg">Pre-register Now</p>
                  <p className="text-orange-400 font-bold text-2xl mt-1">Get Your Free Jersey</p>
                  <div className="relative h-64 w-full mt-4 overflow-hidden rounded-2xl border-2 border-orange-500/30 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl shadow-black/50 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-orange-500/20">
                    {/* Background with gradient overlay */}
                    <div className="absolute inset-0">
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.1)_0%,transparent_70%)]"></div>
                    </div>
                    
                    {/* Jersey Image */}
                    <div className="absolute inset-0 flex items-center justify-center p-0">
                      <img 
                        src="/images/jersey.png" 
                        alt="Aqube Esports Jersey" 
                        className="h-[160%] w-auto max-w-[160%] object-contain rounded-lg shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_50%] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Animated border highlight */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/50 transition-all duration-500"></div>
                    
                    {/* Limited edition tag */}
                    <div className="absolute -top-2 right-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg transform transition-all duration-300 group-hover:translate-y-1">
                      
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
