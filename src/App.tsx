import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import Index from "./pages/Index";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
import JoinRoomRedirect from "./pages/JoinRoomRedirect";
import HowToPlay from "@/pages/HowToPlay";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/join/:roomCode" element={<JoinRoom />} />
            <Route path="/join-room" element={<JoinRoomRedirect />} />
            <Route path="/game" element={<Game />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
