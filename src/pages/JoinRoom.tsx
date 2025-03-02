
import React from "react";
import { motion } from "framer-motion";
import JoinRoomForm from "@/components/game/JoinRoomForm";

const JoinRoom: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join a Tambola Room</h1>
          <p className="mt-2 text-lg text-gray-600">
            Enter the room code to join an existing game
          </p>
        </div>
        
        <JoinRoomForm />
      </motion.div>
    </div>
  );
};

export default JoinRoom;
