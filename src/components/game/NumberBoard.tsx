
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameContext } from "@/context/GameContext";

const NumberBoard: React.FC = () => {
  const { calledNumbers, lastCalledNumber } = useGameContext();
  const [animating, setAnimating] = useState(false);
  
  // Create an array of all possible numbers (1-90)
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  
  useEffect(() => {
    if (lastCalledNumber) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [lastCalledNumber]);
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Number Board</h2>
        
        <AnimatePresence mode="wait">
          {lastCalledNumber && (
            <motion.div
              key={lastCalledNumber}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-pink-500 text-white rounded-full font-bold text-3xl mx-auto">
                {lastCalledNumber}
              </div>
              <div className="text-sm text-gray-500 mt-2">Last Called Number</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="grid grid-cols-10 gap-2">
        {allNumbers.map(num => {
          const isCalled = calledNumbers.includes(num);
          const isLastCalled = num === lastCalledNumber;
          
          return (
            <motion.div
              key={num}
              className={`w-full aspect-square flex items-center justify-center rounded-md text-lg font-medium border ${
                isCalled 
                  ? 'bg-pink-500 text-white border-pink-600' 
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
              animate={
                isLastCalled && animating
                  ? { scale: [1, 1.1, 1], backgroundColor: 'rgb(236, 72, 153)' }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              {num}
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span>Called</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border border-gray-200"></div>
            <span>Not Called</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberBoard;
