
import { motion } from 'framer-motion';
import { Gamepad2, CreditCard, Shield, TrophyIcon, Zap, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Gamepad2,
      title: 'Gaming Rewards',
      description: 'Earn 5% cashback on all gaming purchases including games, hardware, and subscriptions.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: CreditCard,
      title: 'No Annual Fee',
      description: 'Enjoy all premium features without any annual fees. Build credit while gaming.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Fraud Protection',
      description: 'Advanced security features to protect your gaming purchases and personal information.',
      color: 'from-orange-600 to-red-500'
    },
    {
      icon: TrophyIcon,
      title: 'Exclusive Perks',
      description: 'Access to beta games, gaming events, and exclusive merchandise from your favorite brands.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Zap,
      title: 'Instant Approval',
      description: 'Get approved instantly and start earning rewards on your very first gaming purchase.',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: Users,
      title: 'Gaming Community',
      description: 'Join a community of gamers, share achievements, and compete in exclusive challenges.',
      color: 'from-red-500 to-orange-500'
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-3xl p-8 border border-orange-500/20">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Level Up Your Financial Game?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of gamers who are already earning rewards on every purchase.
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25">
              Apply Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
