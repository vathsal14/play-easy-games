
import { motion } from 'framer-motion';
import { Gamepad2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { title: 'Home', href: '#home' },
    { title: 'Features', href: '#features' },
    { title: 'About', href: '#about' },
    { title: 'FAQ', href: '#faq' },
    { title: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-orange-900/20 border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 md:col-span-2 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 mb-6"
            >
              <Gamepad2 className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Aqube XP
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-gray-400 mb-6 leading-relaxed"
            >
              Level up your financial game with India's first gaming credit card. Earn XP, unlock rewards, and get exclusive gaming perks.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 text-orange-400" />
                <span>support@aqube.xyz</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 text-orange-400" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Bengaluru, India</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1 md:col-span-1 flex flex-col justify-start">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg font-semibold text-orange-400 mb-4"
            >
              Quick Links
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {quickLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center"
                  whileHover={{ x: 5 }}
                >
                  <span className="mr-2">🔗</span>
                  {link.title}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Gaming Rewards */}
          <div className="lg:col-span-1 md:col-span-1 flex flex-col justify-start">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-lg font-semibold text-orange-400 mb-6"
            >
              Gaming Rewards
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <motion.a
                href="#rewards"
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ x: 5 }}
              >
                <span>🎮</span>
                <span>Game Store Discounts</span>
              </motion.a>
              <motion.a
                href="#rewards"
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ x: 5 }}
              >
                <span>🎮</span>
                <span>Gaming Gear Offers</span>
              </motion.a>
              <motion.a
                href="#rewards"
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ x: 5 }}
              >
                <span>🎮</span>
                <span>ESports Tournament Access</span>
              </motion.a>
            </motion.div>
          </div>
          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="border-t border-orange-500/20 mt-16 pt-8 lg:col-span-4 md:col-span-2"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                &copy; 2024 Aqube XP. All rights reserved. | Made with ❤️ for gamers
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
