
import { motion } from 'framer-motion';
import { Star, Download, Users } from 'lucide-react';

const FeaturedGames = () => {
  const games = [
    {
      id: 1,
      title: "Gaming Rewards",
      description: "Earn points and cashback on every gaming purchase",
      image: "/placeholder.svg",
      rating: 4.8,
      downloads: "10K+",
      users: "5K+"
    },
    {
      id: 2,
      title: "XP Tracker",
      description: "Track your gaming progress and unlock achievements",
      image: "/placeholder.svg",
      rating: 4.9,
      downloads: "15K+",
      users: "8K+"
    },
    {
      id: 3,
      title: "Credit Builder",
      description: "Build your credit score through gaming activities",
      image: "/placeholder.svg",
      rating: 4.7,
      downloads: "12K+",
      users: "6K+"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            Featured Benefits
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the exclusive features that make AqubeXP the ultimate gaming credit card
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group hover:transform hover:scale-105"
            >
              <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {game.title.charAt(0)}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                {game.title}
              </h3>
              
              <p className="text-gray-400 mb-4 leading-relaxed">
                {game.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{game.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{game.downloads}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{game.users}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;
