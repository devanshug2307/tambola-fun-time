import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-tambola-blue/5 to-tambola-pink/5 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4"
          >
            <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-tambola-blue/10 text-tambola-blue mb-2">
              Multiplayer Game
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-tambola-blue to-tambola-pink">
              Tambola
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Experience the classic Housie game with friends and family online.
            Create a room, invite players, and enjoy the excitement together.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <ButtonCustom
              variant="primary"
              size="lg"
              onClick={() => navigate("/create-room")}
              className="sm:w-auto w-full"
            >
              Create Room
            </ButtonCustom>
            <ButtonCustom
              variant="outline"
              size="lg"
              onClick={() => navigate("/join-room")}
              className="sm:w-auto w-full"
            >
              Join Room
            </ButtonCustom>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-0 w-full max-w-6xl mx-auto opacity-10 z-0"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="grid grid-cols-10 gap-1 px-4">
            {Array.from({ length: 90 }, (_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md border border-gray-200 flex items-center justify-center"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
