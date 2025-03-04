import React from "react";
import { motion } from "framer-motion";
import CreateRoomForm from "@/components/game/CreateRoomForm";

const CreateRoom: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create a New Tambola Room
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Customize your game settings and invite friends to play
          </p>
        </div>

        <CreateRoomForm />
      </motion.div>
    </div>
  );
};

export default CreateRoom;
