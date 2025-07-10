import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shuffle, Clock, Trophy, Lightbulb } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WordScrambleGameProps {
  onClose: () => void;
}

interface GameWord {
  word: string;
  hint: string;
  points: number;
}

const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ onClose }) => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [showHint, setShowHint] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [streak, setStreak] = useState(0);

  const gameWords: GameWord[] = [
    { word: "FORTNITE", hint: "Popular battle royale game", points: 15 },
    { word: "MINECRAFT", hint: "Block-building sandbox game", points: 20 },
    { word: "VALORANT", hint: "Tactical FPS by Riot Games", points: 18 },
    { word: "CONTROLLER", hint: "Gaming input device", points: 25 },
    { word: "ESPORTS", hint: "Competitive gaming", points: 15 },
    { word: "STREAMING", hint: "Live broadcasting games", points: 20 },
    { word: "MULTIPLAYER", hint: "Games with multiple players", points: 25 },
    { word: "RESPAWN", hint: "Coming back to life in game", points: 15 },
    { word: "HEADSHOT", hint: "Perfect aim in FPS games", points: 18 },
    { word: "CHECKPOINT", hint: "Save point in games", points: 22 },
    { word: "INVENTORY", hint: "Items storage in games", points: 20 },
    { word: "ACHIEVEMENT", hint: "Game accomplishment", points: 25 }
  ];

  const scrambleWord = (word: string): string => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    // Make sure scrambled word is different from original
    if (letters.join('') === word && word.length > 1) {
      return scrambleWord(word);
    }
    return letters.join('');
  };

  const shuffleWords = () => {
    const shuffled = [...gameWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [words, setWords] = useState<GameWord[]>([]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  const startGame = () => {
    const shuffledWords = shuffleWords().slice(0, 8); // Use 8 random words
    setWords(shuffledWords);
    setGameStarted(true);
    setGameOver(false);
    setCurrentWordIndex(0);
    setScore(0);
    setTimeLeft(90);
    setUserGuess('');
    setShowHint(false);
    setWordsCompleted(0);
    setStreak(0);
    setScrambledWord(scrambleWord(shuffledWords[0].word));
  };

  const handleGuess = () => {
    const currentWord = words[currentWordIndex];
    const guess = userGuess.toUpperCase().trim();
    
    if (guess === currentWord.word) {
      const streakBonus = streak >= 3 ? 10 : 0;
      const hintPenalty = showHint ? 5 : 0;
      const finalPoints = Math.max(currentWord.points + streakBonus - hintPenalty, 5);
      
      setScore(prev => prev + finalPoints);
      setWordsCompleted(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      toast({
        title: "🎉 Correct!",
        description: `+${finalPoints} points${streakBonus > 0 ? ` (+${streakBonus} streak)` : ''}`,
      });
      
      nextWord();
    } else {
      setStreak(0);
      toast({
        title: "❌ Wrong!",
        description: `Try again! The word was: ${currentWord.word}`,
        variant: "destructive",
      });
      
      setTimeout(() => {
        nextWord();
      }, 2000);
    }
  };

  const nextWord = () => {
    if (currentWordIndex + 1 >= words.length) {
      endGame();
    } else {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setScrambledWord(scrambleWord(words[nextIndex].word));
      setUserGuess('');
      setShowHint(false);
    }
  };

  const useHint = () => {
    setShowHint(true);
  };

  const reshuffleWord = () => {
    setScrambledWord(scrambleWord(words[currentWordIndex].word));
  };

  const endGame = async () => {
    setGameOver(true);
    
    if (!user || !profile) return;

    try {
      const pointsEarned = Math.floor(score / 3); // Convert game score to platform points
      
      const { error } = await supabase
        .from('profiles')
        .update({
          points: (profile.points || 0) + pointsEarned,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      
      toast({
        title: `🏆 Word Scramble Complete!`,
        description: `Score: ${score} | Earned: ${pointsEarned} points`,
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) return null;

  const currentWord = words[currentWordIndex];
  const progress = words.length > 0 ? ((currentWordIndex + 1) / words.length) * 100 : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[600px] relative border border-purple-500/30 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              🔀 Word Scramble
            </h2>
            {!gameStarted ? (
              <div className="space-y-4">
                <p className="text-gray-400">
                  Unscramble gaming-related words before time runs out!
                </p>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-cyan-400 mb-2">Game Rules:</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 90 seconds to solve as many words as possible</li>
                    <li>• Build streaks for bonus points</li>
                    <li>• Use hints (5 point penalty)</li>
                    <li>• Reshuffle letters anytime</li>
                  </ul>
                </div>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                >
                  🚀 Start Game
                </button>
              </div>
            ) : !gameOver ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cyan-400">Word {currentWordIndex + 1}/{words.length}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-yellow-400">Score: {score}</span>
                    <span className="text-green-400">Streak: {streak}</span>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-bold">{timeLeft}s</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {gameStarted && !gameOver && currentWord && (
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-white mb-4 tracking-widest">
                  {scrambledWord.split('').map((letter, index) => (
                    <motion.span
                      key={index}
                      className="inline-block mx-1 p-2 bg-gray-700 rounded"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
                
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-yellow-400 mb-4"
                  >
                    💡 Hint: {currentWord.hint}
                  </motion.p>
                )}
                
                <div className="flex justify-center space-x-4 mb-4">
                  <button
                    onClick={useHint}
                    disabled={showHint}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 flex items-center space-x-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Hint (-5pts)</span>
                  </button>
                  <button
                    onClick={reshuffleWord}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 flex items-center space-x-2"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Reshuffle</span>
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                    placeholder="Enter your guess..."
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={handleGuess}
                    disabled={!userGuess.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameOver && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center space-y-4"
            >
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">🔀 Game Complete!</h3>
              <div className="space-y-2">
                <p className="text-cyan-400 text-xl">Final Score: {score}</p>
                <p className="text-green-400">Words Completed: {wordsCompleted}/{words.length}</p>
                <p className="text-purple-400">Points Earned: {Math.floor(score / 3)}</p>
                <p className="text-gray-400">
                  Success Rate: {words.length > 0 ? Math.round((wordsCompleted / words.length) * 100) : 0}%
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  🔄 Play Again
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WordScrambleGame;
