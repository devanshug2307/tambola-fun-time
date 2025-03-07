// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useGameContext } from "@/context/GameContext";

// const NumberBoard: React.FC = () => {
//   const { calledNumbers, lastCalledNumber } = useGameContext();
//   const [animating, setAnimating] = useState(false);

//   // Create an array of all possible numbers (1-90)
//   const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

//   useEffect(() => {
//     if (lastCalledNumber) {
//       setAnimating(true);
//       const timer = setTimeout(() => {
//         setAnimating(false);
//       }, 2000);

//       return () => clearTimeout(timer);
//     }
//   }, [lastCalledNumber]);

//   return (
//     <div className="w-full max-w-4xl mx-auto">
//       <div className="mb-8 text-center">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Number Board</h2>

//         <AnimatePresence mode="wait">
//           {lastCalledNumber && (
//             <motion.div
//               key={lastCalledNumber}
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 25 }}
//               className="relative"
//             >
//               <div className="w-24 h-24 flex items-center justify-center bg-pink-500 text-white rounded-full font-bold text-4xl mx-auto shadow-lg">
//                 {lastCalledNumber}
//               </div>
//               <div className="text-sm text-gray-500 mt-2">Current Number</div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <div className="grid grid-cols-10 gap-2">
//         {allNumbers.map((num) => {
//           const isCalled = calledNumbers.includes(num);
//           const isLastCalled = num === lastCalledNumber;

//           return (
//             <motion.div
//               key={num}
//               className={`w-full aspect-square flex items-center justify-center rounded-md text-lg font-medium border ${
//                 isCalled
//                   ? "bg-pink-500 text-white border-pink-600"
//                   : "bg-white text-gray-700 border-gray-200"
//               }`}
//               animate={
//                 isLastCalled && animating
//                   ? {
//                       scale: [1, 1.2, 1],
//                       backgroundColor: [
//                         "rgb(219, 39, 119)",
//                         "rgb(236, 72, 153)",
//                         "rgb(219, 39, 119)",
//                       ],
//                       boxShadow: [
//                         "0 0 0 rgba(236, 72, 153, 0)",
//                         "0 0 15px rgba(236, 72, 153, 0.7)",
//                         "0 0 0 rgba(236, 72, 153, 0)",
//                       ],
//                     }
//                   : {}
//               }
//               transition={{ duration: 1.5, repeat: 0 }}
//             >
//               {num}
//             </motion.div>
//           );
//         })}
//       </div>

//       <div className="mt-8 text-center">
//         <div className="inline-flex items-center gap-4 text-sm text-gray-500">
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-pink-500"></div>
//             <span>Called</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-white border border-gray-200"></div>
//             <span>Not Called</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NumberBoard;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameContext } from "@/context/GameContext";
import { Volume2, VolumeX } from "lucide-react";

const NumberBoard: React.FC = () => {
  const { calledNumbers, lastCalledNumber } = useGameContext();
  const [animating, setAnimating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Create an array of all possible numbers (1-90)
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

  // Group numbers into rows of 10 for better organization
  const numberRows = [];
  for (let i = 0; i < 9; i++) {
    numberRows.push(allNumbers.slice(i * 10, (i + 1) * 10));
  }

  useEffect(() => {
    if (lastCalledNumber) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 2000);

      // Play sound effect if enabled
      if (soundEnabled) {
        const audio = new Audio("/assets/sounds/number-called.mp3");
        audio.volume = 0.5;
        audio.play().catch((e) => console.log("Audio play failed:", e));
      }

      return () => clearTimeout(timer);
    }
  }, [lastCalledNumber, soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Numbers Called
        </h2>
        <button
          onClick={toggleSound}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Current number display */}
      <div className="mb-6">
        <AnimatePresence mode="wait">
          {lastCalledNumber ? (
            <motion.div
              key={lastCalledNumber}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex flex-col items-center"
            >
              <div className="text-sm text-gray-500 mb-1">Current Number</div>
              <motion.div
                className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold text-3xl md:text-4xl shadow-lg"
                animate={
                  animating
                    ? {
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          "0 4px 6px rgba(236, 72, 153, 0.1)",
                          "0 8px 24px rgba(236, 72, 153, 0.4)",
                          "0 4px 6px rgba(236, 72, 153, 0.1)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                {lastCalledNumber}
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-1">
                Waiting for next number
              </div>
              <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full font-bold text-xl md:text-2xl">
                ?
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Numbers grid with responsive layout */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-full">
          {numberRows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex justify-center mb-2 gap-1 md:gap-2"
            >
              {row.map((num) => {
                const isCalled = calledNumbers.includes(num);
                const isLastCalled = num === lastCalledNumber;

                return (
                  <motion.div
                    key={num}
                    className={`
                      w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md text-sm md:text-base font-medium
                      ${
                        isCalled
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                      }
                      transition-all duration-300
                    `}
                    animate={
                      isLastCalled && animating
                        ? {
                            scale: [1, 1.15, 1],
                            boxShadow: [
                              "0 0 0 rgba(236, 72, 153, 0)",
                              "0 0 15px rgba(236, 72, 153, 0.7)",
                              "0 0 0 rgba(236, 72, 153, 0)",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 1.5 }}
                  >
                    {num}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Called number stats */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
          <span>Called</span>
        </div>

        <div className="bg-gray-100 px-3 py-1 rounded-full">
          <span className="font-medium">{calledNumbers.length}</span>
          <span className="text-gray-500"> / 90</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white border border-gray-200"></div>
          <span>Remaining</span>
        </div>
      </div>
    </div>
  );
};

export default NumberBoard;

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useGameContext } from "@/context/GameContext";
// import { Volume2, VolumeX, Trophy } from "lucide-react";

// const NumberBoard = () => {
//   const { calledNumbers, lastCalledNumber } = useGameContext();
//   const [animating, setAnimating] = useState(false);
//   const [soundEnabled, setSoundEnabled] = useState(true);

//   // Create an array of all possible numbers (1-90)
//   const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

//   // Group numbers into rows of 10 for better organization
//   const numberRows = [];
//   for (let i = 0; i < 9; i++) {
//     numberRows.push(allNumbers.slice(i * 10, (i + 1) * 10));
//   }

//   useEffect(() => {
//     if (lastCalledNumber) {
//       setAnimating(true);
//       const timer = setTimeout(() => {
//         setAnimating(false);
//       }, 2000);

//       // Play sound effect if enabled
//       if (soundEnabled) {
//         const audio = new Audio("/assets/sounds/number-called.mp3");
//         audio.volume = 0.5;
//         audio.play().catch((e) => console.log("Audio play failed:", e));
//       }

//       return () => clearTimeout(timer);
//     }
//   }, [lastCalledNumber, soundEnabled]);

//   const toggleSound = () => {
//     setSoundEnabled(!soundEnabled);
//   };

//   // Get called numbers count
//   const calledCount = calledNumbers.length;
//   const remainingCount = 90 - calledCount;

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
//         {/* Header with status */}
//         <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 flex justify-between items-center">
//           <div className="flex items-center">
//             <span className="text-white font-bold text-lg">Numbers Called</span>
//             <span className="ml-3 bg-white text-purple-600 text-sm font-bold px-3 py-1 rounded-full">
//               {calledCount}/90
//             </span>
//           </div>
//           <button
//             onClick={toggleSound}
//             className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
//             aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
//           >
//             {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
//           </button>
//         </div>

//         {/* Current number display */}
//         <div className="pt-6 pb-4 px-4">
//           <div className="text-center">
//             <p className="text-gray-500 text-sm mb-2">Current Number</p>
//             <AnimatePresence mode="wait">
//               {lastCalledNumber ? (
//                 <motion.div
//                   key={lastCalledNumber}
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   exit={{ scale: 0.8, opacity: 0 }}
//                   transition={{ type: "spring", stiffness: 300, damping: 25 }}
//                   className="relative mx-auto"
//                 >
//                   <motion.div
//                     className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full font-bold text-4xl md:text-5xl mx-auto shadow-lg"
//                     animate={
//                       animating
//                         ? {
//                             scale: [1, 1.15, 1],
//                             boxShadow: [
//                               "0 4px 6px rgba(236, 72, 153, 0.2)",
//                               "0 10px 30px rgba(236, 72, 153, 0.5)",
//                               "0 4px 6px rgba(236, 72, 153, 0.2)",
//                             ],
//                           }
//                         : {}
//                     }
//                     transition={{ duration: 1.5, ease: "easeInOut" }}
//                   >
//                     {lastCalledNumber}
//                   </motion.div>
//                 </motion.div>
//               ) : (
//                 <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full font-bold text-2xl mx-auto">
//                   ?
//                 </div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* Stats cards */}
//         <div className="grid grid-cols-3 divide-x border-t border-gray-100">
//           <div className="py-3 text-center">
//             <p className="font-medium text-2xl text-blue-500">{calledCount}</p>
//             <p className="text-xs text-gray-500">Numbers Called</p>
//           </div>
//           <div className="py-3 text-center">
//             <p className="font-medium text-2xl text-orange-500">
//               {remainingCount}
//             </p>
//             <p className="text-xs text-gray-500">Remaining</p>
//           </div>
//           <div className="py-3 text-center">
//             <p className="font-medium text-2xl text-purple-500">
//               {Math.floor((calledCount / 90) * 100)}%
//             </p>
//             <p className="text-xs text-gray-500">Progress</p>
//           </div>
//         </div>
//       </div>

//       {/* Numbers grid */}
//       <div className="bg-white rounded-2xl shadow-lg p-4">
//         <div className="overflow-x-auto">
//           <div className="min-w-full">
//             {numberRows.map((row, rowIndex) => (
//               <div
//                 key={`row-${rowIndex}`}
//                 className="flex justify-center mb-2 gap-1 md:gap-2"
//               >
//                 {row.map((num) => {
//                   const isCalled = calledNumbers.includes(num);
//                   const isLastCalled = num === lastCalledNumber;

//                   return (
//                     <motion.div
//                       key={num}
//                       className={`
//                         w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-sm sm:text-base font-medium
//                         ${
//                           isCalled
//                             ? isLastCalled
//                               ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"
//                               : "bg-gradient-to-r from-pink-400 to-purple-400 text-white"
//                             : "bg-white text-gray-700 border border-gray-200"
//                         }
//                         transition-all duration-200 ease-in-out
//                       `}
//                       animate={
//                         isLastCalled && animating
//                           ? {
//                               scale: [1, 1.2, 1],
//                               boxShadow: [
//                                 "0 0 0 rgba(236, 72, 153, 0)",
//                                 "0 0 20px rgba(236, 72, 153, 0.8)",
//                                 "0 0 0 rgba(236, 72, 153, 0)",
//                               ],
//                             }
//                           : {}
//                       }
//                       transition={{ duration: 1.5 }}
//                     >
//                       {num}
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="mt-6 flex justify-center gap-6 text-sm text-gray-600">
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
//             <span>Called</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 rounded-full bg-white border border-gray-200"></div>
//             <span>Not Called</span>
//           </div>
//         </div>
//       </div>

//       {/* Ticket Section */}
//       <div className="bg-white rounded-2xl shadow-lg p-4 mt-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Your Ticket</h2>
//           <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded-full">
//             1 marked
//           </span>
//         </div>

//         <p className="text-sm text-gray-500 mb-3">
//           Tap called numbers to mark them
//         </p>

//         {/* Sample ticket - this would be dynamic in a real implementation */}
//         <div className="grid grid-cols-9 gap-2 mb-4">
//           {[5, 18, null, null, 59, 62, 79].map((num, idx) => (
//             <div
//               key={`r1-${idx}`}
//               className={`
//               h-10 flex items-center justify-center rounded-lg text-sm font-medium
//               ${!num ? "invisible" : ""}
//               ${
//                 calledNumbers.includes(num)
//                   ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white"
//                   : "bg-white border border-gray-200 text-gray-700"
//               }
//             `}
//             >
//               {num}
//             </div>
//           ))}
//           {[null, null, 49, 55, 63, 77, null, 83].map((num, idx) => (
//             <div
//               key={`r2-${idx}`}
//               className={`
//               h-10 flex items-center justify-center rounded-lg text-sm font-medium
//               ${!num ? "invisible" : ""}
//               ${
//                 calledNumbers.includes(num)
//                   ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white"
//                   : "bg-white border border-gray-200 text-gray-700"
//               }
//               ${num === 77 ? "relative" : ""}
//             `}
//             >
//               {num}
//               {num === 77 && (
//                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"></span>
//               )}
//             </div>
//           ))}
//           {[21, 31, 40, 50, 68, null, null, null].map((num, idx) => (
//             <div
//               key={`r3-${idx}`}
//               className={`
//               h-10 flex items-center justify-center rounded-lg text-sm font-medium
//               ${!num ? "invisible" : ""}
//               ${
//                 num === 40
//                   ? "ring-2 ring-pink-500 bg-gradient-to-r from-pink-400 to-purple-400 text-white"
//                   : calledNumbers.includes(num)
//                   ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white"
//                   : "bg-white border border-gray-200 text-gray-700"
//               }
//             `}
//             >
//               {num}
//             </div>
//           ))}
//         </div>

//         {/* Prize buttons */}
//         <div className="space-y-2">
//           <p className="text-sm font-medium text-gray-700 mb-2">Claim Prize:</p>
//           <div className="flex flex-wrap gap-2">
//             <button className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-3 py-2 rounded-full text-sm font-medium">
//               Early 5
//             </button>
//             <button className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-3 py-2 rounded-full text-sm font-medium">
//               Full House
//             </button>
//             <button className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-2 rounded-full text-sm font-medium">
//               Top Line
//             </button>
//             <button className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-2 rounded-full text-sm font-medium">
//               Middle Line
//             </button>
//             <button className="bg-gradient-to-r from-purple-400 to-purple-500 text-white px-3 py-2 rounded-full text-sm font-medium">
//               Bottom Line
//             </button>
//           </div>
//         </div>

//         {/* Trophy button */}
//         <div className="absolute bottom-6 right-6">
//           <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
//             <Trophy size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NumberBoard;
