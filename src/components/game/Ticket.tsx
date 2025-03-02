
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameContext } from "@/context/GameContext";

interface TicketProps {
  ticketId: string;
}

const Ticket: React.FC<TicketProps> = ({ ticketId }) => {
  const { tickets, markNumber, calledNumbers, roomSettings } = useGameContext();
  const [animatingCell, setAnimatingCell] = useState<string | null>(null);
  
  const ticket = tickets.find(t => t.id === ticketId);
  
  if (!ticket) return null;
  
  const handleNumberClick = (num: number | null) => {
    if (num === null || !calledNumbers.includes(num)) return;
    
    // Only mark if the number has been called and not already marked
    if (!ticket.markedNumbers.includes(num)) {
      setAnimatingCell(`${num}`);
      setTimeout(() => setAnimatingCell(null), 500);
      markNumber(ticketId, num);
    }
  };
  
  return (
    <div className="tambola-ticket max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Your Ticket</h3>
      </div>
      
      <div className="tambola-ticket-inner p-4">
        <div className="grid grid-cols-9 gap-1">
          {ticket.numbers.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((num, colIndex) => {
                const isMarked = num !== null && ticket.markedNumbers.includes(num);
                const isCalled = num !== null && calledNumbers.includes(num);
                
                return (
                  <div 
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`relative flex items-center justify-center h-12 rounded 
                      ${num === null ? 'bg-gray-50' : 'bg-white border border-gray-200 cursor-pointer hover:bg-gray-50'}
                      ${isMarked ? 'border-tambola-pink' : ''}
                      transition-all duration-200 ease-in-out`}
                    onClick={() => num !== null && handleNumberClick(num)}
                  >
                    {num !== null && (
                      <>
                        <span className={`text-sm font-medium ${isMarked ? 'text-tambola-pink' : ''}`}>
                          {num}
                        </span>
                        
                        <AnimatePresence>
                          {isMarked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="w-7 h-7 rounded-full bg-tambola-pink/10 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-tambola-pink"></div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <AnimatePresence>
                          {isCalled && !isMarked && roomSettings?.autoMarkEnabled === false && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute top-0 right-0"
                            >
                              <div className="w-2 h-2 rounded-full bg-tambola-amber"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{ticket.markedNumbers.length}</span> marked
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 bg-tambola-pink text-white text-sm rounded-md hover:bg-tambola-pink/90 transition-colors"
          >
            Claim Early 5
          </button>
          <button 
            className="px-3 py-1 bg-tambola-blue text-white text-sm rounded-md hover:bg-tambola-blue/90 transition-colors"
          >
            Claim Full House
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
