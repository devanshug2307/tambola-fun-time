
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useGameContext } from "@/context/GameContext";
import Ticket from "@/components/game/Ticket";
import NumberBoard from "@/components/game/NumberBoard";
import { Users, ArrowLeft, Play, Pause, Clock, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GameState } from "@/context/GameContext";
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
      if (!roomSettings && (gameState === "idle" || gameState === "ended")) {
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

  console.log("Game component state:", {
    gameState,
    isPlaying,
    callTimer: !!callTimer,
    roomSettings,
    players,
    tickets,
    calledNumbers,
    lastCalledNumber,
    timeRemaining,
  });

  if (gameState === "creating" || gameState === "joining") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">
            {gameState === "creating"
              ? "Creating your game room..."
              : "Joining the game room..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={handleLeaveGame}
              className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Leave game"
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
              <ButtonCustom variant="primary" onClick={handleStartGame}>
                <Play size={16} className="mr-1" />
                Start Game
              </ButtonCustom>
            ) : gameState === "playing" ? (
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
            ) : gameState === "paused" ? (
              <ButtonCustom variant="primary" onClick={handleTogglePause}>
                <Play size={16} className="mr-1" />
                Resume
              </ButtonCustom>
            ) : (
              <ButtonCustom variant="outline" onClick={handleLeaveGame}>
                Exit Game
              </ButtonCustom>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center">
              <span className="font-medium mr-2 text-sm sm:text-base">
                Status:
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  gameState === "waiting"
                    ? "bg-yellow-100 text-yellow-800"
                    : gameState === "playing"
                    ? "bg-green-100 text-green-800"
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

            {gameState === "playing" && isPlaying && timeRemaining !== null && (
              <div className="flex items-center text-sm">
                <Clock size={16} className="mr-1 text-gray-500" />
                <span>
                  Next number in:{" "}
                  <span className="font-medium">{timeRemaining}s</span>
                </span>
              </div>
            )}

            <div className="flex items-center mt-2 sm:mt-0">
              <span className="text-sm mr-2">Last number called:</span>
              <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold text-lg">
                {calledNumbers.length > 1
                  ? calledNumbers[calledNumbers.length - 2]
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

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
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h2 className="text-lg font-medium mb-2 flex items-center">
                  <Trophy size={18} className="mr-2 text-amber-500" />
                  Winning Patterns
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {roomSettings?.winningPatterns.map((pattern, index) => (
                    <div key={index} className="text-sm bg-gray-50 rounded p-2">
                      {pattern}
                    </div>
                  ))}
                </div>
              </div>

              {tickets.map((ticket) => (
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
