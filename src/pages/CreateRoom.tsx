import React from "react";
import { motion } from "framer-motion";
import CreateRoomForm from "@/components/game/CreateRoomForm";

const CreateRoom: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 min-h-screen py-12">
      <div className="absolute inset-0 opacity-80"></div>
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CreateRoomForm />
      </motion.div>
    </div>
  );
};

export default CreateRoom;
