
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useGameContext } from "@/context/GameContext";
import Ticket from "@/components/game/Ticket";
import NumberBoard from "@/components/game/NumberBoard";
import { Users, ArrowLeft, Play, Pause } from "lucide-react";

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { 
    gameState, 
    setGameState, 
    roomSettings, 
    players, 
    tickets, 
    callNumber, 
    lastCalledNumber,
    leaveRoom 
  } = useGameContext();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Clean up timer on unmount
    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [callTimer]);
  
  const handleStartGame = () => {
    setGameState("playing");
    setIsPlaying(true);
    
    // Set up the timer for calling numbers
    const speed = roomSettings?.numberCallSpeed || 10;
    const timer = setInterval(() => {
      callNumber();
    }, speed * 1000);
    
    setCallTimer(timer);
    
    // Call the first number immediately
    callNumber();
  };
  
  const handleTogglePause = () => {
    if (isPlaying) {
      // Pause the game
      if (callTimer) clearInterval(callTimer);
      setCallTimer(null);
    } else {
      // Resume the game
      const speed = roomSettings?.numberCallSpeed || 10;
      const timer = setInterval(() => {
        callNumber();
      }, speed * 1000);
      
      setCallTimer(timer);
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleLeaveGame = () => {
    if (callTimer) clearInterval(callTimer);
    leaveRoom();
    navigate("/");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={handleLeaveGame}
              className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">
              {roomSettings?.roomCode && (
                <span className="text-gray-500 mr-2">Room: </span>
              )}
              {roomSettings?.roomCode || "Tambola Game"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <Users size={16} className="mr-1" />
              <span>{players.length} players</span>
            </div>
            
            {gameState === "waiting" ? (
              <ButtonCustom
                variant="primary"
                onClick={handleStartGame}
              >
                <Play size={16} className="mr-1" />
                Start Game
              </ButtonCustom>
            ) : (
              <ButtonCustom
                variant={isPlaying ? "secondary" : "primary"}
                onClick={handleTogglePause}
              >
                {isPlaying ? (
                  <>
                    <Pause size={16} className="mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-1" />
                    Resume
                  </>
                )}
              </ButtonCustom>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <NumberBoard />
            </motion.div>
          </div>
          
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {tickets.map(ticket => (
                <Ticket key={ticket.id} ticketId={ticket.id} />
              ))}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
