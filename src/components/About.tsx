
import { motion } from 'framer-motion';
import { Target, Zap, Users, TrophyIcon, CheckCircle } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: '1K+', label: 'Pre Registers', color: 'text-orange-400' },
    { icon: TrophyIcon, value: '$2M+', label: 'Rewards Claimed', color: 'text-yellow-400' },
    { icon: Zap, value: '99.9%', label: 'System Uptime', color: 'text-orange-500' },
    { icon: Target, value: '24/7', label: 'Gamer Support', color: 'text-red-400' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-orange-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                About Aqube XP
              </h2>
              <p className="text-lg text-gray-300">
                We are gamers, passionate about gaming and esports. We recognized that gamers in India deserve 
                financial products that match their lifestyle. That's why we're building AqubeXP —India's first 
                credit card designed for gamers.
              </p>
              <p className="text-lg text-gray-300">
                Our mission is to revolutionize how India's gaming community manages money. Our vision is to bridge 
                the gap between gaming and finance—empowering gamers to earn, save, and enjoy exclusive rewards 
                on every transaction while promoting financial literacy.
              </p>
              <p className="text-lg text-gray-300">
                We believe gamers deserve more than just points—they deserve power. That's why our card isn't 
                just about spending smarter; it's about leveling up your life.
              </p>
            </div>

            {/* Key Features */}
            <div className="mt-8 space-y-4">
              <h3 className="text-2xl font-bold text-white">Key Features</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-orange-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Gaming-First Rewards</h4>
                    <p className="text-gray-300">Whether you're a casual mobile gamer or a pro esports athlete, Aqube XP levels up your experience.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-orange-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Financial Literacy</h4>
                    <p className="text-gray-300">AqubeXP merges gaming and finance to increase financial literacy within the gaming community.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-orange-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Industry Growth</h4>
                    <p className="text-gray-300">We're committed to unlocking the full potential of India's gaming and esports industry.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-orange-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Community Driven</h4>
                    <p className="text-gray-300">More than a credit card— AqubeXP is a movement built for and by gamers.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Right Column - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:transform hover:scale-105 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300`} />
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl p-8 border border-orange-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To empower gamers with financial tools that understand and reward their lifestyle, 
                creating a bridge between gaming passion and financial success in India and beyond.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
