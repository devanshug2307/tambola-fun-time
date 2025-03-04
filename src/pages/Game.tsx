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
import { GameState } from '@/context/GameContext';

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

  // Redirect if no room settings (means we're not in a valid game)
  useEffect(() => {
    // Small delay to let context hydrate
    const checkGameState = setTimeout(() => {
      if (!roomSettings && (gameState === "idle" || gameState === "ended")) {
        toast.error("No active game session. Please create or join a game.");
        navigate("/");
      }
    }, 500);

    return () => clearTimeout(checkGameState);
  }, [roomSettings, gameState, navigate]);

  // Set up timer cleanup
  useEffect(() => {
    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [callTimer]);

  // Monitor game progress
  useEffect(() => {
    if (gameState === "playing" && calledNumbers.length >= 90) {
      // All numbers have been called
      if (callTimer) clearInterval(callTimer);
      setIsPlaying(false);
      setGameState("ended");
      toast.info("Game over! All numbers have been called.");
    }
  }, [calledNumbers, gameState, setGameState]);

  // Auto-start the number calling when game state becomes "playing"
  useEffect(() => {
    if (gameState === "playing" && !isPlaying) {
      handleStartGame();
    }
  }, [gameState, isPlaying]);

  // Timer countdown effect
  useEffect(() => {
    if (isPlaying && nextCallTime) {
      const timerInterval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, nextCallTime - now);
        const seconds = Math.ceil(remaining / 1000);

        setTimeRemaining(seconds);

        if (seconds <= 0) {
          clearInterval(timerInterval);
        }
      }, 100); // Update more frequently for smoother countdown

      return () => clearInterval(timerInterval);
    }
  }, [isPlaying, nextCallTime]);

  const handleStartGame = async () => {
    if (!roomSettings) return;

    try {
      switch (gameState) {
        case "playing":
          // This part should only run after gameState is "playing"
          setIsPlaying(true);
          await callNumber();
          break;
        case "waiting":
          await supabase
            .from("rooms")
            .update({ status: "playing" })
            .eq("code", roomSettings.roomCode);
          setGameState("playing");
          // Return early to let the effect trigger again with the updated state
          return;
        default:
          return;
      }

      // Set up the timer for calling numbers
      const speed = roomSettings.numberCallSpeed || 10;
      const nextTime = Date.now() + speed * 1000;
      setNextCallTime(nextTime);
      setTimeRemaining(speed);

      // Clear any existing timer to avoid multiple timers
      if (callTimer) {
        clearInterval(callTimer);
      }

      const timer = setInterval(async () => {
        await callNumber();
        setNextCallTime(Date.now() + speed * 1000);
      }, speed * 1000);

      setCallTimer(timer);

      // Toast messages
      if (gameState === "waiting") {
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
      // Pause the game
      if (callTimer) clearInterval(callTimer);
      setCallTimer(null);
      setNextCallTime(null);
      setTimeRemaining(null);
      setIsPlaying(false);
      toast.info("Game paused");
    } else {
      // Resume the game
      handleStartGame();
    }
  };

  const handleLeaveGame = () => {
    if (callTimer) clearInterval(callTimer);
    leaveRoom();
    navigate("/");
  };

  // Add debug information to help diagnose issues
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

  // Show loading state while context initializes
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
            ) : (
              <ButtonCustom variant="outline" onClick={handleLeaveGame}>
                Exit Game
              </ButtonCustom>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game status indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center">
              <span className="font-medium mr-2">Status:</span>
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

            {lastCalledNumber && (
              <div className="flex items-center">
                <span className="text-sm mr-2">Last number called:</span>
                <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold text-lg">
                  {lastCalledNumber}
                </span>
              </div>
            )}
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
              {/* Player information */}
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

              {/* Player tickets */}
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
