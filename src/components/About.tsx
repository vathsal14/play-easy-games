
import { motion } from 'framer-motion';
import { Target, Zap, Users, TrophyIcon } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: '1K+', label: 'Active Users', color: 'text-orange-400' },
    { icon: TrophyIcon, value: '$2M+', label: 'Rewards Earned', color: 'text-yellow-400' },
    { icon: Zap, value: '99.9%', label: 'Uptime', color: 'text-orange-500' },
    { icon: Target, value: '24/7', label: 'Support', color: 'text-red-400' }
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Built by Gamers, for Gamers
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                We are gamers passionate about gaming and esports. We recognized that gamers in India deserve financial products that fit their lifestyle. We see a world where gaming is not just a passion.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed mb-6">
                That's why we're building Aqube XP: India's first credit card designed for gamers, offering rewards, benefits, and experiences that truly matter to you.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Our mission is to revolutionize how India's gaming community manages money. Our vision is to bridge the gap between gaming and finance. We empower gamers to earn, save, and enjoy exclusive rewards on every transaction and promote financial literacy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Gaming-First Rewards</h4>
                  <p className="text-gray-400">Whether you're a casual mobile gamer or a professional esports athlete, Aqube XP will help you level up your gaming experience.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Financial Literacy</h4>
                  <p className="text-gray-400">By merging gaming and finance, Aqube is committed to increasing financial literacy and unlocking the full potential of gaming and esports industry.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Community Driven</h4>
                  <p className="text-gray-400">Aqube XP is more than a credit card—it's a movement to empower gamers and redefine how finance supports the gaming lifestyle in India and beyond.</p>
                </div>
              </div>
            </motion.div>
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

            {/* Mission statement */}
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
