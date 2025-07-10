
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  display_name: string;
  points: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, points')
        .not('points', 'is', null)
        .order('points', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Leaderboard fetch error:', error);
        throw error;
      }

      console.log('Leaderboard data:', data);

      const leaderboardWithRanks = (data || []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
        points: entry.points || 0,
        display_name: entry.display_name || 'Anonymous Gamer'
      }));

      setLeaderboard(leaderboardWithRanks);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <Award className="w-6 h-6 text-gray-500" />;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-orange-500";
      case 2:
        return "from-gray-300 to-gray-500";
      case 3:
        return "from-orange-400 to-red-500";
      default:
        return "from-gray-600 to-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-2">
          🏆 Leaderboard
        </h2>
        <p className="text-gray-400">Top gaming champions</p>
      </div>

      <div className="space-y-4">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.id}
            className={`relative p-4 rounded-xl border ${
              entry.rank <= 3 
                ? 'border-orange-500/50 bg-gradient-to-r from-gray-800/80 to-gray-900/80' 
                : 'border-gray-700/50 bg-gray-800/30'
            } transition-all duration-300 hover:scale-105`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getRankGradient(entry.rank)}`}>
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : (
                    <span className="text-white font-bold">#{entry.rank}</span>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {entry.display_name}
                  </h3>
                  <p className="text-gray-400 text-sm">Rank #{entry.rank}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">
                  💎 {entry.points.toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm">points</p>
              </div>
            </div>

            {entry.rank <= 3 && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${getRankGradient(entry.rank)} rounded-xl opacity-10 blur-xl -z-10`}
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No players yet. Be the first to join the leaderboard!</p>
        </div>
      )}
    </motion.div>
  );
};

export default Leaderboard;
