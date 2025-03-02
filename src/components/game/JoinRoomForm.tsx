
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useGameContext } from "@/context/GameContext";
import { toast } from "sonner";

const JoinRoomForm: React.FC = () => {
  const navigate = useNavigate();
  const { joinRoom } = useGameContext();
  
  const [roomCode, setRoomCode] = useState("");
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
      joinRoom(roomCode, playerName);
      
      // Add a short delay to allow the context state to update
      setTimeout(() => {
        toast.success(`Joining room ${roomCode}`);
        navigate("/game");
        setIsJoining(false);
      }, 500);
    } catch (error) {
      console.error("Error joining room:", error);
      setError("Failed to join room. Please check the room code and try again.");
      toast.error("Failed to join room. Please check the room code and try again.");
      setIsJoining(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Join Game Room</h2>
        <p className="text-gray-600 mt-1">Enter the room code to join an existing game</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tambola-blue focus:border-tambola-blue uppercase"
              maxLength={6}
              disabled={isJoining}
            />
          </div>
          
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tambola-blue focus:border-tambola-blue"
              disabled={isJoining}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <ButtonCustom
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isJoining}
          >
            Cancel
          </ButtonCustom>
          <ButtonCustom
            type="submit"
            variant="primary"
            disabled={isJoining}
          >
            {isJoining ? "Joining Room..." : "Join Room"}
          </ButtonCustom>
        </div>
      </form>
    </motion.div>
  );
};

export default JoinRoomForm;
