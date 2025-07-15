
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  id: string;
  display_name: string;
  points: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      // Fetch top 3 members
      const { data: topMembers, error: topError } = await supabase
        .from('profiles')
        .select('id, display_name, points')
        .not('points', 'is', null)
        .order('points', { ascending: false })
        .limit(3);

      // Fetch user's position if logged in
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, display_name, points')
          .not('points', 'is', null)
          .order('points', { ascending: false })
          .eq('id', user.id)
          .single();

        if (userError) throw userError;
        
        // Find user's position
        const { count: userRank } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .not('points', 'is', null)
          .gt('points', userData?.points || 0);

        setUserPosition({
          ...userData,
          rank: (userRank || 0) + 1,
          points: userData?.points || 0,
          display_name: userData?.display_name || 'Anonymous Gamer'
        });
      }

      if (topError) {
        console.error('Top members fetch error:', topError);
        throw topError;
      }

      const topMembersWithRanks = (topMembers || []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
        points: entry.points || 0,
        display_name: entry.display_name || 'Anonymous Gamer'
      }));

      setLeaderboard(topMembersWithRanks);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-gold-500 to-gold-300';
      case 2:
        return 'from-silver-500 to-silver-300';
      case 3:
        return 'from-bronze-500 to-bronze-300';
      default:
        return 'from-gray-500 to-gray-300';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-gold" />;
      case 2:
        return <Medal className="w-6 h-6 text-silver" />;
      case 3:
        return <Award className="w-6 h-6 text-bronze" />;
      default:
        return <Trophy className="w-6 h-6 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-2">
          🏆 Leaderboard
        </h2>
        <p className="text-gray-400 text-lg">Top gaming champions</p>
      </motion.div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-14 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl mb-4" />
          <div className="h-14 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl mb-4" />
          <div className="h-14 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl" />
        </div>
      ) : (
        <>
          {/* Top 3 Members */}
          {leaderboard.map((entry) => (
            <motion.div
              key={entry.id}
              className={`relative overflow-hidden rounded-xl ${
                entry.rank === 1 
                  ? 'bg-gradient-to-r from-orange-500/20 to-orange-400/20 border-2 border-orange-500/50' 
                  : entry.rank === 2 
                  ? 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-2 border-gray-300/50' 
                  : entry.rank === 3 
                  ? 'bg-gradient-to-r from-orange-300/20 to-orange-400/20 border-2 border-orange-300/50' 
                  : 'bg-card'
              } p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
            >
              {entry.rank <= 3 && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${getRankGradient(entry.rank)} rounded-xl opacity-10 blur-xl -z-10`}
                  animate={{ opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${
                      entry.rank === 1 ? 'text-orange-500' 
                      : entry.rank === 2 ? 'text-gray-300' 
                      : entry.rank === 3 ? 'text-orange-400' 
                      : 'text-white'
                    }`}>
                      {entry.rank}
                    </span>
                    <span className="text-lg font-semibold text-white">{entry.display_name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-white/80">
                      {entry.points.toLocaleString()} XP
                    </span>
                  </div>
                </div>
                {entry.rank === 1 && (
                  <Crown className="h-8 w-8 text-orange-500" />
                )}
                {entry.rank === 2 && (
                  <Medal className="h-8 w-8 text-gray-300" />
                )}
                {entry.rank === 3 && (
                  <Award className="h-8 w-8 text-orange-400" />
                )}
              </div>
            </motion.div>
          ))}

          {/* User's Position */}
          {user && userPosition && (
            <motion.div
              key={user.id}
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-400/20 p-4 shadow-lg transition-all duration-300 hover:shadow-xl border-2 border-orange-500/50 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-orange-500">
                      {userPosition.rank}
                    </span>
                    <span className="text-lg font-semibold">{userPosition.display_name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {userPosition.points.toLocaleString()} XP
                  </div>
                </div>
                <Trophy className="h-6 w-6 text-orange-500" />
              </div>
            </motion.div>
          )}

          {/* Surprise Giveaway Announcement */}
          <motion.div
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500/20 to-green-400/20 p-4 shadow-lg transition-all duration-300 hover:shadow-xl border-2 border-green-500/50 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div>
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-2xl font-bold text-green-500">
                    🎁
                  </span>
                  <span className="text-lg font-semibold text-white">Surprise Giveaway!</span>
                </motion.div>
                <motion.div
                  className="text-sm text-white/80"
                  whileHover={{ scale: 1.05 }}
                >
                  Top 3 contenders will receive exclusive rewards every month!
                </motion.div>
              </div>
              <motion.div
                className="flex gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Crown className="h-8 w-8 text-orange-500" />
                <Medal className="h-8 w-8 text-gray-300" />
                <Award className="h-8 w-8 text-orange-400" />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}

      {leaderboard.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No players yet. Be the first to join the leaderboard!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
