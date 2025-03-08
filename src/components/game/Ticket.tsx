import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameContext } from "@/context/GameContext";
import "./Ticket.css";
import Leaderboard from "@/components/game/Leaderboard";

interface TicketProps {
  ticketId: string;
}

interface ClaimButtonProps {
  pattern: string;
  icon: string;
  color: string;
  onClick: () => void;
  disabled: boolean;
}

// Pattern button component with improved accessibility and visual feedback
const ClaimButton: React.FC<ClaimButtonProps> = ({
  pattern,
  icon,
  color,
  onClick,
  disabled,
}) => {
  // Map colors to Tailwind classes
  const colorMap: Record<string, string> = {
    pink: "bg-pink-500 hover:bg-pink-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    purple: "bg-purple-500 hover:bg-purple-600",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`flex items-center px-3 py-1.5 text-white text-xs rounded-md shadow-md
        ${disabled ? "bg-gray-400 cursor-not-allowed" : colorMap[color]}
        transition-colors duration-200`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Claim ${pattern}`}
    >
      <i className={`fas fa-${icon} mr-1`}></i> {pattern}
      {disabled && <span className="ml-1 text-xs">(Claimed)</span>}
    </motion.button>
  );
};

const NumberCell: React.FC<{
  num: number | null;
  rowIndex: number;
  colIndex: number;
  isMarked: boolean;
  isCalled: boolean;
  isAnimating: boolean;
  onClick: () => void;
  autoMarkEnabled: boolean;
}> = React.memo(
  ({
    num,
    rowIndex,
    colIndex,
    isMarked,
    isCalled,
    isAnimating,
    onClick,
    autoMarkEnabled,
  }) => {
    return (
      <motion.div
        key={`cell-${rowIndex}-${colIndex}`}
        className={`relative flex items-center justify-center h-12 rounded-lg overflow-hidden
          ${
            num === null
              ? "bg-gray-50 border border-gray-200" // Changed to regular border like other cells
              : isMarked
              ? "bg-white shadow-lg border-2 border-pink-500"
              : "bg-white border border-gray-200 cursor-pointer hover:bg-gray-50"
          }
          transition-all duration-300 ease-in-out`}
        onClick={() => num !== null && onClick()} // Fixed to use the passed onClick function
        whileHover={num !== null && !isMarked ? { scale: 1.05 } : {}}
        whileTap={{ scale: num !== null ? 0.95 : 1 }}
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
        {num !== null ? (
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
              {isCalled && !isMarked && autoMarkEnabled === false && (
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
        ) : (
          // Empty cell - removed the circular element
          <div className="w-full h-full"></div>
        )}
      </motion.div>
    );
  }
);

NumberCell.displayName = "NumberCell";

const Ticket: React.FC<TicketProps> = ({ ticketId }) => {
  const {
    tickets,
    markNumber,
    calledNumbers,
    roomSettings,
    claimPattern,
    playerName,
    leaderboard = [],
    players,
    winners,
    latestCalledNumber,
  } = useGameContext();
  const [animatingCell, setAnimatingCell] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | "info">(
    "info"
  );
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [claimedPattern, setClaimedPattern] = useState<string | null>(null);
  const [nextNumberTimer, setNextNumberTimer] = useState<number | null>(null);
  const [showClaimHelp, setShowClaimHelp] = useState<boolean>(true);

  const ticket = tickets.find((t) => t.id === ticketId);

  if (!ticket) return null;

  // Get list of patterns that have already been claimed
  const claimedPatterns = winners.map((w) => w.pattern);

  // Calculate next number call time if available from roomSettings
  useEffect(() => {
    if (roomSettings?.numberInterval && roomSettings.gameActive) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - (roomSettings.lastNumberCalledTime || 0);
        const remaining = Math.max(
          0,
          Math.floor((roomSettings.numberInterval * 1000 - elapsed) / 1000)
        );
        setNextNumberTimer(remaining);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setNextNumberTimer(null);
    }
  }, [roomSettings]);

  // Hide claim help message after 15 seconds
  useEffect(() => {
    if (showClaimHelp) {
      const timer = setTimeout(() => setShowClaimHelp(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [showClaimHelp]);

  const handleNumberClick = useCallback(
    (num: number) => {
      if (num === null || !calledNumbers.includes(num)) return;

      // Only mark if the number has been called and not already marked
      if (!ticket.markedNumbers.includes(num)) {
        setAnimatingCell(`${num}`);
        setTimeout(() => setAnimatingCell(null), 800); // Extended animation time
        markNumber(ticketId, num);
      }
    },
    [ticketId, calledNumbers, ticket.markedNumbers, markNumber]
  );

  const handleClaimPattern = useCallback(
    (pattern: string) => {
      const markedCount = ticket.markedNumbers.length;
      const isPatternClaimed = winners.some((w) => w.pattern === pattern);

      if (isPatternClaimed) {
        setMessage(`This prize has already been claimed by another player.`);
        setMessageType("error");
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
        const middleRowNumbers = ticket.numbers[1].filter(
          (num) => num !== null
        );
        isValidClaim = middleRowNumbers.every((num) =>
          ticket.markedNumbers.includes(num as number)
        );
      } else if (pattern === "Bottom Line") {
        // Check if all numbers in the bottom row are marked
        const bottomRowNumbers = ticket.numbers[2].filter(
          (num) => num !== null
        );
        isValidClaim = bottomRowNumbers.every((num) =>
          ticket.markedNumbers.includes(num as number)
        );
      }

      if (!isValidClaim) {
        setMessage(`You haven't completed the ${pattern} pattern yet.`);
        setMessageType("error");
        return;
      }

      // Trigger celebration animation
      setClaimedPattern(pattern);
      setShowCelebration(true);
      setMessage(`Congratulations! You've claimed ${pattern}!`);
      setMessageType("success");

      // Hide celebration after 4 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 4000);

      claimPattern(pattern);
    },
    [ticket, winners, claimPattern]
  );

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Alert about latest called number with visual feedback
  useEffect(() => {
    if (latestCalledNumber && calledNumbers.includes(latestCalledNumber)) {
      const numberExists = ticket.numbers
        .flat()
        .some((num) => num === latestCalledNumber);

      if (numberExists) {
        setMessage(`Number ${latestCalledNumber} is on your ticket!`);
        setMessageType("info");
      }
    }
  }, [latestCalledNumber]);

  // Generate confetti/flower petals for the celebration
  const generateConfetti = useMemo(() => {
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
  }, []);

  return (
    <div className="tambola-ticket max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden relative">
      {/* Latest number call notification and timer */}
      {latestCalledNumber && (
        <div className="bg-gradient-to-r from-violet-500 to-pink-500 text-white p-2 text-center shadow-md">
          <div className="flex justify-center items-center gap-2">
            <motion.div
              className="bg-white text-pink-600 font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-md"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              {latestCalledNumber}
            </motion.div>
            <span className="text-sm md:text-base font-medium">Called!</span>

            {nextNumberTimer !== null && (
              <div className="ml-2 text-xs md:text-sm bg-white/20 rounded-full px-3 py-1">
                Next number in:{" "}
                <span className="font-bold">{nextNumberTimer}s</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`text-white p-3 rounded-md mx-4 my-2 text-center shadow-lg ${
              messageType === "error"
                ? "bg-red-500"
                : messageType === "success"
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

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
            {generateConfetti}

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

      {/* Ticket Header */}
      <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Your Ticket</h3>
        <div className="text-sm text-gray-600 bg-pink-50 px-3 py-1 rounded-full shadow-sm border border-pink-100">
          <span className="font-medium text-pink-500">
            {ticket.markedNumbers.length}
          </span>{" "}
          marked
        </div>
      </div>

      {/* Quick Tip Text */}
      <div className="px-4 py-2 bg-blue-50 text-sm text-blue-600 text-center font-medium border-b border-blue-100">
        {roomSettings?.autoMarkEnabled
          ? "Numbers are marked automatically for you"
          : "Tap called numbers to mark them"}
      </div>

      {/* Ticket Grid */}
      <div className="tambola-ticket-inner p-4">
        <div className="grid grid-cols-9 gap-1 shadow-sm p-3 bg-gray-50 rounded-lg border border-gray-100">
          {ticket.numbers.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((num, colIndex) => {
                const isMarked =
                  num !== null && ticket.markedNumbers.includes(num);
                const isCalled = num !== null && calledNumbers.includes(num);
                const isAnimating = animatingCell === `${num}`;

                return (
                  <NumberCell
                    key={`cell-${rowIndex}-${colIndex}`}
                    num={num}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    isMarked={isMarked}
                    isCalled={isCalled}
                    isAnimating={isAnimating}
                    onClick={() => num !== null && handleNumberClick(num)}
                    autoMarkEnabled={!!roomSettings?.autoMarkEnabled}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pattern Claim Section with improved UI */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-pink-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-medium text-gray-700">Claim Prize:</h4>

          {/* Instructions tooltip */}
          <AnimatePresence>
            {showClaimHelp && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center"
              >
                <i className="fas fa-info-circle mr-1"></i>
                Click button when you complete a pattern!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Improved prize claim section with visual hierarchy */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <ClaimButton
            pattern="Early 5"
            icon="star"
            color="pink"
            onClick={() => handleClaimPattern("Early 5")}
            disabled={claimedPatterns.includes("Early 5")}
          />
          <ClaimButton
            pattern="Full House"
            icon="home"
            color="blue"
            onClick={() => handleClaimPattern("Full House")}
            disabled={claimedPatterns.includes("Full House")}
          />
          <ClaimButton
            pattern="Top Line"
            icon="arrow-up"
            color="green"
            onClick={() => handleClaimPattern("Top Line")}
            disabled={claimedPatterns.includes("Top Line")}
          />
          <ClaimButton
            pattern="Middle Line"
            icon="arrow-down"
            color="yellow"
            onClick={() => handleClaimPattern("Middle Line")}
            disabled={claimedPatterns.includes("Middle Line")}
          />
          <ClaimButton
            pattern="Bottom Line"
            icon="trophy"
            color="purple"
            onClick={() => handleClaimPattern("Bottom Line")}
            disabled={claimedPatterns.includes("Bottom Line")}
          />
        </div>

        {/* Added hint about patterns */}
        <div className="mt-3 text-xs text-center text-gray-500 italic">
          Complete a pattern on your ticket, then click the corresponding button
          to claim your prize!
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="mt-4 border-t border-gray-100">
        <Leaderboard leaderboard={leaderboard} players={players} />
      </div>
    </div>
  );
};

export default Ticket;
