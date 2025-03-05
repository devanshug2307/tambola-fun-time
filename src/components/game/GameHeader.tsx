
import React from "react";
import { Users, ArrowLeft, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonCustom } from "@/components/ui/button-custom";
import { GameState } from "@/context/GameContext";

interface GameHeaderProps {
  roomCode?: string;
  playerCount: number;
  gameState: GameState;
  isPlaying: boolean;
  onStartGame: () => void;
  onTogglePause: () => void;
  onLeaveGame: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  roomCode,
  playerCount,
  gameState,
  isPlaying,
  onStartGame,
  onTogglePause,
  onLeaveGame,
}) => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onLeaveGame}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Leave game"
          >
            <ArrowLeft size={20} />
          </button>

          {roomCode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center"
            >
              <span className="text-gray-500 mr-2 text-sm">Room:</span>
              <span className="bg-indigo-100 text-indigo-800 font-mono px-3 py-1 rounded-full text-sm font-medium">
                {roomCode}
              </span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full">
            <Users size={16} className="mr-2 text-indigo-600" />
            <span>{playerCount} players</span>
          </div>

          {gameState === "waiting" ? (
            <ButtonCustom variant="primary" onClick={onStartGame} className="animate-pulse">
              <Play size={16} className="mr-2" />
              Start Game
            </ButtonCustom>
          ) : gameState === "playing" ? (
            <ButtonCustom
              variant={isPlaying ? "secondary" : "primary"}
              onClick={onTogglePause}
            >
              {isPlaying ? (
                <>
                  <Pause size={16} className="mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play size={16} className="mr-2" />
                  Resume
                </>
              )}
            </ButtonCustom>
          ) : gameState === "paused" ? (
            <ButtonCustom variant="primary" onClick={onTogglePause}>
              <Play size={16} className="mr-2" />
              Resume
            </ButtonCustom>
          ) : (
            <ButtonCustom variant="outline" onClick={onLeaveGame}>
              Exit Game
            </ButtonCustom>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default GameHeader;
