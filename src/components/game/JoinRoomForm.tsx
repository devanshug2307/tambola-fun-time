
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useGameContext } from "@/context/GameContext";
import { toast } from "sonner";
import { Users, ArrowRight, X } from "lucide-react";

const JoinRoomForm: React.FC = () => {
  const navigate = useNavigate();
  const { joinRoom } = useGameContext();
  const { roomCode: roomCodeFromParams } = useParams<{ roomCode: string }>();

  const [roomCode, setRoomCode] = useState(roomCodeFromParams || "");
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!roomCode) {
      setError("Please enter a room code");
      toast.error("Please enter a room code");
      return;
    }

    if (!playerName) {
      setError("Please enter your name");
      toast.error("Please enter your name");
      return;
    }

    setIsJoining(true);

    try {
      // Join the room
      await joinRoom(roomCode, playerName);

      toast.success(`Joining room ${roomCode}`);
      navigate("/game");
    } catch (error) {
      console.error("Error joining room:", error);
      setError(
        "Failed to join room. Please check the room code and try again."
      );
      toast.error(
        "Failed to join room. Please check the room code and try again."
      );
      setIsJoining(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 border-4 border-purple-600"
      >
        <div className="relative">
          <div className="absolute top-0 right-0 p-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/")} 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-600 transition-colors"
            >
              <X size={18} />
            </motion.button>
          </div>
          
          <div className="bg-purple-600 p-6 text-center">
            <div className="flex justify-center mb-3">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3 
                }}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Users className="w-8 h-8 text-purple-600" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold text-white">Join Game Room</h2>
            <p className="text-white/80 mt-1">Enter the room code to join the fun!</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="roomCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Room Code
              </label>
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="Enter 6-digit code"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-600 focus:border-purple-600 uppercase text-center text-xl tracking-wider font-medium"
                maxLength={6}
                disabled={isJoining}
              />
            </div>

            <div>
              <label
                htmlFor="playerName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setError("");
                }}
                placeholder="Enter your name"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-600 focus:border-purple-600"
                disabled={isJoining}
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isJoining}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-70"
            >
              <span>{isJoining ? "Joining Room..." : "Join Room"}</span>
              {!isJoining && <ArrowRight size={18} />}
            </motion.button>
          </div>
          
          <div className="flex items-center justify-center space-x-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/create-room")}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              Create a new room instead
            </button>
          </div>
        </form>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            Need help? Check our <span className="text-purple-600 font-medium">Game Guide</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinRoomForm;
