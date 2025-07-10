import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Clock, Trophy, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GamingQuizProps {
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  points: number;
}

const GamingQuiz: React.FC<GamingQuizProps> = ({ onClose }) => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [canPlayToday, setCanPlayToday] = useState(true);
  const [dailyQuestions, setDailyQuestions] = useState<Question[]>([]);

  const allQuestions: Question[] = [
    {
      id: 1,
      question: "Which game popularized the Battle Royale genre?",
      options: ["Fortnite", "PUBG", "Apex Legends", "Call of Duty: Warzone"],
      correct: 1,
      points: 10
    },
    {
      id: 2,
      question: "What does 'FPS' stand for in gaming?",
      options: ["First Person Shooter", "Frames Per Second", "Fast Paced Strategy", "Both A and B"],
      correct: 3,
      points: 15
    },
    {
      id: 3,
      question: "Which company developed the game 'Among Us'?",
      options: ["InnerSloth", "Epic Games", "Valve", "Riot Games"],
      correct: 0,
      points: 20
    },
    {
      id: 4,
      question: "What is the maximum level in most Pokemon games?",
      options: ["50", "99", "100", "120"],
      correct: 2,
      points: 10
    },
    {
      id: 5,
      question: "Which gaming platform is owned by Valve?",
      options: ["Epic Games Store", "Steam", "Origin", "Uplay"],
      correct: 1,
      points: 15
    },
    {
      id: 6,
      question: "What does 'RPG' stand for?",
      options: ["Real Player Game", "Role Playing Game", "Rapid Pace Gaming", "Random Player Generator"],
      correct: 1,
      points: 10
    },
    {
      id: 7,
      question: "Which esports tournament has the highest prize pool?",
      options: ["League of Legends Worlds", "The International (Dota 2)", "CS:GO Major", "Fortnite World Cup"],
      correct: 1,
      points: 25
    },
    {
      id: 8,
      question: "What is the currency called in Minecraft?",
      options: ["Coins", "Emeralds", "Diamonds", "There is no official currency"],
      correct: 3,
      points: 15
    },
    {
      id: 9,
      question: "Which game was the first to introduce the 'loot box' concept?",
      options: ["FIFA", "Counter-Strike", "Team Fortress 2", "Overwatch"],
      correct: 2,
      points: 20
    },
    {
      id: 10,
      question: "What does 'NPC' stand for?",
      options: ["New Player Character", "Non-Player Character", "Network Protocol Control", "Next Phase Challenge"],
      correct: 1,
      points: 10
    },
    {
      id: 11,
      question: "Which game engine is used by Epic Games?",
      options: ["Unity", "Unreal Engine", "CryEngine", "Godot"],
      correct: 1,
      points: 15
    },
    {
      id: 12,
      question: "What is the highest rank in Valorant?",
      options: ["Immortal", "Radiant", "Champion", "Ascendant"],
      correct: 1,
      points: 20
    },
    {
      id: 13,
      question: "Which company created League of Legends?",
      options: ["Blizzard", "Riot Games", "Valve", "Epic Games"],
      correct: 1,
      points: 15
    },
    {
      id: 14,
      question: "What does 'MMO' stand for?",
      options: ["Massive Multiplayer Online", "Multi-Mode Operation", "Maximum Memory Optimization", "Main Menu Options"],
      correct: 0,
      points: 10
    },
    {
      id: 15,
      question: "Which game popularized the term 'camping' in FPS games?",
      options: ["Doom", "Quake", "Counter-Strike", "Call of Duty"],
      correct: 2,
      points: 15
    },
    {
      id: 16,
      question: "What is the currency in Roblox called?",
      options: ["Coins", "Robux", "Gems", "Credits"],
      correct: 1,
      points: 10
    },
    {
      id: 17,
      question: "Which game introduced the concept of 'respawning'?",
      options: ["Doom", "Wolfenstein", "Quake", "Duke Nukem"],
      correct: 0,
      points: 20
    },
    {
      id: 18,
      question: "What does 'GG' commonly mean in gaming?",
      options: ["Great Game", "Good Game", "Get Going", "Gamer's Guild"],
      correct: 1,
      points: 10
    },
    {
      id: 19,
      question: "Which game has the most registered players worldwide?",
      options: ["Minecraft", "Fortnite", "PUBG Mobile", "League of Legends"],
      correct: 0,
      points: 25
    },
    {
      id: 20,
      question: "What is the maximum number of players in a Fall Guys match?",
      options: ["50", "60", "100", "120"],
      correct: 1,
      points: 15
    }
  ];

  // Generate daily questions based on current date
  const getDailyQuestions = () => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Use date as seed for consistent daily questions
    const shuffled = [...allQuestions];
    let currentIndex = shuffled.length;
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    // Shuffle with date-based seed
    let seedValue = seed;
    while (currentIndex !== 0) {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      const randomIndex = Math.floor(random(seedValue) * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }
    
    return shuffled.slice(0, 8); // Return 8 questions for the day
  };

  // Check if user can play today
  const checkCanPlayToday = () => {
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem(`quiz_last_played_${user?.id}`);
    return lastPlayed !== today;
  };

  useEffect(() => {
    if (user) {
      const canPlay = checkCanPlayToday();
      setCanPlayToday(canPlay);
      if (canPlay) {
        setDailyQuestions(getDailyQuestions());
      }
    }
  }, [user]);

  useEffect(() => {
    if (!gameStarted || gameOver || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, showResult, currentQuestion]);

  const startGame = () => {
    if (!canPlayToday) {
      toast({
        title: "⏰ Come back tomorrow!",
        description: "You can only play the quiz once per day. New questions available tomorrow!",
        variant: "destructive",
      });
      return;
    }

    setGameStarted(true);
    setGameOver(false);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === dailyQuestions[currentQuestion].correct;
    if (isCorrect) {
      setScore(prev => prev + dailyQuestions[currentQuestion].points);
      setCorrectAnswers(prev => prev + 1);
    }

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleTimeout = () => {
    setSelectedAnswer(-1); // -1 indicates timeout
    setShowResult(true);
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= dailyQuestions.length) {
      endGame();
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(15);
    }
  };

  const endGame = async () => {
    setGameOver(true);
    
    // Mark as played today
    const today = new Date().toDateString();
    localStorage.setItem(`quiz_last_played_${user?.id}`, today);
    setCanPlayToday(false);
    
    if (!user || !profile) return;

    try {
      const pointsEarned = Math.floor(score / 2);
      
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
        title: `🧠 Quiz Complete!`,
        description: `Score: ${score} | Earned: ${pointsEarned} points`,
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) return null;

  const currentQ = dailyQuestions[currentQuestion];
  const progress = dailyQuestions.length > 0 ? ((currentQuestion + 1) / dailyQuestions.length) * 100 : 0;

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
              🧠 Gaming Quiz
            </h2>
            {!gameStarted ? (
              <div className="space-y-4">
                {canPlayToday ? (
                  <>
                    <p className="text-gray-400">
                      Test your gaming knowledge! Answer {dailyQuestions.length} questions in 15 seconds each.
                    </p>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-cyan-400 mb-2">Today's Challenge:</p>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• {dailyQuestions.length} daily questions</li>
                        <li>• 15 seconds per question</li>
                        <li>• One attempt per day</li>
                        <li>• New questions every day</li>
                      </ul>
                    </div>
                    <button
                      onClick={startGame}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                    >
                      🚀 Start Today's Quiz
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-yellow-400 text-lg">⏰ Quiz Complete for Today!</p>
                    <p className="text-gray-400">
                      You've already completed today's quiz. Come back tomorrow for new questions!
                    </p>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-cyan-400">🎯 Tomorrow's quiz will feature:</p>
                      <ul className="text-sm text-gray-300 space-y-1 mt-2">
                        <li>• Fresh set of questions</li>
                        <li>• New gaming challenges</li>
                        <li>• More points to earn</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : !gameOver ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cyan-400">Question {currentQuestion + 1}/{dailyQuestions.length}</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-bold">{timeLeft}s</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="text-center">
                  <span className="text-yellow-400">Score: {score}</span>
                </div>
              </div>
            ) : null}
          </div>

          {gameStarted && !gameOver && currentQ && (
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">{currentQ.question}</h3>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                        selectedAnswer === null
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : showResult && index === currentQ.correct
                          ? 'bg-green-600 text-white'
                          : showResult && index === selectedAnswer && index !== currentQ.correct
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                      whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && index === currentQ.correct && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center"
                  >
                    {selectedAnswer === currentQ.correct ? (
                      <p className="text-green-400 font-bold">
                        🎉 Correct! +{currentQ.points} points
                      </p>
                    ) : selectedAnswer === -1 ? (
                      <p className="text-red-400 font-bold">
                        ⏰ Time's up!
                      </p>
                    ) : (
                      <p className="text-red-400 font-bold">
                        ❌ Wrong answer!
                      </p>
                    )}
                  </motion.div>
                )}
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
              <h3 className="text-2xl font-bold text-white">🧠 Quiz Complete!</h3>
              <div className="space-y-2">
                <p className="text-cyan-400 text-xl">Final Score: {score}</p>
                <p className="text-green-400">Correct Answers: {correctAnswers}/{dailyQuestions.length}</p>
                <p className="text-purple-400">Points Earned: {Math.floor(score / 2)}</p>
                <p className="text-gray-400">
                  Accuracy: {Math.round((correctAnswers / dailyQuestions.length) * 100)}%
                </p>
                <p className="text-yellow-400 text-sm mt-4">
                  🎯 Come back tomorrow for new questions!
                </p>
              </div>
              <div className="flex justify-center">
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

export default GamingQuiz;
