import React from "react";
import { motion } from "framer-motion";
import JoinRoomForm from "@/components/game/JoinRoomForm";
import { useParams } from "react-router-dom";

const JoinRoom: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
    

        <JoinRoomForm />
      </motion.div>
    </div>
  );
};

export default JoinRoom;
