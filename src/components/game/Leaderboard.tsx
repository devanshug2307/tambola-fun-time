import React, { useState } from "react";
import {
  Trophy,
  Medal,
  Users,
  Crown,
  Star,
  Award,
  X,
  ChevronUp,
  ChevronDown,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Leaderboard.css";

interface LeaderboardProps {
  leaderboard: { playerName: string; pattern: string }[];
  players: { name: string }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboard = [],
  players,
}) => {
  const [activeTab, setActiveTab] = useState<"winners" | "players">("winners");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Get unique winners
  const uniqueWinners = Array.from(
    new Set(leaderboard.map((entry) => entry.playerName))
  );

  // Patterns and their associated icons/colors
  const patternDetails: Record<string, { icon: JSX.Element; color: string }> = {
    "Full House": {
      icon: <Crown size={18} />,
      color: "#4F46E5", // Indigo
    },
    "Early 5": {
      icon: <Star size={18} />,
      color: "#EC4899", // Pink
    },
    "Top Line": {
      icon: <Award size={18} />,
      color: "#10B981", // Green
    },
    "Middle Line": {
      icon: <Medal size={18} />,
      color: "#F59E0B", // Amber
    },
    "Bottom Line": {
      icon: <Trophy size={18} />,
      color: "#8B5CF6", // Purple
    },
  };

  const handleWinnerClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const toggleLeaderboard = () => {
    setIsOpen(!isOpen);
  };

  // Generate confetti elements
  const generateConfetti = () => {
    const confettiElements = [];
    const colors = ["#FF77FF", "#77DDFF", "#FFDD77", "#77FF77", "#FF7777"];

    for (let i = 0; i < 30; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const size = 5 + Math.random() * 10;
      const color = colors[Math.floor(Math.random() * colors.length)];

      confettiElements.push(
        <motion.div
          key={`confetti-${i}`}
          className="absolute"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: i % 2 === 0 ? "50%" : "0%",
            left: `${left}%`,
            top: 0,
            zIndex: 20,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: ["0%", "100%"],
            x: [`${(Math.random() - 0.5) * 100}px`],
            opacity: [0, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: delay,
            ease: "easeOut",
          }}
        />
      );
    }

    return confettiElements;
  };

  return (
    <div className="relative">
      {/* Mobile-friendly floating button to toggle leaderboard */}
      <motion.button
        className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-3 shadow-lg z-30 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleLeaderboard}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="flex items-center">
            <Trophy size={20} className="mr-2" />
            <span className="mr-1 font-medium">
              {leaderboard.length > 0 ? leaderboard.length : ""}
            </span>
          </div>
        )}
      </motion.button>

      {/* Leaderboard panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-x-0 bottom-0 bg-white shadow-lg rounded-t-2xl z-20 max-h-[80vh] overflow-hidden flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Drag handle */}
            <div
              className="flex justify-center py-2 cursor-pointer"
              onClick={toggleLeaderboard}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Confetti container */}
            {showConfetti && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {generateConfetti()}
              </div>
            )}

            {/* Header section */}
            <motion.div
              className="px-4 pt-2 pb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="text-yellow-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
              </div>

              {/* Tab navigation */}
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === "winners"
                      ? "bg-white text-purple-600 shadow"
                      : "text-gray-600 hover:text-purple-500"
                  }`}
                  onClick={() => setActiveTab("winners")}
                >
                  <Trophy size={16} />
                  <span>Winners</span>
                  <span className="ml-1 px-1.5 py-0.5 bg-gray-200 text-xs font-semibold rounded-full">
                    {leaderboard.length}
                  </span>
                </button>
                <button
                  className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === "players"
                      ? "bg-white text-purple-600 shadow"
                      : "text-gray-600 hover:text-purple-500"
                  }`}
                  onClick={() => setActiveTab("players")}
                >
                  <Users size={16} />
                  <span>Players</span>
                  <span className="ml-1 px-1.5 py-0.5 bg-gray-200 text-xs font-semibold rounded-full">
                    {players.length}
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <AnimatePresence mode="wait">
                {activeTab === "winners" && (
                  <motion.div
                    key="winners-tab"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {leaderboard.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {leaderboard.map((entry, index) => (
                          <motion.div
                            key={`${entry.playerName}-${entry.pattern}-${index}`}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                            whileHover={{
                              scale: 1.02,
                              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            onClick={handleWinnerClick}
                          >
                            <div
                              className="px-3 py-1.5 flex items-center gap-1.5 text-white text-sm font-medium"
                              style={{
                                backgroundColor:
                                  patternDetails[entry.pattern]?.color ||
                                  "#6B7280",
                              }}
                            >
                              {patternDetails[entry.pattern]?.icon || (
                                <Trophy size={16} />
                              )}
                              <span>{entry.pattern}</span>
                            </div>
                            <div className="p-3 flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                                {entry.playerName.charAt(0).toUpperCase()}
                              </div>
                              <div className="font-medium">
                                {entry.playerName}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Trophy size={48} className="text-gray-300 mb-2" />
                        <p className="text-gray-500">
                          No winners yet! Be the first to claim a prize.
                        </p>
                      </div>
                    )}

                    {uniqueWinners.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                          Top Winners
                        </h4>
                        <div className="space-y-2">
                          {uniqueWinners.slice(0, 3).map((name, idx) => (
                            <div
                              key={`top-${name}-${idx}`}
                              className="flex items-center bg-gray-50 rounded-lg p-3"
                            >
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-sm"
                                style={{
                                  backgroundColor:
                                    idx === 0
                                      ? "#FFD700"
                                      : idx === 1
                                      ? "#C0C0C0"
                                      : "#CD7F32",
                                }}
                              >
                                {idx + 1}
                              </div>
                              <span className="flex-1 font-medium">{name}</span>
                              <span className="px-2 py-1 bg-gray-200 rounded-full text-xs font-semibold">
                                {
                                  leaderboard.filter(
                                    (entry) => entry.playerName === name
                                  ).length
                                }{" "}
                                wins
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "players" && (
                  <motion.div
                    key="players-tab"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {players.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {players.map((player, index) => {
                          const isWinner = leaderboard.some(
                            (entry) => entry.playerName === player.name
                          );
                          const winCount = leaderboard.filter(
                            (entry) => entry.playerName === player.name
                          ).length;

                          return (
                            <motion.div
                              key={`player-${player.name}-${index}`}
                              className={`py-3 flex items-center ${
                                isWinner ? "bg-purple-50" : ""
                              }`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.05,
                              }}
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex-shrink-0 flex items-center justify-center text-white font-bold mr-3">
                                {player.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{player.name}</div>
                                {isWinner && (
                                  <div className="text-xs text-purple-600 font-medium flex items-center mt-0.5">
                                    <Trophy size={12} className="mr-1" />
                                    {winCount} win{winCount !== 1 ? "s" : ""}
                                  </div>
                                )}
                              </div>
                              {isWinner && (
                                <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                  Winner
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Users size={48} className="text-gray-300 mb-2" />
                        <p className="text-gray-500">
                          No players have joined yet.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Semi-transparent overlay when leaderboard is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleLeaderboard}
          />
        )}
      </AnimatePresence>

      {/* Minimized leaderboard pill - show recent winners when closed */}
      <AnimatePresence>
        {!isOpen && leaderboard.length > 0 && (
          <motion.div
            className="fixed bottom-16 right-4 bg-white shadow-lg rounded-full px-3 py-1.5 z-20 flex items-center max-w-[200px]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="flex items-center overflow-hidden">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
                style={{
                  backgroundColor:
                    patternDetails[leaderboard[leaderboard.length - 1].pattern]
                      ?.color || "#6B7280",
                }}
              >
                {patternDetails[leaderboard[leaderboard.length - 1].pattern]
                  ?.icon || <Trophy size={12} />}
              </div>
              <div className="truncate text-xs">
                <span className="font-medium">
                  {leaderboard[leaderboard.length - 1].playerName}
                </span>{" "}
                won{" "}
                <span className="font-medium">
                  {leaderboard[leaderboard.length - 1].pattern}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
