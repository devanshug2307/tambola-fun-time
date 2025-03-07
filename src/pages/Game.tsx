import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "@/context/GameContext";
import Ticket from "@/components/game/Ticket";
import NumberBoard from "@/components/game/NumberBoard";
import {
  Users,
  ArrowLeft,
  Play,
  Pause,
  Clock,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import tickingSound from "@/assets/sounds/ticking-clock_1-27477.mp3";
import Leaderboard from "@/components/game/Leaderboard";

const Game = () => {
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
    currentPlayer,
    leaderboard,
  } = useGameContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const [callTimer, setCallTimer] = useState(null);
  const [nextCallTime, setNextCallTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("board");
  let isSoundPlaying = false;

  const playTickingSound = () => {
    if (!soundEnabled || isSoundPlaying) return;
    isSoundPlaying = true;
    const audio = new Audio(tickingSound);
    audio.volume = 0.3; // Lower volume
    audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      isSoundPlaying = false;
    }, 1000);
  };

  // Redirect if no room settings
  useEffect(() => {
    const checkGameState = setTimeout(() => {
      if (!roomSettings && (gameState === "idle" || gameState === "ended")) {
        toast.error("No active game session. Please create or join a game.");
        navigate("/");
      }
    }, 500);

    return () => clearTimeout(checkGameState);
  }, [roomSettings, gameState, navigate]);

  // Timer cleanup
  useEffect(() => {
    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [callTimer]);

  // Monitor game progress
  useEffect(() => {
    if (gameState === "playing" && calledNumbers.length >= 90) {
      if (callTimer) clearInterval(callTimer);
      setIsPlaying(false);
      setGameState("ended");
      toast.info("Game over! All numbers have been called.");
    }
  }, [calledNumbers, gameState, setGameState]);

  // Auto-start number calling
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
      switch (gameState) {
        case "playing":
          setIsPlaying(true);
          await callNumber();
          break;
        case "waiting":
          await supabase
            .from("rooms")
            .update({ status: "playing" })
            .eq("code", roomSettings.roomCode);
          setGameState("playing");
          return;
        default:
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

      if (gameState === "waiting") {
        toast.success("Game started! Numbers will be called automatically.");
      } else {
        toast.success(
          "Game resumed! Numbers will continue to be called automatically."
        );
      }
    } catch (error) {
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

  // Warning before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const isHost = players.some(
    (player) => player.isHost && player.name === currentPlayer.name
  );

  // Get count of player's marked numbers across all tickets
  const getTotalMarkedCount = () => {
    return tickets.reduce(
      (sum, ticket) => sum + ticket.markedNumbers.length,
      0
    );
  };

  const getStatusColor = () => {
    switch (gameState) {
      case "waiting":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "playing":
        return isPlaying
          ? "bg-green-100 text-green-800 border-green-200"
          : "bg-blue-100 text-blue-800 border-blue-200";
      case "ended":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusText = () => {
    if (gameState === "waiting") return "Waiting to Start";
    if (gameState === "playing") return isPlaying ? "In Progress" : "Paused";
    if (gameState === "ended") return "Game Ended";
    return "Setting Up";
  };

  // Loading states
  if (gameState === "creating" || gameState === "joining") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">
            {gameState === "creating"
              ? "Creating your game room..."
              : "Joining the game room..."}
          </h2>
          <p className="text-gray-500 mt-2">Just a moment please!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center">
            <button
              onClick={handleLeaveGame}
              className="mr-4 text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="Leave game"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-indigo-900 flex items-center">
                {roomSettings?.roomCode && (
                  <span className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-md mr-2">
                    Room: {roomSettings?.roomCode}
                  </span>
                )}
                Tambola Game
              </h1>

              {isHost && (
                <div className="text-green-600 text-sm font-medium flex items-center">
                  <Trophy size={14} className="mr-1" />
                  You are the host
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
              <Users size={16} className="mr-1" />
              <span>{players.length} players</span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {gameState === "waiting" ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                onClick={handleStartGame}
              >
                <Play size={16} className="mr-1" />
                Start Game
              </motion.button>
            ) : gameState === "playing" || gameState === "paused" ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={
                  isPlaying
                    ? "bg-amber-500 text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                }
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
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-500 text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                onClick={handleLeaveGame}
              >
                Exit Game
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Game status indicator */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center mb-3 sm:mb-0">
              <span className="font-medium mr-2 text-gray-700">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}
              >
                {getStatusText()}
              </span>
            </div>

            {gameState === "playing" && isPlaying && timeRemaining !== null && (
              <div className="flex items-center bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-700">
                <Clock size={16} className="mr-1" />
                <span>
                  Next number in:{" "}
                  <span className="font-bold">{timeRemaining}s</span>
                </span>
              </div>
            )}

            <div className="flex items-center">
              <span className="text-sm mr-2">Last number:</span>
              <motion.div
                className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold text-lg shadow-md"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                {lastCalledNumber || "?"}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile tab selector for smaller screens */}
        <div className="sm:hidden mb-4">
          <div className="bg-white rounded-xl overflow-hidden flex shadow-sm">
            <button
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "board"
                  ? "bg-indigo-100 text-indigo-900"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setActiveTab("board")}
            >
              Number Board
            </button>
            <button
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "ticket"
                  ? "bg-indigo-100 text-indigo-900"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setActiveTab("ticket")}
            >
              Your Tickets
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Number board - hidden on mobile if ticket tab is active */}
          <div
            className={`lg:col-span-7 ${
              activeTab !== "board" && "hidden sm:block"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <NumberBoard />
            </motion.div>

            {/* Winning Patterns Section - moved below the number board */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4 mt-6">
              <h2 className="text-lg font-medium mb-3 flex items-center text-indigo-900">
                <Trophy size={18} className="mr-2 text-amber-500" />
                Winning Patterns
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {[
                  "Early Five",
                  "Top Line",
                  "Middle Line",
                  "Bottom Line",
                  "Full House",
                ].map((pattern, index) => (
                  <motion.div
                    key={pattern}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`bg-gradient-to-r ${
                      index === 0
                        ? "from-yellow-400 to-yellow-500"
                        : index === 1
                        ? "from-blue-400 to-blue-500"
                        : index === 2
                        ? "from-green-400 to-green-500"
                        : index === 3
                        ? "from-purple-400 to-purple-500"
                        : "from-pink-400 to-pink-500"
                    } text-white font-medium py-2 px-2 rounded-lg shadow text-center text-sm`}
                  >
                    <Trophy size={14} className="inline mr-1" /> {pattern}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket section - hidden on mobile if board tab is active */}
          <div
            className={`lg:col-span-5 ${
              activeTab !== "ticket" && "hidden sm:block"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Stats card */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">
                      {getTotalMarkedCount()}
                    </div>
                    <div className="text-xs text-gray-500">Numbers Marked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-pink-600">
                      {calledNumbers.length}
                    </div>
                    <div className="text-xs text-gray-500">Numbers Called</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-600">
                      {90 - calledNumbers.length}
                    </div>
                    <div className="text-xs text-gray-500">Remaining</div>
                  </div>
                </div>
              </div>

              {/* Player tickets */}
              {tickets.map((ticket) => (
                <Ticket key={ticket.id} ticketId={ticket.id} />
              ))}
              {/* Leaderboard Section */}
              <div className="mt-4 border-t border-gray-100">
                <Leaderboard leaderboard={leaderboard} players={players} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
