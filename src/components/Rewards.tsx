
import { motion } from 'framer-motion';
import { Gift, Star, Crown, Zap } from 'lucide-react';

const Rewards = () => {
  const rewardTiers = [
    {
      icon: Star,
      name: 'Bronze Gamer',
      spending: '$0 - $499',
      cashback: '2%',
      perks: ['Basic rewards', 'Monthly statements', 'Mobile app access'],
      color: 'from-orange-600 to-red-600',
      borderColor: 'border-orange-500/30'
    },
    {
      icon: Gift,
      name: 'Silver Player',
      spending: '$500 - $1,999',
      cashback: '3.5%',
      perks: ['Enhanced rewards', 'Priority support', 'Beta game access', 'Exclusive discounts'],
      color: 'from-orange-500 to-yellow-500',
      borderColor: 'border-orange-400/50',
      popular: true
    },
    {
      icon: Crown,
      name: 'Gold Elite',
      spending: '$2,000+',
      cashback: '5%',
      perks: ['Maximum rewards', 'VIP support', 'Early game releases', 'Gaming event tickets', 'Premium merchandise'],
      color: 'from-yellow-400 to-orange-500',
      borderColor: 'border-yellow-500/50'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-orange-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            Rewards That Level Up
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The more you game, the more you earn. Our tiered reward system grows with your gaming journey, 
            unlocking better benefits and exclusive perks as you progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {rewardTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border ${tier.borderColor} hover:border-opacity-100 transition-all duration-300 hover:transform hover:scale-105 ${
                tier.popular ? 'ring-2 ring-orange-500/50' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className={`w-20 h-20 bg-gradient-to-r ${tier.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                <tier.icon className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 text-center">
                {tier.name}
              </h3>
              
              <p className="text-orange-400 text-center mb-4 font-semibold">
                {tier.spending}
              </p>

              <div className="text-center mb-8">
                <div className={`text-4xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                  {tier.cashback}
                </div>
                <div className="text-gray-400">Cashback Rate</div>
              </div>

              <ul className="space-y-3">
                {tier.perks.map((perk, perkIndex) => (
                  <li key={perkIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bonus Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-3xl p-8 border border-orange-500/20"
        >
          <div className="text-center mb-8">
            <Zap className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Bonus Categories
            </h3>
            <p className="text-gray-300 text-lg">
              Earn even more on your favorite gaming categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { category: 'Gaming Hardware', rate: '5%', icon: '🎮' },
              { category: 'Digital Games', rate: '4%', icon: '💾' },
              { category: 'Streaming Services', rate: '3%', icon: '📺' },
              { category: 'Gaming Accessories', rate: '3%', icon: '🎧' }
            ].map((bonus, index) => (
              <motion.div
                key={bonus.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-800/30 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{bonus.icon}</div>
                <div className="text-orange-400 font-bold text-xl mb-1">{bonus.rate}</div>
                <div className="text-gray-300 text-sm">{bonus.category}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Start Earning Today!
          </h3>
          <p className="text-gray-300 mb-6">
            Join thousands of users who are already earning points and redeeming amazing rewards.
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105">
            Get Started Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Rewards;
