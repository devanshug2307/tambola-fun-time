import React, { useState } from "react";
import { Trophy, Medal, Users, Crown, Star, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Leaderboard.css";

interface LeaderboardProps {
  leaderboard: { playerName: string; pattern: string }[];
  players: { name: string }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, players }) => {
  const [activeTab, setActiveTab] = useState<"winners" | "players">("winners");
  const [showConfetti, setShowConfetti] = useState(false);

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
    <div className="leaderboard-container relative">
      {/* Confetti container */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {generateConfetti()}
          </div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <motion.div
        className="leaderboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="text-yellow-500" size={24} />
          <h2 className="leaderboard-title">Leaderboard</h2>
        </div>

        {/* Tab navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "winners" ? "active" : ""}`}
            onClick={() => setActiveTab("winners")}
          >
            <Trophy size={16} />
            <span>Winners</span>
            <span className="tab-count">{leaderboard.length}</span>
          </button>
          <button
            className={`tab-button ${activeTab === "players" ? "active" : ""}`}
            onClick={() => setActiveTab("players")}
          >
            <Users size={16} />
            <span>Players</span>
            <span className="tab-count">{players.length}</span>
          </button>
        </div>
      </motion.div>

      {/* Content area */}
      <div className="leaderboard-content">
        <AnimatePresence mode="wait">
          {activeTab === "winners" && (
            <motion.div
              key="winners-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              {leaderboard.length > 0 ? (
                <div className="winners-grid">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={`${entry.playerName}-${entry.pattern}-${index}`}
                      className="winner-card"
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={handleWinnerClick}
                    >
                      <div
                        className="pattern-badge"
                        style={{
                          backgroundColor:
                            patternDetails[entry.pattern]?.color || "#6B7280",
                        }}
                      >
                        {patternDetails[entry.pattern]?.icon || (
                          <Trophy size={18} />
                        )}
                        <span>{entry.pattern}</span>
                      </div>
                      <div className="winner-info">
                        <div className="winner-avatar">
                          {entry.playerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="winner-name">{entry.playerName}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Trophy size={32} className="text-gray-300" />
                  <p>No winners yet! Be the first to claim a prize.</p>
                </div>
              )}

              {uniqueWinners.length > 0 && (
                <div className="winner-summary">
                  <h4>Top Winners</h4>
                  <div className="top-winners">
                    {uniqueWinners.slice(0, 3).map((name, idx) => (
                      <div key={`top-${name}-${idx}`} className="top-winner">
                        <div
                          className="winner-rank"
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
                        <span>{name}</span>
                        <span className="win-count">
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
                <div className="players-list">
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
                        className={`player-item ${isWinner ? "is-winner" : ""}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <div className="player-avatar">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="player-details">
                          <span className="player-name">{player.name}</span>
                          {isWinner && (
                            <span className="win-badge">
                              {winCount} win{winCount !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <Users size={32} className="text-gray-300" />
                  <p>No players have joined yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Leaderboard;
