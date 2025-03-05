
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useGameContext } from "@/context/GameContext";
import Ticket from "@/components/game/Ticket";
import NumberBoard from "@/components/game/NumberBoard";
import GameHeader from "@/components/game/GameHeader";
import GameStatusBar from "@/components/game/GameStatusBar";
import CurrentNumberDisplay from "@/components/game/CurrentNumberDisplay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import tickingSound from "@/assets/sounds/ticking-clock_1-27477.mp3";

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
    calledNumbers,
    leaveRoom,
  } = useGameContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const [nextCallTime, setNextCallTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  let isSoundPlaying = false;

  const playTickingSound = () => {
    if (isSoundPlaying) return;
    isSoundPlaying = true;
    const audio = new Audio(tickingSound);
    audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      isSoundPlaying = false;
    }, 1000);
  };

  useEffect(() => {
    const checkGameState = setTimeout(() => {
      if (!roomSettings && (gameState === "waiting" || gameState === "ended")) {
        toast.error("No active game session. Please create or join a game.");
        navigate("/");
      }
    }, 500);

    return () => clearTimeout(checkGameState);
  }, [roomSettings, gameState, navigate]);

  useEffect(() => {
    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [callTimer]);

  useEffect(() => {
    if (gameState === "playing" && calledNumbers.length >= 90) {
      if (callTimer) clearInterval(callTimer);
      setIsPlaying(false);
      setGameState("ended");
      toast.info("Game over! All numbers have been called.");
    }
  }, [calledNumbers, gameState, setGameState]);

  useEffect(() => {
    if (gameState === "playing" && !isPlaying) {
      handleStartGame();
    }
  }, [gameState, isPlaying]);

  useEffect(() => {
    if (isPlaying && nextCallTime) {
      const timerInterval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, nextCallTime - now);
        const seconds = Math.ceil(remaining / 1000);

        setTimeRemaining(seconds);

        if (seconds > 1 && seconds < 10) {
          playTickingSound();
        }

        if (seconds <= 0) {
          clearInterval(timerInterval);
        }
      }, 100);

      return () => clearInterval(timerInterval);
    }
  }, [isPlaying, nextCallTime]);

  const handleStartGame = async () => {
    if (!roomSettings) return;

    try {
      if (gameState === "playing") {
        setIsPlaying(true);
        await callNumber();
      } else if (gameState === "waiting" || gameState === "paused") {
        await supabase
          .from("rooms")
          .update({ status: "playing" })
          .eq("code", roomSettings.roomCode);
        setGameState("playing");
        return;
      }

      const speed = roomSettings.numberCallSpeed || 10;
      const nextTime = Date.now() + speed * 1000;
      setNextCallTime(nextTime);
      setTimeRemaining(speed);

      if (callTimer) {
        clearInterval(callTimer);
      }

      const timer = setInterval(async () => {
        await callNumber();
        setNextCallTime(Date.now() + speed * 1000);
        playTickingSound();
      }, speed * 1000);

      setCallTimer(timer);

      if (gameState === "waiting" || gameState === "paused") {
        toast.success("Game started! Numbers will be called automatically.");
      } else {
        toast.success(
          "Game resumed! Numbers will continue to be called automatically."
        );
      }
    } catch (error) {
      console.error("Error starting game:", error);
      toast.error("Failed to start game. Please try again.");
    }
  };

  const handleTogglePause = () => {
    if (isPlaying) {
      if (callTimer) clearInterval(callTimer);
      setCallTimer(null);
      setNextCallTime(null);
      setTimeRemaining(null);
      setIsPlaying(false);
      setGameState("paused");
      toast.info("Game paused");
    } else {
      handleStartGame();
      setGameState("playing");
    }
  };

  const handleLeaveGame = () => {
    if (callTimer) clearInterval(callTimer);
    leaveRoom();
    navigate("/");
  };

  if (gameState === "creating" || gameState === "joining") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-pink-50 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-white p-8 rounded-2xl shadow-xl"
        >
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {gameState === "creating"
              ? "Creating your game room..."
              : "Joining the game room..."}
          </h2>
          <p className="text-gray-500">
            Please wait while we set up the game for you
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <GameHeader 
        roomCode={roomSettings?.roomCode}
        playerCount={players.length}
        gameState={gameState}
        isPlaying={isPlaying}
        onStartGame={handleStartGame}
        onTogglePause={handleTogglePause}
        onLeaveGame={handleLeaveGame}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
        <GameStatusBar 
          gameState={gameState}
          isPlaying={isPlaying}
          timeRemaining={timeRemaining}
          lastCalledNumber={calledNumbers.length > 1 ? calledNumbers[calledNumbers.length - 2] : null}
          winningPatterns={roomSettings?.winningPatterns || []}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <AnimatePresence>
            <motion.div 
              key="number-board"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <CurrentNumberDisplay 
                    currentNumber={lastCalledNumber} 
                    isPlaying={isPlaying && gameState === "playing"}
                  />
                </div>
                <div className="p-4">
                  <NumberBoard />
                </div>
              </div>
            </motion.div>

            <motion.div 
              key="ticket-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Ticket ticketId={ticket.id} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Game;
