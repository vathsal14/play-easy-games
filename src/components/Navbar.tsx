
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NavbarProps {
  onAuthClick: () => void;
  onWheelClick: () => void;
}

const Navbar = ({ onAuthClick, onWheelClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Refer & Earn', href: '#refer' },
    { name: 'FAQ', href: '#faq' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <motion.nav 
      className="fixed top-0 w-full bg-black/95 backdrop-blur-sm border-b border-orange-500/30 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              AqubeXP
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-300 hover:text-orange-400 transition-colors duration-200 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-yellow-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <motion.button
                  onClick={onWheelClick}
                  className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 140, 0, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎰 Slot Machine ({profile?.spins || 0})
                </motion.button>
                <div className="bg-gray-800 px-3 py-1 rounded-full border border-orange-500/30 shadow-lg">
                  <span className="text-orange-400 font-semibold">💎 {profile?.points || 0}</span>
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 140, 0, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                Join Aqube XP
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-gray-900/95 backdrop-blur-sm rounded-lg mt-2 p-4 border border-orange-500/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left py-3 text-gray-300 hover:text-orange-400 transition-colors duration-200 border-b border-gray-800 last:border-b-0"
              >
                {item.name}
              </button>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-700">
              {user ? (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-orange-400 font-semibold">💎 {profile?.points || 0}</span>
                    <span className="text-yellow-400">🎰 {profile?.spins || 0} spins</span>
                  </div>
                  <button
                    onClick={onWheelClick}
                    className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 px-4 py-3 rounded-lg font-semibold text-white mb-2"
                  >
                    Slot Machine
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-gray-300 hover:text-white py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 px-4 py-3 rounded-lg text-white font-semibold"
                >
                  Join Aqube XP
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
