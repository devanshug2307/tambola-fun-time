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
};

const GameContext = createContext<GameContextType>(defaultContext);

export const useGameContext = () => useContext(GameContext);

const numberPhrases: { [key: number]: string } = {
  1: "One and only – The beginning!",
  2: "Two's company – A perfect pair.",
  3: "Three Musketeers – All for one, one for all!",
  4: "Four-leaf clover – A symbol of luck.",
  5: "Five fingers – On one hand.",
  6: "Half a dozen – Six in a set.",
  7: "Lucky seven – Considered lucky worldwide.",
  8: "Eight-legged freak – Like a spider!",
  9: "Cloud nine – Feeling happy and high.",
  10: "Perfect ten – A flawless score.",
  11: "Make a wish – 11:11 magic.",
  12: "Dozen – 12 eggs in a tray.",
  13: "Unlucky for some – 13 is often feared!",
  14: "Valentine's Day – February 14.",
  15: "Teenager – Starts from 15.",
  16: "Sweet sixteen – A special birthday.",
  17: "Dancing Queen – ABBA song: 'Young and sweet, only 17.'",
  18: "Adult now – Age of majority in some countries.",
  19: "Last teen – 19 is the final teenage year.",
  20: "Two dozen minus four – 20.",
  21: "Key to the door – 21 signifies adulthood.",
  22: "Catch-22 – A famous paradox.",
  23: "Michael Jordan – Jersey number 23.",
  24: "24 hours – A full day.",
  25: "Quarter century – 25 years.",
  26: "Republic Day – Celebrated on 26th January in India.",
  27: "27 Club – Celebrities who died at 27.",
  28: "February's max days – 28 days in non-leap years.",
  29: "Leap year special – 29 appears once in four years.",
  30: "Dirty thirty – Entering a new decade!",
  31: "31 flavors – Baskin Robbins' ice cream varieties.",
  32: "Chessboard squares – 32 black, 32 white.",
  33: "Jesus' age – When he was crucified.",
  34: "Cricket's highest over – 34 runs in an over (record).",
  35: "Mid-thirties – A milestone age.",
  36: "Three dozen – 36.",
  37: "Prime number – 37 is indivisible except by 1 and itself.",
  38: "Jackpot number – Found in many lotteries.",
  39: "Steps to success – 39 steps, a Hitchcock film.",
  40: "Life begins – 'Life begins at 40!'",
  41: "Come after 40 – Just like that!",
  42: "Answer to everything – Hitchhiker's Guide to the Galaxy.",
  43: "George W. Bush – 43rd US President.",
  44: "Double trouble – 44.",
  45: "Trump was 45th US President – A political fact.",
  46: "Less than half-century – 46 is just shy of 50.",
  47: "AK-47 – Famous firearm.",
  48: "Two dozen pairs – 48 items.",
  49: "Steps to success – 49 steps!",
  50: "Half-century – In cricket and life.",
  51: "Area 51 – Mysterious US base.",
  52: "Deck of cards – 52 playing cards.",
  53: "Prime again – Another prime number.",
  54: "Deck + 2 Jokers – A complete playing deck.",
  55: "Speed limit – 55 mph common in many places.",
  56: "Heinz varieties – 57 kinds of ketchup.",
  57: "Old is gold – Nearing retirement age.",
  58: "Atomic number of Cerium – Fun chemistry fact.",
  59: "One short of 60 – A near milestone.",
  60: "Full hour – 60 minutes.",
  61: "Age for retirement – Many retire at 61.",
  62: "62 seconds of fame – Almost a minute.",
  63: "Old but gold – Vintage vibes.",
  64: "64-bit computing – High-tech reference.",
  65: "Senior citizen – Official in many countries.",
  66: "Route 66 – Famous highway.",
  67: "Beyond retirement – 67 and going strong.",
  68: "Just before 69 – Almost there!",
  69: "A number to smile at – No explanation needed!",
  70: "Life starts anew – 70 is a new beginning.",
  71: "Prime once again – 71 is a prime.",
  72: "Par for golf – 72 strokes for a course.",
  73: "Sheldon's favorite number – From Big Bang Theory.",
  74: "One short of 75 – Almost three-quarters of a century.",
  75: "Diamond Jubilee – 75-year celebration.",
  76: "Spirit of 76 – American independence.",
  77: "Double seven – Lucky number in casinos.",
  78: "End of 70s – Time flies.",
  79: "Last prime before 80 – A cool math fact.",
  80: "End of an era – Entering the 80s.",
  81: "9 squared – 81 = 9×9.",
  82: "Beyond 80 – Living strong.",
  83: "Prime yet again – 83 is prime.",
  84: "Dozen sevens – 84 is 7×12.",
  85: "Mid-80s nostalgia – 1985 vibes.",
  86: "Radio slang for 'goodbye' – '86 that!'",
  87: "Late 80s – Almost at the finish line.",
  88: "Two fat ladies – Classic Tambola call.",
  89: "Penultimate prime – Before 90.",
  90: "Top of the house – Last number in Tambola.",
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

    for (let col = 0; col < 9; col++) {
      const numberCount = Math.floor(Math.random() * 3) + 1;
      const rowIndices = [0, 1, 2]
        .sort(() => 0.5 - Math.random())
        .slice(0, numberCount);
      const [min, max] = colRanges[col];
      const numbers: number[] = [];
      while (numbers.length < numberCount) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numbers.includes(num)) {
          numbers.push(num);
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
          const num = Math.floor(Math.random() * (max - min + 1)) + min;
          ticket[row][col] = num;
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
          console.log("Room updated:", payload);
          if (payload.new && payload.eventType === "UPDATE") {
            const roomData = payload.new as any;
            setRoomSettings({
              roomCode: roomData.code,
              maxPlayers: roomData.max_players,
              ticketPrice: roomData.ticket_price,
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
          console.log("Player event:", payload);

          const { data: playerData, error } = await supabase
            .from("players")
            .select("*")
            .eq("room_id", roomId);

          if (error) {
            console.error("Error fetching players:", error);
            return;
          }

          if (playerData) {
            const formattedPlayers = playerData.map((p) => ({
              id: p.id,
              name: p.name,
              isReady: p.is_ready,
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
          console.log("New number called:", payload);

          const { data: numbersData, error } = await supabase
            .from("called_numbers")
            .select("number")
            .eq("room_id", roomId)
            .order("called_at", { ascending: true });

          if (error) {
            console.error("Error fetching called numbers:", error);
            return;
          }

          if (numbersData) {
            const numbers = numbersData.map((n) => n.number);
            setCalledNumbers(numbers);
            if (numbers.length > 0) {
              setLastCalledNumber(numbers[numbers.length - 1]);
            }

            if (roomSettings?.autoMarkEnabled) {
              const latestNumber = payload.new.number;
              tickets.forEach((ticket) => {
                markNumber(ticket.id, latestNumber);
              });
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
          event: "INSERT",
          schema: "public",
          table: "winners",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          console.log("New winner:", payload);

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
            console.error("Error fetching winners:", error);
            return;
          }

          if (winnerData) {
            const formattedWinners = winnerData.map((w) => ({
              pattern: w.pattern,
              player: {
                id: w.players.id,
                name: w.players.name,
                isReady: w.players.is_ready,
              },
            }));
            setWinners(formattedWinners);
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
          max_players: settings.maxPlayers || 10,
          ticket_price: settings.ticketPrice || 5,
          number_call_speed: settings.numberCallSpeed || 10,
          auto_mark_enabled: settings.autoMarkEnabled ?? false,
          winning_patterns: winningPatterns as unknown as Json,
          status: "waiting",
        })
        .select()
        .single();

      if (roomError) {
        console.error("Error creating room:", roomError);
        setGameState("idle");
        toast.error("Failed to create room. Please try again.");
        throw roomError;
      }

      setRoomId(roomData.id);
      setRoomSettings({
        roomCode: roomData.code,
        maxPlayers: roomData.max_players,
        ticketPrice: roomData.ticket_price,
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
        console.error("Error adding host player:", playerError);
        setGameState("idle");
        toast.error("Failed to create room. Please try again.");
        throw playerError;
      }

      setPlayerId(playerData.id);
      setCurrentPlayer({
        id: playerData.id,
        name: playerData.name,
        isReady: playerData.is_ready,
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
        },
      ]);

      setGameState("waiting");
      toast.success(`Room created: ${roomData.code}`);

      return roomData.code;
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
      setGameState("idle");
      throw error;
    }
  };

  const getUniqueRoomCode = async (): Promise<string> => {
    const { data, error } = await supabase.rpc("generate_room_code");

    if (error) {
      console.error("Error generating room code:", error);
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
        console.error("Error finding room:", roomError);
        setGameState("idle");
        toast.error(
          "Room not found. Please check the room code and try again."
        );
        throw new Error("Room not found");
      }

      setRoomId(roomData.id);
      setRoomSettings({
        roomCode: roomData.code,
        maxPlayers: roomData.max_players,
        ticketPrice: roomData.ticket_price,
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
        console.error("Error adding player:", playerError);
        setGameState("idle");
        toast.error("Failed to join room. Please try again.");
        throw playerError;
      }

      setPlayerId(playerData.id);
      setCurrentPlayer({
        id: playerData.id,
        name: playerData.name,
        isReady: playerData.is_ready,
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
    window.speechSynthesis.speak(utterance);
  };

  const callNumber = async (): Promise<void> => {
    if (gameState !== "playing" || !roomId || currentPlayer?.isReady === false)
      return;

    try {
      console.log("Calling a number...");
      const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
      const availableNumbers = allNumbers.filter(
        (num) => !calledNumbers.includes(num)
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

      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const newNumber = availableNumbers[randomIndex];

      console.log(`Selected number: ${newNumber}`);

      // Display the corresponding phrase
      const phrase = numberPhrases[newNumber];
      console.log(`Phrase for number ${newNumber}: ${phrase}`);
      setCurrentPhrase(phrase);
      speakPhrase(phrase);

      const { error } = await supabase.from("called_numbers").insert({
        room_id: roomId,
        number: newNumber,
      });

      if (error) {
        console.error("Error calling number:", error);
        toast.error("Failed to call number. Please try again.");
        return;
      }

      setLastCalledNumber(newNumber);
      setCalledNumbers((prev) => [...prev, newNumber]);

      // Mark the number on all tickets
      tickets.forEach((ticket) => {
        markNumber(ticket.id, newNumber);
      });

      toast.success(`Number called: ${newNumber}`);
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

      setWinners((prev) => [...prev, { pattern, player: currentPlayer }]);
      setLeaderboard((prev) => [
        ...prev,
        { playerName: currentPlayer.name, pattern },
      ]);
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
