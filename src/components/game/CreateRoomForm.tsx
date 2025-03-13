import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useGameContext } from "@/context/GameContext";
import { toast } from "sonner";
import {
  ArrowRight,
  Clock,
  Users,
  Trophy,
  HelpCircle,
  ChevronLeft,
  Copy,
} from "lucide-react";

interface CreateRoomFormProps {
  roomCode: string;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ roomCode }) => {
  const navigate = useNavigate();
  const { createRoom, updateNumberCallSpeed } = useGameContext();
  const [isCreating, setIsCreating] = useState(false);
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const [createdRoomCode, setCreatedRoomCode] = useState<string>("");
  const [roomCreated, setRoomCreated] = useState(false);

  const [formData, setFormData] = useState({
    numberCallSpeed: 7,
  });

  // Predefined speed options
  const speedOptions = [
    { value: 3, label: "3s" },
    { value: 5, label: "5s" },
    { value: 7, label: "7s" },
    { value: 10, label: "10s" },
    { value: 15, label: "15s" },
  ];

  // Create room when component mounts
  useEffect(() => {
    if (roomCode && !roomCreated) {
      handleCreateRoom();
    }
  }, [roomCode]);

  const handleSpeedChange = (speed: number) => {
    setFormData((prev) => ({
      ...prev,
      numberCallSpeed: speed,
    }));
    updateNumberCallSpeed(speed);
  };

  const handleCreateRoom = async () => {
    if (roomCreated) return;

    setIsCreating(true);
    try {
      const createdCode = await createRoom({
        roomCode: roomCode,
      });

      setCreatedRoomCode(createdCode);
      setJoinLink(`${window.location.origin}/join/${createdCode}`);
      setRoomCreated(true);
    } catch (error) {
      toast.error("Failed to create room. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (
    text: string,
    message: string = "Copied to clipboard!"
  ) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const handleStartGame = () => {
    if (roomCreated) {
      navigate("/game");
    } else {
      toast.error("Room not created yet. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 to-pink-500">
      {/* Animated circles in background - reduced for mobile */}
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 md:w-24 md:h-24 rounded-full bg-white opacity-20"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-yellow-300 opacity-20"
        animate={{
          y: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 md:p-6 text-center">
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-white drop-shadow-md"
          >
            Create Tambola Room
          </motion.h2>
          <p className="text-white/90 mt-1 md:mt-2 text-sm md:text-base">
            Set up your exciting game and invite friends!
          </p>
        </div>

        {/* Room Code Display at the top */}
        {roomCreated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 md:p-5 text-center border-b border-purple-200"
          >
            <p className="text-green-800 font-medium mb-2 text-sm md:text-base">
              Room Created Successfully!
            </p>

            {/* Enhanced Room Code Display - Made clickable to copy */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() =>
                copyToClipboard(createdRoomCode, "Room code copied!")
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl p-3 md:p-4 shadow-lg border-2 border-purple-300 mx-auto max-w-xs cursor-pointer relative group"
            >
              <p className="text-gray-500 text-xs uppercase font-semibold tracking-wider mb-1">
                Room Code (Click to Copy)
              </p>
              <div className="flex items-center justify-center">
                <motion.h3
                  className="text-4xl md:text-5xl font-bold text-purple-700 tracking-wider"
                  initial={{ y: 5 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  {createdRoomCode}
                </motion.h3>
                <Copy className="absolute right-4 text-purple-400 w-4 h-4 md:w-5 md:h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>

            {/* Copy Link Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => copyToClipboard(joinLink || "")}
              className="mt-3 py-2 px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-xs md:text-sm font-medium flex items-center mx-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Join Link
            </motion.button>
          </motion.div>
        )}

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Animated number ball */}
          <div className="flex justify-center -mt-8 md:-mt-12">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center text-white font-bold text-xl md:text-2xl"
            >
              {formData.numberCallSpeed}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-purple-50 rounded-lg p-3 md:p-5 shadow-inner"
          >
            <div className="flex items-center mb-2 md:mb-3">
              <Clock className="text-purple-600 mr-1 md:mr-2" size={16} />
              <label
                htmlFor="numberCallSpeed"
                className="text-xs md:text-sm font-medium text-gray-700"
              >
                Number Interval
              </label>
            </div>

            <div className="flex flex-wrap gap-1 md:gap-2 justify-between">
              {speedOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={`py-1 md:py-2 px-2 md:px-4 rounded-full flex-1 transition-colors text-xs md:text-sm ${
                    formData.numberCallSpeed === option.value
                      ? "bg-yellow-500 text-white font-medium shadow-md"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => handleSpeedChange(option.value)}
                  disabled={isCreating}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center text-xs md:text-sm text-purple-600 bg-purple-50 rounded-lg p-3 md:p-4"
          >
            <div className="flex items-center justify-center space-x-4 md:space-x-6">
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                <span>1000+ Players</span>
              </div>
              <div className="flex items-center">
                <Trophy size={14} className="mr-1" />
                <span>500+ Winners</span>
              </div>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartGame}
            className="w-full py-3 md:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-lg md:text-xl font-bold text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-colors uppercase shadow-md flex items-center justify-center"
            disabled={isCreating || !roomCreated}
          >
            {isCreating ? (
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2 w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span className="text-sm md:text-base">Creating Room...</span>
              </div>
            ) : (
              <div className="flex items-center">
                START GAME
                <ArrowRight className="ml-2" size={18} />
              </div>
            )}
          </motion.button>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center text-purple-600 text-xs md:text-sm font-medium"
              disabled={isCreating}
            >
              <ChevronLeft size={14} className="md:size-16" />
              Back to Home
            </motion.button>
          </div>

          {/* Help Link */}
          <motion.div
            className="mt-2 md:mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/how-to-play"
              className="text-purple-600 hover:text-purple-800 text-xs md:text-sm flex items-center justify-center"
            >
              <HelpCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              New to Tambola? Learn how to play
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateRoomForm;
