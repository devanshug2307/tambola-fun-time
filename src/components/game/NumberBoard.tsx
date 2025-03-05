
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

  // Group numbers in tens for better visual organization
  const numberGroups = [
    allNumbers.slice(0, 10),   // 1-10
    allNumbers.slice(10, 20),  // 11-20
    allNumbers.slice(20, 30),  // 21-30
    allNumbers.slice(30, 40),  // 31-40
    allNumbers.slice(40, 50),  // 41-50
    allNumbers.slice(50, 60),  // 51-60
    allNumbers.slice(60, 70),  // 61-70
    allNumbers.slice(70, 80),  // 71-80
    allNumbers.slice(80, 90)   // 81-90
  ];
  
  const getNumberColor = (num: number) => {
    // Different color ranges based on number groups
    if (num <= 10) return "from-blue-400 to-blue-600"; 
    if (num <= 20) return "from-indigo-400 to-indigo-600";
    if (num <= 30) return "from-purple-400 to-purple-600";
    if (num <= 40) return "from-fuchsia-400 to-fuchsia-600";
    if (num <= 50) return "from-pink-400 to-pink-600";
    if (num <= 60) return "from-rose-400 to-rose-600";
    if (num <= 70) return "from-red-400 to-red-600";
    if (num <= 80) return "from-orange-400 to-orange-600";
    return "from-amber-400 to-amber-600";
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Number Board</h2>
      
      <div className="space-y-4">
        {numberGroups.map((group, groupIndex) => (
          <div key={`group-${groupIndex}`} className="bg-gray-50 rounded-xl p-2">
            <div className="grid grid-cols-10 gap-2">
              {group.map((num) => {
                const isCalled = calledNumbers.includes(num);
                const isLastCalled = num === lastCalledNumber;
                const bgGradient = getNumberColor(num);

                return (
                  <motion.div
                    key={`num-${num}`}
                    className={`aspect-square flex items-center justify-center rounded-md text-base font-medium
                      ${isCalled 
                        ? `bg-gradient-to-br ${bgGradient} text-white shadow-md`
                        : 'bg-white text-gray-700 border border-gray-200'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    animate={
                      isLastCalled && animating
                        ? {
                            scale: [1, 1.2, 1],
                            boxShadow: [
                              "0 0 0 rgba(236, 72, 153, 0)",
                              "0 0 20px rgba(236, 72, 153, 0.7)",
                              "0 0 0 rgba(236, 72, 153, 0)",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 1.5 }}
                  >
                    {isLastCalled && animating ? (
                      <motion.span
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1] 
                        }}
                        transition={{ duration: 1.5 }}
                      >
                        {num}
                      </motion.span>
                    ) : (
                      <span>{num}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-pink-600"></div>
          <span className="text-sm text-gray-600">Called</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white border border-gray-200"></div>
          <span className="text-sm text-gray-600">Not Called</span>
        </div>
      </div>
    </div>
  );
};

export default NumberBoard;
