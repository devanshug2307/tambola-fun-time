
import React from "react";
import { motion } from "framer-motion";
import { Clock, Trophy } from "lucide-react";
import { GameState } from "@/context/GameContext";

interface GameStatusBarProps {
  gameState: GameState;
  isPlaying: boolean;
  timeRemaining: number | null;
  lastCalledNumber: number | null;
  winningPatterns: string[];
}

const GameStatusBar: React.FC<GameStatusBarProps> = ({
  gameState,
  isPlaying,
  timeRemaining,
  lastCalledNumber,
  winningPatterns,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-center">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full mr-2 animate-pulse"
            style={{ 
              backgroundColor: 
                gameState === "waiting" ? "#FCD34D" :
                gameState === "playing" && isPlaying ? "#10B981" :
                gameState === "paused" ? "#60A5FA" :
                gameState === "ended" ? "#6B7280" : "#FCD34D"
            }}
          />
          <span className="font-medium text-gray-700">Game Status</span>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center justify-center w-fit
            ${
              gameState === "waiting"
                ? "bg-yellow-100 text-yellow-800"
                : gameState === "playing"
                ? isPlaying
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
                : gameState === "ended"
                ? "bg-gray-100 text-gray-800"
                : "bg-blue-100 text-blue-800"
            }`}
        >
          {gameState === "waiting"
            ? "Waiting to Start"
            : gameState === "playing"
            ? isPlaying
              ? "In Progress"
              : "Paused"
            : gameState === "ended"
            ? "Game Ended"
            : "Setting Up"}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 mb-1">Last Called</span>
          {lastCalledNumber ? (
            <span className="text-2xl font-bold text-gray-800">{lastCalledNumber}</span>
          ) : (
            <span className="text-sm text-gray-400 italic">None yet</span>
          )}
        </div>
        
        {gameState === "playing" && isPlaying && timeRemaining !== null && (
          <div className="flex flex-col items-end">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Clock size={14} className="mr-1" />
              <span>Next number in</span>
            </div>
            <motion.span 
              key={timeRemaining}
              initial={{ scale: 1.2, color: "#4F46E5" }}
              animate={{ scale: 1, color: "#1F2937" }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold"
            >
              {timeRemaining}s
            </motion.span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-2">
          <Trophy size={16} className="mr-2 text-amber-500" />
          <span className="font-medium text-gray-700">Winning Patterns</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {winningPatterns.map((pattern, index) => (
            <span 
              key={index} 
              className="inline-block text-xs bg-amber-50 text-amber-800 rounded px-2 py-1 border border-amber-200"
            >
              {pattern}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GameStatusBar;
