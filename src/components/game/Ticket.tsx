import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameContext } from "@/context/GameContext";
import "./Ticket.css";
import Leaderboard from "@/components/game/Leaderboard";

interface TicketProps {
  ticketId: string;
}

const Ticket: React.FC<TicketProps> = ({ ticketId }) => {
  const {
    tickets,
    markNumber,
    calledNumbers,
    roomSettings,
    claimPattern,
    playerName,
    leaderboard,
    players,
    winners,
  } = useGameContext();
  const [animatingCell, setAnimatingCell] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [claimedPattern, setClaimedPattern] = useState<string | null>(null);

  const ticket = tickets.find((t) => t.id === ticketId);

  if (!ticket) return null;

  const handleNumberClick = (num: number | null) => {
    if (num === null || !calledNumbers.includes(num)) return;

    // Only mark if the number has been called and not already marked
    if (!ticket.markedNumbers.includes(num)) {
      setAnimatingCell(`${num}`);
      setTimeout(() => setAnimatingCell(null), 800); // Extended animation time
      markNumber(ticketId, num);
    }
  };

  const handleClaimPattern = (pattern: string) => {
    const markedCount = ticket.markedNumbers.length;
    const isPatternClaimed = winners.some((w) => w.pattern === pattern);

    if (isPatternClaimed) {
      setMessage("This prize has already been claimed by another user.");
      return;
    }

    // Check if the pattern is valid based on marked numbers
    let isValidClaim = false;

    if (pattern === "Full House") {
      // Count all non-null numbers on the ticket
      const totalNumbers = ticket.numbers
        .flat()
        .filter((num) => num !== null).length;
      // Check if all numbers are marked
      isValidClaim = ticket.markedNumbers.length >= totalNumbers;
    } else if (pattern === "Early 5" && markedCount >= 5) {
      isValidClaim = true;
    } else if (pattern === "Top Line") {
      // Check if all numbers in the top row are marked
      const topRowNumbers = ticket.numbers[0].filter((num) => num !== null);
      isValidClaim = topRowNumbers.every((num) =>
        ticket.markedNumbers.includes(num as number)
      );
    } else if (pattern === "Middle Line") {
      // Check if all numbers in the middle row are marked
      const middleRowNumbers = ticket.numbers[1].filter((num) => num !== null);
      isValidClaim = middleRowNumbers.every((num) =>
        ticket.markedNumbers.includes(num as number)
      );
    } else if (pattern === "Bottom Line") {
      // Check if all numbers in the bottom row are marked
      const bottomRowNumbers = ticket.numbers[2].filter((num) => num !== null);
      isValidClaim = bottomRowNumbers.every((num) =>
        ticket.markedNumbers.includes(num as number)
      );
    }

    if (!isValidClaim) {
      setMessage(`You haven't completed the ${pattern} pattern yet.`);
      return;
    }

    // Trigger celebration animation
    setClaimedPattern(pattern);
    setShowCelebration(true);

    // Hide celebration after 4 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 4000);

    claimPattern(pattern);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Generate confetti/flower petals for the celebration
  const generateConfetti = () => {
    const confetti = [];
    const colors = [
      "#FF77FF", // Pink
      "#77DDFF", // Light Blue
      "#FFDD77", // Yellow
      "#77FF77", // Light Green
      "#FF7777", // Light Red
      "#DDA0DD", // Plum
      "#FFB6C1", // Light Pink
      "#87CEFA", // Light Sky Blue
    ];

    // Create 60 confetti/petal elements
    for (let i = 0; i < 60; i++) {
      const left = Math.random() * 100;
      const animDuration = 3 + Math.random() * 2;
      const size = 8 + Math.random() * 15;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 0.5;
      const rotation = Math.random() * 360;

      confetti.push(
        <motion.div
          key={`confetti-${i}`}
          className="absolute"
          style={{
            left: `${left}%`,
            top: "-20px",
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius:
              i % 3 === 0 ? "50%" : i % 3 === 1 ? "0%" : "50% 0 50% 50%", // Mix of circles, squares, and flower-like shapes
            zIndex: 100,
            opacity: 0.8,
            transform: `rotate(${rotation}deg)`,
          }}
          initial={{ y: -20, opacity: 0, scale: 0 }}
          animate={{
            y: ["0%", "100%"],
            x: [
              `${Math.sin(i) * 10}px`,
              `${Math.sin(i + 1) * 30}px`,
              `${Math.sin(i + 2) * 10}px`,
            ],
            opacity: [0, 1, 1, 0.5, 0],
            scale: [0, 1, 1, 0.8, 0],
            rotate: [`${rotation}deg`, `${rotation + 180}deg`],
          }}
          transition={{
            duration: animDuration,
            delay: delay,
            ease: "easeOut",
          }}
        />
      );
    }

    return confetti;
  };

  return (
    <div className="tambola-ticket max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden relative">
      {message && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500 text-white p-2 rounded-md mb-4 mx-4 mt-4 text-center shadow-lg"
          >
            {message}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Winner Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 overflow-hidden pointer-events-none z-50"
            style={{ perspective: "1000px" }}
          >
            {/* Confetti/Flower petals */}
            {generateConfetti()}

            {/* Congratulations message */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1, 0.8],
              }}
              transition={{
                duration: 3,
                times: [0, 0.2, 0.8, 1],
              }}
            >
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center"
                animate={{
                  rotateY: [0, 10, -10, 5, -5, 0],
                  y: [0, -10, 10, -5, 0],
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <motion.h2
                  className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2"
                  animate={{
                    scale: [1, 1.2, 1.1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: 1,
                    repeatType: "reverse",
                  }}
                >
                  Congratulations!
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-700 font-medium"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: 3,
                    repeatType: "reverse",
                  }}
                >
                  You won{" "}
                  <span className="font-bold text-pink-600">
                    {claimedPattern}
                  </span>
                  !
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Your Ticket</h3>
      </div>

      <div className="tambola-ticket-inner p-4">
        <div className="grid grid-cols-9 gap-1">
          {ticket.numbers.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((num, colIndex) => {
                const isMarked =
                  num !== null && ticket.markedNumbers.includes(num);
                const isCalled = num !== null && calledNumbers.includes(num);
                const isAnimating = animatingCell === `${num}`;

                return (
                  <motion.div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`relative flex items-center justify-center h-12 rounded-lg overflow-hidden
                      ${
                        num === null
                          ? "bg-gray-50"
                          : isMarked
                          ? "bg-white shadow-lg border-2 border-pink-500"
                          : "bg-white border border-gray-200 cursor-pointer hover:bg-gray-50"
                      }
                      transition-all duration-300 ease-in-out`}
                    onClick={() => num !== null && handleNumberClick(num)}
                    whileHover={
                      num !== null && !isMarked ? { scale: 1.05 } : {}
                    }
                    whileTap={{ scale: 0.95 }}
                    animate={
                      isAnimating
                        ? {
                            scale: [1, 1.2, 0.9, 1.1, 1],
                            borderColor: [
                              "#E5E7EB",
                              "#FBCFE8",
                              "#F472B6",
                              "#EC4899",
                              "#DB2777",
                            ],
                            borderWidth: ["1px", "2px", "3px", "3px", "2px"],
                            transition: { duration: 0.8 },
                          }
                        : {}
                    }
                  >
                    {num !== null && (
                      <>
                        {isMarked ? (
                          <motion.div
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          >
                            <span className="text-sm font-bold">{num}</span>
                          </motion.div>
                        ) : (
                          <motion.span
                            className="text-sm font-medium text-gray-700"
                            animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            {num}
                          </motion.span>
                        )}

                        <AnimatePresence>
                          {isMarked && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                              className="absolute inset-0 -z-10"
                            >
                              {/* Subtle radial gradient behind marked numbers */}
                              <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg -z-10" />

                              {/* Decorative elements */}
                              <motion.div
                                initial={{ scale: 0, opacity: 0.6 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatDelay: 1,
                                }}
                                className="absolute inset-0 border-2 border-pink-300 rounded-full -z-10"
                                style={{
                                  left: "50%",
                                  top: "50%",
                                  x: "-50%",
                                  y: "-50%",
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <AnimatePresence>
                          {isCalled &&
                            !isMarked &&
                            roomSettings?.autoMarkEnabled === false && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-1 right-1"
                              >
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-amber-500"
                                  animate={{
                                    scale: [1, 1.5, 1],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                  }}
                                />
                              </motion.div>
                            )}
                        </AnimatePresence>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
          <span className="font-medium text-pink-500">
            {ticket.markedNumbers.length}
          </span>{" "}
          marked
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-1.5 bg-pink-500 text-white text-xs rounded-md hover:bg-pink-600 transition-colors shadow-md"
            onClick={() => handleClaimPattern("Early 5")}
          >
            <i className="fas fa-star mr-1"></i> Early 5
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-1.5 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors shadow-md"
            onClick={() => handleClaimPattern("Full House")}
          >
            <i className="fas fa-home mr-1"></i> Full House
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-1.5 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors shadow-md"
            onClick={() => handleClaimPattern("Top Line")}
          >
            <i className="fas fa-arrow-up mr-1"></i> Top Line
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-1.5 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600 transition-colors shadow-md"
            onClick={() => handleClaimPattern("Middle Line")}
          >
            <i className="fas fa-arrow-down mr-1"></i> Middle Line
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-1.5 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors shadow-md"
            onClick={() => handleClaimPattern("Bottom Line")}
          >
            <i className="fas fa-flag mr-1"></i> Bottom Line
          </motion.button>
        </div>
      </div>

      <div className="mt-6">
        <Leaderboard leaderboard={leaderboard} players={players} />
      </div>
    </div>
  );
};

export default Ticket;
