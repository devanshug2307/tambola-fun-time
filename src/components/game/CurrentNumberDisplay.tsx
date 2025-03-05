
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CurrentNumberDisplayProps {
  currentNumber: number | null;
  isPlaying: boolean;
}

const CurrentNumberDisplay: React.FC<CurrentNumberDisplayProps> = ({
  currentNumber,
  isPlaying,
}) => {
  return (
    <div className="flex flex-col items-center py-6">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Current Number</h2>
      
      <AnimatePresence mode="wait">
        {currentNumber ? (
          <motion.div
            key={`number-${currentNumber}`}
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-pink-500 w-32 h-32 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-5xl font-bold text-white">{currentNumber}</span>
            </div>
            {isPlaying && (
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full -z-10 blur-md"
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-32 h-32 rounded-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300"
          >
            <span className="text-gray-400 text-lg">Waiting...</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {currentNumber && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-gray-500"
        >
          Mark this number on your ticket if you have it!
        </motion.p>
      )}
    </div>
  );
};

export default CurrentNumberDisplay;
