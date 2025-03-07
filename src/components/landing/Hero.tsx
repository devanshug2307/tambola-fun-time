import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { ButtonCustom } from "@/components/ui/button-custom";
import {
  Users,
  Trophy,
  Heart,
  Play,
  Upload,
  Award,
  Crown,
  Star,
  Gift,
  HelpCircle,
  ArrowRight,
  Volume2,
  VolumeX,
} from "lucide-react";

// Import the sound file
import tambolaSound from "../../assets/sounds/Tambola Time.mp3";
import { useGameContext } from "@/context/GameContext";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { generateClientRoomCode } = useGameContext();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioInitialized, setAudioInitialized] = useState<boolean>(false);
  const [randomNumber, setRandomNumber] = useState<number>(42);
  const [showTooltip, setShowTooltip] = useState(false);
  const [roomCode, setRoomCode] = useState<string>("");

  // Initialize audio only once
  useEffect(() => {
    if (audioInitialized) return;

    // Create audio element only once
    if (!audioRef.current) {
      audioRef.current = new Audio(tambolaSound);

      // Set up event listeners
      const audio = audioRef.current;

      const handlePlay = () => {
        console.log("Audio played");
        setIsPlaying(true);
      };

      const handlePause = () => {
        console.log("Audio paused");
        setIsPlaying(false);
      };

      const handleEnded = () => {
        console.log("Audio ended");
        setIsPlaying(false);
      };

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);

      // Try to autoplay once
      audio.currentTime = 13;
      audio.play().catch((error) => {
        console.error("Autoplay failed:", error);
      });

      setAudioInitialized(true);
    }

    return () => {
      // Clean up only when component unmounts
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;

        // Remove event listeners
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, [audioInitialized]);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log("Toggle sound called, current state:", isPlaying);

    if (isPlaying) {
      console.log("Pausing audio");
      audio.pause();
    } else {
      console.log("Playing audio");
      audio.currentTime = 13;
      audio.play().catch((error) => {
        console.error("Play failed:", error);
      });
    }
  };

  useEffect(() => {
    // Generate a room code when component mounts
    const generatedRoomCode = generateClientRoomCode();
    setRoomCode(generatedRoomCode);

    // Random number generation every second
    const intervalId = setInterval(() => {
      setRandomNumber(Math.floor(Math.random() * 90) + 1);
    }, 1000);

    // Show tooltip briefly after component loads
    setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [generateClientRoomCode]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const ballVariants = {
    initial: { scale: 0.8, rotate: 0 },
    animate: {
      scale: [0.8, 1, 0.8],
      rotate: [0, 10, -10, 0],
      transition: {
        scale: { repeat: Infinity, duration: 3, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: 5, ease: "easeInOut" },
      },
    },
  };

  const numberVariants = {
    initial: { scale: 1, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  };

  // Particle System Setup
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    particles: {
      number: { value: 30, density: { enable: true, value_area: 800 } },
      color: { value: ["#8a56ff", "#d46ef9", "#f680ff"] },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: 4, random: true },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 },
      },
    },
  };

  const featureItems = [
    {
      icon: Play,
      title: "Create a Game",
      description: "Customize rooms with unique rules and exciting prizes.",
    },
    {
      icon: Upload,
      title: "Invite Players",
      description: "Share room codes, connect with friends instantly.",
    },
    {
      icon: Trophy,
      title: "Win Together",
      description: "Experience the joy of collective triumph and excitement.",
    },
  ];

  const premiumFeatures = [
    {
      icon: Crown,
      title: "Premium Experience",
      description: "Immersive design, smooth animations, intuitive interface.",
    },
    {
      icon: Star,
      title: "Multiple Game Modes",
      description: "Explore exciting patterns from Early 5 to Full House!",
    },
    {
      icon: Gift,
      title: "Special Events",
      description: "Exclusive tournaments with amazing rewards await!",
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen text-gray-800 bg-gradient-to-b from-purple-50 to-pink-100">
      {/* Particle System */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 flex flex-col items-center">
        {/* Audio Control Button - Moved to bottom left */}
        <motion.div
          className="fixed bottom-6 left-6 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative rounded-full shadow-lg cursor-pointer overflow-hidden flex items-center justify-center w-10 h-10 transition-all duration-300 ${
              isPlaying
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-gray-200"
            }`}
            onClick={toggleSound}
          >
            {/* Background pulse animation when playing */}
            {isPlaying && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-70"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Icon */}
            <motion.div
              className="relative z-10"
              animate={{
                rotate: isPlaying ? [0, 5, -5, 0] : 0,
                scale: isPlaying ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: isPlaying ? 2 : 0.3,
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              {isPlaying ? (
                <Volume2 className="w-4 h-4 text-white" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-600" />
              )}
            </motion.div>

            {/* Tooltip */}
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow-md text-xs whitespace-nowrap"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "none", opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {isPlaying ? "Mute sound" : "Play sound"}
            </motion.div>
          </motion.div>

          {/* Sound wave animation */}
          {isPlaying && (
            <motion.div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 h-1 bg-purple-500 rounded-full"
                    animate={{
                      height: ["3px", `${3 + i * 2}px`, "3px"],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Ball with Random Number */}
        <motion.div
          className="mb-8 relative"
          initial="initial"
          animate="animate"
          variants={ballVariants}
        >
          <div className="relative w-32 h-32">
            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-30 blur-md"></div>

            {/* Ball */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"></div>

            {/* Inner light reflection */}
            <div className="absolute top-1 left-3 w-8 h-3 bg-white opacity-40 rounded-full"></div>

            {/* Number */}
            <AnimatePresence mode="wait">
              <motion.div
                key={randomNumber}
                className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={numberVariants}
              >
                {randomNumber}
              </motion.div>
            </AnimatePresence>

            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-white rounded-lg shadow-md text-sm text-gray-700 w-48 text-center"
                >
                  Tambola numbers are called one by one!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          className="text-center mb-16 max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 font-[Poppins]"
            variants={itemVariants}
          >
            Tambola
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl mb-10 text-gray-700 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Revolutionize game nights with our next-generation Housie
            experience. Create epic rooms, invite your squad, and turn every
            moment into a celebration of wins!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
              <ButtonCustom
                variant="primary"
                size="lg"
                onClick={() => navigate(`/create-room?roomCode=${roomCode}`)}
                className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300 flex items-center"
              >
                Create Room
                <motion.span
                  initial={{ x: 0, opacity: 0.5 }}
                  animate={{ x: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.span>
              </ButtonCustom>
            </Tilt>

            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
              <ButtonCustom
                variant="outline"
                size="lg"
                onClick={() => navigate("/join-room")}
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white font-medium py-3 px-8 rounded-full transition-all duration-300"
              >
                Join Room
              </ButtonCustom>
            </Tilt>
          </motion.div>

          {/* How to Play button */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/how-to-play")}
            className="flex items-center justify-center mx-auto text-purple-600 hover:text-purple-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">New to Tambola? Learn how to play</span>
          </motion.button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-16"
          variants={itemVariants}
        >
          {[
            { icon: Users, label: "1000+ Active Players" },
            { icon: Trophy, label: "500+ Winners" },
            { icon: Heart, label: "4.9/5 Rating" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover="hover"
              className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm"
            >
              <stat.icon className="w-5 h-5 text-purple-600" />
              <span className="text-purple-800">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.section
          className="w-full max-w-6xl mx-auto mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureItems.map((feature, index) => (
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} key={feature.title}>
                <motion.div
                  variants={itemVariants}
                  whileHover="hover"
                  className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm flex flex-col items-center text-center h-full"
                  style={{
                    background:
                      index === 0
                        ? "rgba(230, 240, 255, 0.8)"
                        : index === 1
                        ? "rgba(230, 255, 240, 0.8)"
                        : "rgba(255, 230, 250, 0.8)",
                  }}
                >
                  <div className="bg-purple-100 p-4 rounded-full mb-4">
                    <feature.icon className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </motion.section>

        {/* Premium Features */}
        <motion.section
          className="w-full max-w-6xl mx-auto mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} key={feature.title}>
                <motion.div
                  variants={itemVariants}
                  whileHover="hover"
                  className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm flex flex-col items-center text-center h-full"
                >
                  <div className="bg-purple-100 p-4 rounded-full mb-4">
                    <feature.icon className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </motion.section>

        {/* Quick action button */}
        <motion.div
          className="fixed bottom-6 right-6 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 120 }}
        >
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
            <ButtonCustom
              variant="primary"
              size="lg"
              onClick={() => navigate(`/create-room?roomCode=${roomCode}`)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full shadow-xl flex items-center justify-center w-16 h-16 hover:scale-110 transition-all duration-300"
            >
              <Play className="w-8 h-8" />
            </ButtonCustom>
          </Tilt>
          <div className="absolute -top-8 right-0 bg-white px-3 py-1 rounded-full text-xs text-purple-700 shadow-sm">
            Play Now
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-12 text-center text-sm text-gray-500"
          variants={itemVariants}
        >
          <p>© 2025 Tambola Online. Let the games begin!</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;
