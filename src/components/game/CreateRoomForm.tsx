import React, { useState } from "react";
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
} from "lucide-react";

const CreateRoomForm: React.FC = () => {
  const navigate = useNavigate();
  const { createRoom } = useGameContext();
  const [isCreating, setIsCreating] = useState(false);
  const [joinLink, setJoinLink] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    numberCallSpeed: 10,
  });

  // Predefined speed options
  const speedOptions = [
    { value: 7, label: "7 secs" },
    { value: 10, label: "10 secs" },
    { value: 15, label: "15 secs" },
  ];

  const handleSpeedChange = (speed: number) => {
    setFormData((prev) => ({
      ...prev,
      numberCallSpeed: speed,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const roomCode = await createRoom({
        numberCallSpeed: formData.numberCallSpeed,
      });
      setJoinLink(`${window.location.origin}/join/${roomCode}`);
      toast.success(`Room created! Room code: ${roomCode}`);
      navigate("/game");
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 to-pink-500">
      {/* Animated circles in background */}
      <motion.div
        className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white opacity-20"
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
        className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-yellow-300 opacity-20"
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-center">
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white drop-shadow-md"
          >
            Create Tambola Room
          </motion.h2>
          <p className="text-white/90 mt-2">
            Set up your exciting game and invite friends!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Animated number ball */}
          <div className="flex justify-center -mt-12">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center text-white font-bold text-2xl"
            >
              {formData.numberCallSpeed}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-purple-50 rounded-lg p-5 shadow-inner"
          >
            <div className="flex items-center mb-3">
              <Clock className="text-purple-600 mr-2" size={18} />
              <label
                htmlFor="numberCallSpeed"
                className="text-sm font-medium text-gray-700"
              >
                Number Interval
              </label>
            </div>

            <div className="flex gap-2 justify-between">
              {speedOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={`py-2 px-4 rounded-full flex-1 transition-colors ${
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
            className="text-center text-sm text-purple-600 bg-purple-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                <span>1000+ Players</span>
              </div>
              <div className="flex items-center">
                <Trophy size={16} className="mr-1" />
                <span>500+ Winners</span>
              </div>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-xl font-bold text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-colors uppercase shadow-md flex items-center justify-center"
            disabled={isCreating}
          >
            {isCreating ? (
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Creating Room...
              </div>
            ) : (
              <div className="flex items-center">
                START GAME!
                <ArrowRight className="ml-2" size={20} />
              </div>
            )}
          </motion.button>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center text-purple-600 text-sm font-medium"
              disabled={isCreating}
            >
              <ChevronLeft size={16} />
              Back to Home
            </motion.button>
          </div>

          {/* Help Link */}
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/how-to-play"
              className="text-purple-600 hover:text-purple-800 text-sm flex items-center justify-center"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              New to Tambola? Learn how to play
            </Link>
          </motion.div>
        </form>

        {joinLink && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-green-50 p-4 text-center border-t border-green-100"
          >
            <p className="text-green-800 font-medium">
              Room Created Successfully!
            </p>
            <p className="text-gray-700 text-sm mt-1">
              Room Code:{" "}
              <span className="font-bold text-purple-700">
                {joinLink.split("/").pop()}
              </span>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateRoomForm;
