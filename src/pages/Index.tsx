import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/landing/Hero";

import { GameProvider } from "@/context/GameContext";

const Index: React.FC = () => {
  return (
    <GameProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white"
      >
        <Hero />
      </motion.div>
    </GameProvider>
  );
};

export default Index;
