
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';
import { Crown, Medal, Award } from 'lucide-react';
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
import KeyGame from '../components/KeyGame';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSlotMachineModalOpen, setIsSlotMachineModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isWordScrambleModalOpen, setIsWordScrambleModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [isKeyGameOpen, setIsKeyGameOpen] = useState(false);
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
                <div className="text-center">
                  <motion.h1 
                    className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Welcome to Aqube XP
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-gray-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Not Just a Card
                    A Power-Up
                  </motion.p>
                </div>
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
                <Features onGetStarted={() => setIsAuthModalOpen(true)} />
              </section>
              
              <section id="about">
                <About />
              </section>

              {/* Survey Section */}
              

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
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-purple-500/30"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <h3 className="text-xl font-bold text-purple-400 mb-3">🔤 Word Scramble</h3>
                      <p className="text-gray-300 mb-4 text-sm">
                        Unscramble the letters to form valid words against the clock!
                      </p>
                      <button 
                        onClick={() => setIsWordScrambleModalOpen(true)}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        Play Now
                      </button>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-red-500/30"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <h3 className="text-xl font-bold text-red-400 mb-3">🔑 Key Game</h3>
                      <p className="text-gray-300 mb-3 text-sm">
                        Test your reflexes in this exciting key-based game!
                      </p>
                      <p className="text-xs text-yellow-400 mb-4 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clipRule="evenodd" />
                        </svg>
                        Best played on laptop/PC with keyboard
                      </p>
                      <button 
                        onClick={() => setIsKeyGameOpen(true)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
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
                      className="text-xl text-gray-300 mb-6 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      Compete with gamers worldwide and climb the leaderboard. Show off your gaming prowess and earn your place among the elite.
                    </motion.p>
                    <motion.div
                      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500/20 to-green-400/20 p-6 shadow-lg transition-all duration-300 hover:shadow-xl border-2 border-green-500/50 hover:scale-[1.02] mb-8 w-[300px] h-[300px] flex flex-col justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <span className="text-4xl">🎁</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Surprise Giveaway!</h3>
                        <p className="text-sm text-white/80">
                          Top contenders will receive exclusive surprises after launch. Compete now for your chance to win!
                        </p>
                      </div>
                      <div className="flex justify-center gap-4 mt-4">
                        <Crown className="h-8 w-8 text-orange-500" />
                        <Medal className="h-8 w-8 text-yellow-400" />
                        <Award className="h-8 w-8 text-orange-400" />
                      </div>
                    </motion.div>
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
          
          {isKeyGameOpen && (
            <KeyGame isOpen={isKeyGameOpen} onClose={() => setIsKeyGameOpen(false)} />
          )}
          
          {isSurveyModalOpen && (
            <SurveyForm onClose={() => setIsSurveyModalOpen(false)} />
          )}
        </div>
      </div>
    </MobileOptimizedLayout>
  </AuthProvider>
  );
}

export default Index;
