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
  | "ended";

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
}

const defaultContext: GameContextType = {
  gameState: "idle",
  setGameState: () => {},
  roomSettings: null,
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
};

const GameContext = createContext<GameContextType>(defaultContext);

export const useGameContext = () => useContext(GameContext);

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
        ticket[rowIndices[i]][col] = numbers[i];
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

  const callNumber = async (): Promise<void> => {
    if (gameState !== "playing" || !roomId) return;

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
