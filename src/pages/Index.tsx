
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';
import MobileOptimizedLayout from '../components/MobileOptimizedLayout';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import ReferAndEarn from '../components/ReferAndEarn';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import AuthPage from '../components/AuthPage';
import GamingSlotMachine from '../components/GamingSlotMachine';
import GamingQuiz from '../components/GamingQuiz';
import WordScrambleGame from '../components/WordScrambleGame';
import Leaderboard from '../components/Leaderboard';
import SurveyForm from '../components/SurveyForm';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSlotMachineModalOpen, setIsSlotMachineModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isWordScrambleModalOpen, setIsWordScrambleModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple loading sequence
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    const animationTimer = setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 3000);
    
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(animationTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full mx-auto animate-spin"></div>
          <p className="text-orange-400 mt-4">Loading Aqube XP...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <MobileOptimizedLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900/20 text-white">
          {/* Welcome Animation */}
          <AnimatePresence>
            {showWelcomeAnimation && (
              <motion.div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-orange-900/20"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.h1 
                    className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-4"
                    animate={{ 
                      textShadow: [
                        "0 0 20px rgba(251, 146, 60, 0.5)",
                        "0 0 40px rgba(251, 146, 60, 0.8)",
                        "0 0 20px rgba(251, 146, 60, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Aqube XP
                  </motion.h1>
                  <motion.p 
                    className="text-xl md:text-2xl text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Level Up Your Credit Game
                  </motion.p>
                  <motion.div
                    className="mt-6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full mx-auto"></div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={showWelcomeAnimation ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
            <Navbar 
              onAuthClick={() => setIsAuthModalOpen(true)}
              onWheelClick={() => setIsSlotMachineModalOpen(true)}
            />
            
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: showWelcomeAnimation ? 0 : 1 }}
              transition={{ duration: 0.5, delay: showWelcomeAnimation ? 0 : 0.5 }}
            >
              <section id="home">
                <Hero onGetStarted={() => setIsAuthModalOpen(true)} />
              </section>
              
              <section id="features">
                <Features />
              </section>
              
              <section id="about">
                <About />
              </section>

              {/* Survey Section */}
              <section id="survey" className="py-20 bg-gradient-to-br from-gray-900 via-orange-900/20 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                      Help Us Serve You Better
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                      Share your gaming preferences and financial needs to help us create the perfect credit card for you.
                    </p>
                    <motion.button
                      onClick={() => setIsSurveyModalOpen(true)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Take Survey
                    </motion.button>
                  </motion.div>
                </div>
              </section>

              {/* Games Section */}
              <section id="games" className="py-20 bg-gradient-to-br from-black via-gray-900 to-orange-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                      Gaming Arena
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                      Play games, earn points, and climb the leaderboard!
                    </p>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    
                    <motion.div
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-yellow-500/30"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <h3 className="text-xl font-bold text-yellow-400 mb-3">🎰 Slot Machine</h3>
                      <p className="text-gray-300 mb-4 text-sm">
                        Try your luck! Win points and prizes with lucky streaks.
                      </p>
                      <button
                        onClick={() => setIsSlotMachineModalOpen(true)}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-200"
                      >
                        Spin Now
                      </button>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-green-500/30"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h3 className="text-xl font-bold text-green-400 mb-3">🧠 Gaming Quiz</h3>
                      <p className="text-gray-300 mb-4 text-sm">
                        Test your gaming knowledge with timed questions.
                      </p>
                      <button
                        onClick={() => setIsQuizModalOpen(true)}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200"
                      >
                        Start Quiz
                      </button>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-red-500/30"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <h3 className="text-xl font-bold text-red-400 mb-3">🔀 Word Scramble</h3>
                      <p className="text-gray-300 mb-4 text-sm">
                        Unscramble gaming words before time runs out!
                      </p>
                      <button
                        onClick={() => setIsWordScrambleModalOpen(true)}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-orange-700 transition-all duration-200"
                      >
                        Play Now
                      </button>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Leaderboard Section */}
              <section id="leaderboard" className="py-20 bg-gradient-to-br from-gray-900 via-orange-900/20 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div>
                      <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        Hall of Fame
                      </motion.h2>
                      <motion.p
                        className="text-xl text-gray-300 mb-8 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        Compete with gamers worldwide and climb the leaderboard. Show off your gaming prowess and earn your place among the elite.
                      </motion.p>
                    </div>
                    <Leaderboard />
                  </div>
                </div>
              </section>
              
              <section id="refer">
                <ReferAndEarn />
              </section>
              
              <section id="faq">
                <FAQ />
              </section>
            </motion.main>
            
            <Footer />
            
            {isAuthModalOpen && (
              <AuthPage onClose={() => setIsAuthModalOpen(false)} />
            )}
            
            {isSlotMachineModalOpen && (
              <GamingSlotMachine onClose={() => setIsSlotMachineModalOpen(false)} />
            )}
            


            {isQuizModalOpen && (
              <GamingQuiz onClose={() => setIsQuizModalOpen(false)} />
            )}

            {isWordScrambleModalOpen && (
              <WordScrambleGame onClose={() => setIsWordScrambleModalOpen(false)} />
            )}

            {isSurveyModalOpen && (
              <SurveyForm onClose={() => setIsSurveyModalOpen(false)} />
            )}
          </div>
        </div>
      </MobileOptimizedLayout>
    </AuthProvider>
  );
};

export default Index;
