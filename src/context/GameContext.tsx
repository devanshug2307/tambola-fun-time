import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";

export type GameState =
  | "idle"
  | "creating"
  | "joining"
  | "waiting"
  | "playing"
  | "ended"
  | "paused";

interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
}

interface Ticket {
  id: string;
  numbers: (number | null)[][];
  markedNumbers: number[];
}

interface RoomSettings {
  roomCode: string;
  numberCallSpeed: number;
  winningPatterns: string[];
  autoMarkEnabled: boolean;
}

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  roomSettings: RoomSettings | null;
  playerName: string;
  createRoom: (settings: Partial<RoomSettings>) => Promise<string>;
  joinRoom: (roomCode: string, playerName: string) => Promise<void>;
  players: Player[];
  currentPlayer: Player | null;
  calledNumbers: number[];
  callNumber: () => Promise<void>;
  lastCalledNumber: number | null;
  tickets: Ticket[];
  markNumber: (ticketId: string, number: number) => void;
  claimPattern: (pattern: string) => void;
  winners: { pattern: string; player: Player }[];
  leaveRoom: () => void;
  currentPhrase: string;
  leaderboard: { playerName: string; pattern: string }[];
  setLeaderboard: React.Dispatch<
    React.SetStateAction<{ playerName: string; pattern: string }[]>
  >;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  roomUrl: string | null;
  generateClientRoomCode: () => string;
  updateNumberCallSpeed: (speed: number) => void;
}

const defaultContext: GameContextType = {
  gameState: "idle",
  setGameState: () => {},
  roomSettings: null,
  playerName: "",
  createRoom: async () => "",
  joinRoom: async () => {},
  players: [],
  currentPlayer: null,
  calledNumbers: [],
  callNumber: async () => {},
  lastCalledNumber: null,
  tickets: [],
  markNumber: () => {},
  claimPattern: () => {},
  winners: [],
  leaveRoom: () => {},
  currentPhrase: "",
  leaderboard: [],
  setLeaderboard: () => {},
  setPlayers: () => {},
  roomUrl: null,
  generateClientRoomCode: () => "",
  updateNumberCallSpeed: () => {},
};

const GameContext = createContext<GameContextType>(defaultContext);

export const useGameContext = () => useContext(GameContext);

const numberPhrases: { [key: number]: string } = {
  1: "One missed call from mom? You better call back ASAP.",
  2: "Two minutes into work, already waiting for the weekend.",
  3: "Three tabs open, but somehow, you lost the important one.",
  4: "Four spoons of sugar? Who's counting?",
  5: "Five minutes late? Indian Standard Time, bro.",
  6: "Six packs? More like six parathas.",
  7: "Seven thala for a reason",
  8: "Eight hours of work, but somehow, the meeting lasted nine.",
  9: "Nine times out of ten, you forget why you walked into the room.",
  10: "Ten rupees Maggi still tastes better than a fancy dinner.",
  11: "Eleven unread messages—too late to reply now.",
  12: "Twelve missed calls from mom? Your life is in danger.",
  13: "Thirteen episodes in, and you realize it's 3 AM.",
  14: "Fourteen years old, thought you knew everything. LOL.",
  15: "Fifteen minutes into studying, and suddenly, you need a snack.",
  16: "Sixteen GB RAM, still lags. What is this sorcery?",
  17: "Seventeen selfies, and you still don't like any.",
  18: "Eighteen years of waiting to be an adult. Biggest scam ever.",
  19: "Nineteen is when you realize school life was easy.",
  20: "Twenty bucks left in your wallet? Time for financial planning.",
  21: "Twenty-one days to make a habit, but only one day to break it.",
  22: "Twenty-two years old and still waiting for life to make sense.",
  23: "Twenty-three tabs open, but the important one is missing.",
  24: "Twenty-four hours in a day, but where do they go?",
  25: "Twenty-five birthdays later, still confused about taxes.",
  26: "Twenty-six WhatsApp groups, only three are useful.",
  27: "Twenty-seven missed calls? Must be the relatives.",
  28: "Twenty-eight is when back pain becomes real.",
  29: "Twenty-nine unread emails, and counting…",
  30: "Thirty minutes late? It's a talent.",
  31: "Thirty-one flavors of ice cream, always pick chocolate.",
  32: "Thirty-two teeth, but why are they so expensive to fix?",
  33: "Thirty-three open Chrome tabs. Why? Nobody knows.",
  34: "Thirty-four is when you start sleeping before 10 PM.",
  35: "Thirty-five GB of photos, 90% are memes.",
  36: "Thirty-six unread messages in the family group. Ignore.",
  37: "Thirty-seven degrees Celsius? Time to melt.",
  38: "Thirty-eight excuses for skipping gym.",
  39: "Thirty-nine birthdays later, still a kid at heart.",
  40: "Forty seconds of exercise? Good enough.",
  41: "Forty-one times you promised to start dieting.",
  42: "Forty-two notifications? 40 are spam.",
  43: "Forty-three minutes of scrolling, forgot why you picked up the phone.",
  44: "Forty-four days into a diet, and then… biryani happened.",
  45: "Forty-five rupees for chai? Inflation hurts.",
  46: "Forty-six seconds of motivation before procrastination kicks in.",
  47: "Forty-seven decisions made by mom, because you have no choice.",
  48: "Forty-eight minutes on hold with customer service.",
  49: "Forty-nine times you said 'last episode' but kept watching.",
  50: "Fifty rupees for pani puri? But it's unlimited!",
  51: "Fifty-one times you checked your phone, zero messages.",
  52: "Fifty-two weekends in a year, yet no vacation planned.",
  53: "Fifty-three alarms set, still oversleep.",
  54: "Fifty-four arguments about pineapple on pizza.",
  55: "Fifty-five minutes into the movie, and someone asks, 'What's happening?'",
  56: "Fifty-six childhood candies that no longer exist.",
  57: "Fifty-seven seconds of silence after your joke flops.",
  58: "Fifty-eight times you typed a reply and never sent it.",
  59: "Fifty-nine tabs open, 57 are useless.",
  60: "Sixty seconds of workout, followed by two hours of rest.",
  61: "Sixty-one ideas, still no execution.",
  62: "Sixty-two relatives, all asking, 'Shaadi kab kar rahe ho?'",
  63: "Sixty-three rupees left in account, time to survive on Maggi.",
  64: "Sixty-four GB storage, but 'storage almost full' always.",
  65: "Sixty-five YouTube videos later, still no productivity.",
  66: "Sixty-six forwarded messages from that one uncle.",
  67: "Sixty-seven missed gym sessions, still paying the fees.",
  68: "Sixty-eight mosquitoes in one room, all targeting you.",
  69: "Sixty-nine rupees for delivery? Guess I'm cooking today.",
  70: "Seventy childhood dreams, reality crushed 69 of them.",
  71: "Seventy-one childhood crushes, none worked out.",
  72: "Seventy-two chai breaks during work.",
  73: "Seventy-three WiFi resets, still buffering.",
  74: "Seventy-four selfies for one decent profile picture.",
  75: "Seventy-five rupees for popcorn? Might as well buy a farm.",
  76: "Seventy-six password resets because you always forget.",
  77: "Seventy-seven times you said 'I'll sleep early' but didn't.",
  78: "Seventy-eight notifications, only one matters.",
  79: "Seventy-nine years old and still young at heart.",
  80: "Eighty GB data? Still runs out before the month ends.",
  81: "Eighty-one plans made, executed none.",
  82: "Eighty-two reasons to diet, but food is love.",
  83: "Eighty-three mosquito bites, why always me?",
  84: "Eighty-four relatives, each with unwanted life advice.",
  85: "Eighty-five times you looked at your fridge, still nothing new.",
  86: "Eighty-six pending tasks, but let's nap first.",
  87: "Eighty-seven movie recommendations, still watching the same one.",
  88: "Eighty-eight phone chargers, yet never one when needed.",
  89: "Eighty-nine birthday reminders, but you only remember three.",
  90: "Ninety years old? Finally, you can say whatever you want!",
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [roomSettings, setRoomSettings] = useState<RoomSettings | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [winners, setWinners] = useState<{ pattern: string; player: Player }[]>(
    []
  );
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<
    { playerName: string; pattern: string }[]
  >([]);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  const generateTicket = (): (number | null)[][] => {
    const ticket: (number | null)[][] = [
      Array(9).fill(null),
      Array(9).fill(null),
      Array(9).fill(null),
    ];

    const colRanges = [
      [1, 9],
      [10, 19],
      [20, 29],
      [30, 39],
      [40, 49],
      [50, 59],
      [60, 69],
      [70, 79],
      [80, 90],
    ];

    const rowCounts = [0, 0, 0]; // Track numbers filled in each row
    const usedNumbers = new Set<number>(); // Track used numbers

    for (let col = 0; col < 9; col++) {
      const numberCount = Math.floor(Math.random() * 3) + 1;
      const rowIndices = [0, 1, 2]
        .sort(() => 0.5 - Math.random())
        .slice(0, numberCount);
      const [min, max] = colRanges[col];
      const numbers: number[] = [];
      while (numbers.length < numberCount) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numbers.includes(num) && !usedNumbers.has(num)) {
          numbers.push(num);
          usedNumbers.add(num); // Add to used numbers
        }
      }
      numbers.sort((a, b) => a - b);
      for (let i = 0; i < numberCount; i++) {
        if (rowCounts[rowIndices[i]] < 5) {
          // Ensure each row has at most 5 numbers
          ticket[rowIndices[i]][col] = numbers[i];
          rowCounts[rowIndices[i]]++;
        }
      }
    }

    // Ensure each row has exactly 5 numbers
    for (let row = 0; row < 3; row++) {
      while (rowCounts[row] < 5) {
        const col = Math.floor(Math.random() * 9);
        if (ticket[row][col] === null) {
          const [min, max] = colRanges[col];
          let num;
          do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
          } while (usedNumbers.has(num)); // Ensure uniqueness
          ticket[row][col] = num;
          usedNumbers.add(num); // Add to used numbers
          rowCounts[row]++;
        }
      }
    }

    return ticket as (number | null)[][];
  };

  useEffect(() => {
    if (!roomId) return;

    const roomChannel = supabase
      .channel("room-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.new && payload.eventType === "UPDATE") {
            const roomData = payload.new as any;
            setRoomSettings({
              roomCode: roomData.code,
              numberCallSpeed: roomData.number_call_speed,
              winningPatterns: roomData.winning_patterns || [],
              autoMarkEnabled: roomData.auto_mark_enabled,
            });

            if (roomData.status === "playing" && gameState !== "playing") {
              setGameState("playing");
            } else if (roomData.status === "ended" && gameState !== "ended") {
              setGameState("ended");
            }
          }
        }
      )
      .subscribe();

    const playersChannel = supabase
      .channel("players-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const { data: playerData, error } = await supabase
            .from("players")
            .select("*")
            .eq("room_id", roomId);

          if (error) {
            return;
          }

          if (playerData) {
            const formattedPlayers = playerData.map((p) => ({
              id: p.id,
              name: p.name,
              isReady: p.is_ready,
              isHost: p.is_host !== undefined ? p.is_host : false,
            }));
            setPlayers(formattedPlayers);
          }
        }
      )
      .subscribe();

    const calledNumbersChannel = supabase
      .channel("called-numbers-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "called_numbers",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const { data: numbersData, error } = await supabase
            .from("called_numbers")
            .select("number")
            .eq("room_id", roomId)
            .order("called_at", { ascending: true });

          if (error) {
            return;
          }

          if (numbersData) {
            const numbers = numbersData.map((n) => n.number);
            setCalledNumbers(numbers);
            if (numbers.length > 0) {
              setLastCalledNumber(numbers[numbers.length - 1]);
            }

            // Fix for auto-marking - only if enabled
            if (roomSettings?.autoMarkEnabled && payload.new) {
              const latestNumber = payload.new.number;

              // Only auto-mark tickets that belong to the current player
              if (playerId) {
                tickets.forEach((ticket) => {
                  // Check if the number exists on this ticket before marking
                  const numberExists = ticket.numbers.some((row) =>
                    row.some((cell) => cell === latestNumber)
                  );

                  if (numberExists) {
                    markNumber(ticket.id, latestNumber);
                  }
                });
              }
            }
          }
        }
      )
      .subscribe();
    const winnersChannel = supabase
      .channel("winners-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "winners",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const { data: winnerData, error } = await supabase
            .from("winners")
            .select(
              `
              id,
              pattern,
              player_id,
              players (
                id,
                name,
                is_ready
              )
            `
            )
            .eq("room_id", roomId);

          if (error) {
            return;
          }

          if (winnerData) {
            const formattedWinners = winnerData.map((w) => ({
              pattern: w.pattern,
              player: {
                id: w.players.id,
                name: w.players.name,
                isReady: w.players.is_ready,
                isHost: false,
              },
            }));
            setWinners(formattedWinners);

            // Update the leaderboard
            const newLeaderboard = winnerData.map((w) => ({
              playerName: w.players.name,
              pattern: w.pattern,
            }));
            setLeaderboard(newLeaderboard);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(calledNumbersChannel);
      supabase.removeChannel(winnersChannel);
    };
  }, [roomId, roomSettings?.autoMarkEnabled]);

  const createRoom = async (
    settings: Partial<RoomSettings>
  ): Promise<string> => {
    try {
      setGameState("creating");

      const hostId = crypto.randomUUID();

      const winningPatterns = settings.winningPatterns || [
        "Early Five",
        "Top Line",
        "Middle Line",
        "Bottom Line",
        "Full House",
      ];

      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .insert({
          code: settings.roomCode || (await getUniqueRoomCode()),
          host_name: "Host",
          host_id: hostId,
          number_call_speed: settings.numberCallSpeed || 7,
          auto_mark_enabled: settings.autoMarkEnabled ?? false,
          winning_patterns: winningPatterns as unknown as Json,
          status: "waiting",
        })
        .select()
        .single();

      if (roomError) {
        setGameState("idle");
        toast.error("Failed to create room. Please try again.");
        throw roomError;
      }

      setRoomId(roomData.id);
      setRoomSettings({
        roomCode: roomData.code,
        numberCallSpeed: roomData.number_call_speed,
        winningPatterns: Array.isArray(roomData.winning_patterns)
          ? (roomData.winning_patterns as string[])
          : [],
        autoMarkEnabled: roomData.auto_mark_enabled,
      });

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .insert({
          room_id: roomData.id,
          name: "Host",
          is_host: true,
          is_ready: true,
        })
        .select()
        .single();

      if (playerError) {
        setGameState("idle");
        toast.error("Failed to create room. Please try again.");
        throw playerError;
      }

      setPlayerId(playerData.id);
      setCurrentPlayer({
        id: playerData.id,
        name: playerData.name,
        isReady: playerData.is_ready,
        isHost: true,
      });

      const ticketNumbers = generateTicket();
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .insert({
          player_id: playerData.id,
          room_id: roomData.id,
          numbers: ticketNumbers as unknown as Json,
          marked_numbers: [] as unknown as Json,
        })
        .select()
        .single();

      if (ticketError) {
        console.error("Error adding ticket:", ticketError);
      } else {
        setTickets([
          {
            id: ticketData.id,
            numbers: ticketData.numbers as unknown as (number | null)[][],
            markedNumbers: [],
          },
        ]);
      }

      setPlayers([
        {
          id: playerData.id,
          name: playerData.name,
          isReady: playerData.is_ready,
          isHost: true,
        },
      ]);

      setGameState("waiting");
      toast.success(`Room created: ${roomData.code}`);

      const roomUrl = `http://yourgameurl.com/join/${roomData.code}`;
      setRoomUrl(roomUrl);

      return roomData.code;
    } catch (error) {
      toast.error("Failed to create room. Please try again.");
      setGameState("idle");
      throw error;
    }
  };

  const getUniqueRoomCode = async (): Promise<string> => {
    const { data, error } = await supabase.rpc("generate_room_code");

    if (error) {
      return generateClientRoomCode();
    }

    return data;
  };

  const generateClientRoomCode = (): string => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const joinRoom = async (
    roomCode: string,
    playerName: string
  ): Promise<void> => {
    try {
      setGameState("joining");

      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select()
        .eq("code", roomCode.toUpperCase())
        .single();

      if (roomError) {
        setGameState("idle");
        toast.error(
          "Room not found. Please check the room code and try again."
        );
        throw new Error("Room not found");
      }

      setRoomId(roomData.id);
      setRoomSettings({
        roomCode: roomData.code,
        numberCallSpeed: roomData.number_call_speed,
        winningPatterns: Array.isArray(roomData.winning_patterns)
          ? (roomData.winning_patterns as string[])
          : [],
        autoMarkEnabled: roomData.auto_mark_enabled,
      });

      const { count, error: countError } = await supabase
        .from("players")
        .select("*", { count: "exact", head: true })
        .eq("room_id", roomData.id);

      if (countError) {
        console.error("Error counting players:", countError);
      } else if (count && count >= roomData.max_players) {
        setGameState("idle");
        toast.error("This room is full. Please try another room.");
        throw new Error("Room is full");
      }

      const { data: existingPlayer, error: playerCheckError } = await supabase
        .from("players")
        .select()
        .eq("room_id", roomData.id)
        .eq("name", playerName)
        .maybeSingle();

      if (playerCheckError) {
        console.error("Error checking player name:", playerCheckError);
      } else if (existingPlayer) {
        setGameState("idle");
        toast.error(
          "This name is already taken in this room. Please choose another name."
        );
        throw new Error("Player name taken");
      }

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .insert({
          room_id: roomData.id,
          name: playerName,
          is_host: false,
          is_ready: false,
        })
        .select()
        .single();

      if (playerError) {
        setGameState("idle");
        toast.error("Failed to join room. Please try again.");
        throw playerError;
      }

      setPlayerId(playerData.id);
      setCurrentPlayer({
        id: playerData.id,
        name: playerData.name,
        isReady: playerData.is_ready,
        isHost: false,
      });

      const ticketNumbers = generateTicket();
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .insert({
          player_id: playerData.id,
          room_id: roomData.id,
          numbers: ticketNumbers as unknown as Json,
          marked_numbers: [] as unknown as Json,
        })
        .select()
        .single();

      if (ticketError) {
        console.error("Error adding ticket:", ticketError);
      } else {
        setTickets([
          {
            id: ticketData.id,
            numbers: ticketData.numbers as unknown as (number | null)[][],
            markedNumbers: [],
          },
        ]);
      }

      const { data: allPlayers, error: playersError } = await supabase
        .from("players")
        .select()
        .eq("room_id", roomData.id);

      if (playersError) {
        console.error("Error fetching players:", playersError);
      } else {
        setPlayers(
          allPlayers.map((p) => ({
            id: p.id,
            name: p.name,
            isReady: p.is_ready,
            isHost: false,
          }))
        );
      }

      if (roomData.status === "playing") {
        const { data: calledNumbersData, error: numbersError } = await supabase
          .from("called_numbers")
          .select("number")
          .eq("room_id", roomData.id)
          .order("called_at", { ascending: true });

        if (numbersError) {
          console.error("Error fetching called numbers:", numbersError);
        } else if (calledNumbersData && calledNumbersData.length > 0) {
          const numbers = calledNumbersData.map((n) => n.number);
          setCalledNumbers(numbers);
          setLastCalledNumber(numbers[numbers.length - 1]);
        }

        setGameState("playing");
      } else {
        setGameState("waiting");
      }

      toast.success(`Joined room: ${roomData.code}`);
    } catch (error) {
      console.error("Error joining room:", error);
      setGameState("idle");
      throw error;
    }
  };

  const speakPhrase = (phrase: string) => {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.pitch = 1.2; // Slightly higher pitch for a more lively tone
    utterance.rate = 0.9; // Slightly slower rate for clarity
    utterance.volume = 1; // Full volume
    window.speechSynthesis.speak(utterance);
  };

  const callNumber = async (): Promise<void> => {
    if (gameState !== "playing" || !roomId || currentPlayer?.isReady === false)
      return;

    try {
      console.log("Calling a number...");

      // First, get all currently called numbers from the database to ensure we have the most up-to-date list
      const { data: currentCalledNumbers, error: fetchError } = await supabase
        .from("called_numbers")
        .select("number")
        .eq("room_id", roomId);

      if (fetchError) {
        console.error("Error fetching current called numbers:", fetchError);
        toast.error("Failed to call number. Please try again.");
        return;
      }

      // Extract just the numbers from the result
      const dbCalledNumbers = currentCalledNumbers.map((item) => item.number);

      // Create a set of all called numbers (combining local state and database)
      const allCalledNumbersSet = new Set([
        ...calledNumbers,
        ...dbCalledNumbers,
      ]);

      // Get available numbers (numbers 1-90 that haven't been called yet)
      const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
      const availableNumbers = allNumbers.filter(
        (num) => !allCalledNumbersSet.has(num)
      );

      if (availableNumbers.length === 0) {
        await supabase
          .from("rooms")
          .update({ status: "ended" })
          .eq("id", roomId);

        setGameState("ended");
        toast.info("Game over! All numbers have been called.");
        return;
      }

      // Get a random number from the available numbers
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const newNumber = availableNumbers[randomIndex];

      console.log(`Selected number: ${newNumber}`);

      // Display the corresponding phrase
      const phrase = numberPhrases[newNumber];
      console.log(`Phrase for number ${newNumber}: ${phrase}`);
      setCurrentPhrase(phrase);
      speakPhrase(phrase);

      // Try to insert the new called number
      const { error } = await supabase.from("called_numbers").insert({
        room_id: roomId,
        number: newNumber,
      });

      if (error) {
        // If there's still a constraint error, it was likely called in another session
        // We'll just log it and not show an error to the user
        console.error("Error calling number:", error);
        return;
      }

      // Update local state
      setLastCalledNumber(newNumber);
      setCalledNumbers((prev) => Array.from(new Set([...prev, newNumber])));
    } catch (error) {
      console.error("Error calling number:", error);
      toast.error("Failed to call number. Please try again.");
    }
  };

  const markNumber = async (ticketId: string, number: number) => {
    try {
      setTickets((prev) =>
        prev.map((ticket) => {
          if (
            ticket.id === ticketId &&
            !ticket.markedNumbers.includes(number)
          ) {
            const numberExists = ticket.numbers.some((row) =>
              row.some((cell) => cell === number)
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

      if (ticketId && playerId && roomId) {
        const { data, error } = await supabase
          .from("tickets")
          .select("marked_numbers")
          .eq("id", ticketId)
          .single();

        if (error) {
          console.error("Error fetching ticket:", error);
          return;
        }

        const currentMarkedNumbers: number[] = Array.isArray(
          data.marked_numbers
        )
          ? (data.marked_numbers as number[])
          : [];

        const markedNumbers = [...currentMarkedNumbers, number].filter(
          (v, i, a) => a.indexOf(v) === i
        );

        await supabase
          .from("tickets")
          .update({ marked_numbers: markedNumbers as unknown as Json })
          .eq("id", ticketId);
      }
    } catch (error) {
      console.error("Error marking number:", error);
    }
  };
  const claimPattern = async (pattern: string) => {
    if (!currentPlayer || !roomId || !playerId) return;

    try {
      const existingClaim = winners.find(
        (w) => w.pattern === pattern && w.player.id === currentPlayer.id
      );

      if (existingClaim) {
        toast.error("You've already claimed this pattern!");
        return;
      }

      // Get the player's ticket
      const playerTicket = tickets[0]; // Assuming one ticket per player
      if (!playerTicket) {
        toast.error("No ticket found.");
        return;
      }

      const { error } = await supabase.from("winners").insert({
        room_id: roomId,
        player_id: playerId,
        pattern: pattern,
      });

      if (error) {
        console.error("Error claiming pattern:", error);
        toast.error("Failed to claim pattern. Please try again.");
        return;
      }

      // Update winners and leaderboard globally
      const newWinner = { pattern, player: currentPlayer };
      setWinners((prev) => [...prev, newWinner]);
      setLeaderboard((prev) => [
        ...prev,
        { playerName: currentPlayer.name, pattern },
      ]);

      // Broadcast the new winner to all clients
      await supabase
        .from("winners")
        .update({ broadcast: true })
        .eq("room_id", roomId);

      toast.success(`Congratulations! You claimed the ${pattern} pattern.`);
    } catch (error) {
      console.error("Error claiming pattern:", error);
      toast.error("Failed to claim pattern. Please try again.");
    }
  };

  const startGame = async () => {
    if (!roomId) return;

    try {
      const { error } = await supabase
        .from("rooms")
        .update({ status: "playing" })
        .eq("id", roomId);

      if (error) {
        console.error("Error starting game:", error);
        toast.error("Failed to start game. Please try again.");
        return;
      }

      setGameState("playing");
    } catch (error) {
      console.error("Error starting game:", error);
      toast.error("Failed to start game. Please try again.");
    }
  };

  const leaveRoom = async () => {
    if (roomId && playerId) {
      try {
        await supabase.from("players").delete().eq("id", playerId);

        if (currentPlayer?.isReady && players.length <= 1) {
          await supabase.from("rooms").delete().eq("id", roomId);
        }
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    }

    setGameState("idle");
    setRoomSettings(null);
    setRoomId(null);
    setPlayerId(null);
    setPlayers([]);
    setCurrentPlayer(null);
    setCalledNumbers([]);
    setLastCalledNumber(null);
    setTickets([]);
    setWinners([]);
    toast.info("You left the game room.");
  };

  const updateNumberCallSpeed = (speed: number) => {
    if (roomSettings) {
      setRoomSettings((prev) => ({
        ...prev,
        numberCallSpeed: speed,
      }));
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        roomSettings,
        playerName,
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
        currentPhrase,
        leaderboard,
        setLeaderboard,
        setPlayers,
        roomUrl,
        generateClientRoomCode,
        updateNumberCallSpeed,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
