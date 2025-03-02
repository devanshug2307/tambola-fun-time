
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type GameState = "idle" | "creating" | "joining" | "waiting" | "playing" | "ended";

interface Player {
  id: string;
  name: string;
  isReady: boolean;
}

interface Ticket {
  id: string;
  numbers: (number | null)[][];
  markedNumbers: number[];
}

interface RoomSettings {
  roomCode: string;
  maxPlayers: number;
  ticketPrice: number;
  numberCallSpeed: number;
  winningPatterns: string[];
  autoMarkEnabled: boolean;
}

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  roomSettings: RoomSettings | null;
  createRoom: (settings: Partial<RoomSettings>) => string;
  joinRoom: (roomCode: string, playerName: string) => void;
  players: Player[];
  currentPlayer: Player | null;
  calledNumbers: number[];
  callNumber: () => void;
  lastCalledNumber: number | null;
  tickets: Ticket[];
  markNumber: (ticketId: string, number: number) => void;
  claimPattern: (pattern: string) => void;
  winners: { pattern: string; player: Player }[];
  leaveRoom: () => void;
}

const defaultContext: GameContextType = {
  gameState: "idle",
  setGameState: () => {},
  roomSettings: null,
  createRoom: () => "",
  joinRoom: () => {},
  players: [],
  currentPlayer: null,
  calledNumbers: [],
  callNumber: () => {},
  lastCalledNumber: null,
  tickets: [],
  markNumber: () => {},
  claimPattern: () => {},
  winners: [],
  leaveRoom: () => {},
};

const GameContext = createContext<GameContextType>(defaultContext);

export const useGameContext = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [roomSettings, setRoomSettings] = useState<RoomSettings | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [winners, setWinners] = useState<{ pattern: string; player: Player }[]>([]);

  // Cleanup function to reset game state when navigating away
  useEffect(() => {
    return () => {
      if (gameState !== "idle") {
        console.log("Cleaning up game context");
      }
    };
  }, []);

  // Function to generate a random 6-character room code
  const generateRoomCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Function to generate a new Tambola ticket
  const generateTicket = (): number[][] => {
    // A Tambola ticket has 3 rows and 9 columns
    // Each row has 5 numbers and 4 blank spaces
    // Numbers are arranged column-wise: 1-9, 10-19, 20-29, ..., 80-90
    
    const ticket: (number | null)[][] = [
      Array(9).fill(null),
      Array(9).fill(null),
      Array(9).fill(null),
    ];
    
    // Generate column ranges
    const colRanges = [
      [1, 9], [10, 19], [20, 29], [30, 39], [40, 49], 
      [50, 59], [60, 69], [70, 79], [80, 90]
    ];
    
    // Fill each column with 1, 2, or 3 numbers
    for (let col = 0; col < 9; col++) {
      // Decide how many numbers in this column (1, 2, or 3)
      const numberCount = Math.floor(Math.random() * 3) + 1;
      
      // Select which rows will have numbers
      const rowIndices = [0, 1, 2].sort(() => 0.5 - Math.random()).slice(0, numberCount);
      
      // Get the range for this column
      const [min, max] = colRanges[col];
      
      // Generate unique random numbers for this column
      const numbers: number[] = [];
      while (numbers.length < numberCount) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
      
      // Sort numbers in ascending order
      numbers.sort((a, b) => a - b);
      
      // Place numbers in the ticket
      for (let i = 0; i < numberCount; i++) {
        ticket[rowIndices[i]][col] = numbers[i];
      }
    }
    
    return ticket as number[][];
  };

  // Create a new room with settings
  const createRoom = (settings: Partial<RoomSettings>): string => {
    try {
      setGameState("creating");
      const newRoomCode = generateRoomCode();
      
      const newSettings: RoomSettings = {
        roomCode: newRoomCode,
        maxPlayers: settings.maxPlayers || 10,
        ticketPrice: settings.ticketPrice || 0,
        numberCallSpeed: settings.numberCallSpeed || 10,
        winningPatterns: settings.winningPatterns || ['Early Five', 'Top Line', 'Middle Line', 'Bottom Line', 'Full House'],
        autoMarkEnabled: settings.autoMarkEnabled ?? false,
      };
      
      setRoomSettings(newSettings);
      
      // Create a host player
      const hostPlayer: Player = {
        id: `host-${Date.now()}`,
        name: "Host",
        isReady: true,
      };
      
      setCurrentPlayer(hostPlayer);
      setPlayers([hostPlayer]);
      
      // Generate a ticket for the host
      const hostTicket: Ticket = {
        id: `ticket-${Date.now()}`,
        numbers: generateTicket() as any,
        markedNumbers: [],
      };
      
      setTickets([hostTicket]);
      
      // Simulate network delay for creating a room
      setTimeout(() => {
        setGameState("waiting");
        console.log("Room created:", newRoomCode);
        toast.success(`Room created: ${newRoomCode}`);
      }, 1000);
      
      return newRoomCode;
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
      setGameState("idle");
      throw error;
    }
  };

  // Join an existing room
  const joinRoom = (roomCode: string, playerName: string) => {
    try {
      setGameState("joining");
      
      // In a real app, we would validate the room code here
      // For now, we'll just simulate joining a room
      
      // Create demo room settings based on the provided code
      const demoRoomSettings: RoomSettings = {
        roomCode: roomCode,
        maxPlayers: 10,
        ticketPrice: 5,
        numberCallSpeed: 10,
        winningPatterns: ['Early Five', 'Top Line', 'Middle Line', 'Bottom Line', 'Full House'],
        autoMarkEnabled: false,
      };
      
      setRoomSettings(demoRoomSettings);
      
      // Create a player
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: playerName,
        isReady: false,
      };
      
      setCurrentPlayer(newPlayer);
      
      // Add some fake players
      const fakePlayers = [
        { id: 'player-1', name: 'Alice', isReady: true },
        { id: 'player-2', name: 'Bob', isReady: false },
        { id: 'player-3', name: 'Charlie', isReady: true },
      ];
      
      setPlayers([...fakePlayers, newPlayer]);
      
      // Generate a ticket for the player
      const newTicket: Ticket = {
        id: `ticket-${Date.now()}`,
        numbers: generateTicket() as any,
        markedNumbers: [],
      };
      
      setTickets([newTicket]);
      
      // Simulate network delay for joining a room
      setTimeout(() => {
        setGameState("waiting");
        console.log("Joined room:", roomCode);
        toast.success(`Joined room: ${roomCode}`);
      }, 1000);
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error("Failed to join room. Please check the room code and try again.");
      setGameState("idle");
      throw error;
    }
  };

  // Call a random number
  const callNumber = () => {
    if (gameState !== "playing") return;
    
    // Get all possible numbers (1-90)
    const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
    
    // Filter out already called numbers
    const availableNumbers = allNumbers.filter(num => !calledNumbers.includes(num));
    
    if (availableNumbers.length === 0) {
      // Game is over - all numbers have been called
      setGameState("ended");
      toast.info("Game over! All numbers have been called.");
      return;
    }
    
    // Select a random number from available numbers
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newNumber = availableNumbers[randomIndex];
    
    // Update called numbers
    setLastCalledNumber(newNumber);
    setCalledNumbers(prev => [...prev, newNumber]);
    
    // Auto-mark numbers if enabled
    if (roomSettings?.autoMarkEnabled) {
      tickets.forEach(ticket => {
        markNumber(ticket.id, newNumber);
      });
    }
  };

  // Mark a number on a ticket
  const markNumber = (ticketId: string, number: number) => {
    setTickets(prev => 
      prev.map(ticket => {
        if (ticket.id === ticketId && !ticket.markedNumbers.includes(number)) {
          // Check if the number exists on this ticket
          const numberExists = ticket.numbers.some(row => 
            row.some(cell => cell === number)
          );
          
          if (numberExists) {
            return {
              ...ticket,
              markedNumbers: [...ticket.markedNumbers, number],
            };
          }
        }
        return ticket;
      })
    );
  };

  // Claim a winning pattern
  const claimPattern = (pattern: string) => {
    if (!currentPlayer) return;
    
    // In a real app, we would validate the claim here
    // For demo purposes, just add to winners list
    
    const existingClaim = winners.find(
      w => w.pattern === pattern && w.player.id === currentPlayer.id
    );
    
    if (!existingClaim) {
      setWinners(prev => [...prev, { pattern, player: currentPlayer }]);
      toast.success(`Congratulations! You claimed the ${pattern} pattern.`);
    } else {
      toast.error("You've already claimed this pattern!");
    }
  };

  // Leave the current room
  const leaveRoom = () => {
    setGameState("idle");
    setRoomSettings(null);
    setPlayers([]);
    setCurrentPlayer(null);
    setCalledNumbers([]);
    setLastCalledNumber(null);
    setTickets([]);
    setWinners([]);
    toast.info("You left the game room.");
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        roomSettings,
        createRoom,
        joinRoom,
        players,
        currentPlayer,
        calledNumbers,
        callNumber,
        lastCalledNumber,
        tickets,
        markNumber,
        claimPattern,
        winners,
        leaveRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
