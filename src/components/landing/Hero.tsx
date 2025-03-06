import React, { useState, useCallback } from "react";
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
  Share,
  Sparkles,
  UserPlus,
  Users as UsersIcon,
} from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number | null>(null);

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
    hover: { scale: 1.05, rotate: 2, transition: { duration: 0.3 } },
  };

  const numberBallVariants = {
    hover: { rotateY: 360, transition: { duration: 1, repeat: Infinity } },
  };

  // Particle System Setup
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: ["#FFD700", "#FF69B4", "#00CED1"] },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 5, random: true },
      move: {
        enable: true,
        speed: 2,
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

  return (
    <div className="relative overflow-hidden min-h-screen text-white">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500"
        animate={{
          background: [
            "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
            "linear-gradient(135deg, #EC4899 0%, #4F46E5 50%, #7C3AED 100%)",
            "linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #4F46E5 100%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Particle System */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 3D Number Ball */}
          <motion.div
            className="mx-auto mb-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg"
            variants={numberBallVariants}
            whileHover="hover"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span style={{ transform: "translateZ(20px)" }}>42</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg font-[Poppins]"
            variants={itemVariants}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
              Tambola Time!
            </span>
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200"
            variants={itemVariants}
          >
            Join the ultimate Housie party—create rooms, invite friends, and win
            big!
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15}>
              <ButtonCustom
                variant="primary"
                size="lg"
                onClick={() => navigate("/create-room")}
                className="group bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-gray-900 font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-pulse border-2 border-transparent hover:border-yellow-300"
              >
                <Play className="w-5 h-5 mr-2" /> Start Playing
              </ButtonCustom>
            </Tilt>
            <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15}>
              <ButtonCustom
                variant="outline"
                size="lg"
                onClick={() => navigate("/join-room")}
                className="border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-gray-900 font-bold transition-all duration-300 transform hover:-translate-y-2"
              >
                Join a Game
              </ButtonCustom>
            </Tilt>
          </motion.div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-6 mb-12 text-sm md:text-base"
          variants={itemVariants}
        >
          {[
            { icon: Users, label: "1000+ Players" },
            { icon: Trophy, label: "500+ Winners" },
            { icon: Heart, label: "4.9/5 Stars" },
          ].map((stat) => (
            <Tilt key={stat.label} tiltMaxAngleX={10} tiltMaxAngleY={10}>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-md hover:shadow-xl transition-shadow duration-300">
                <stat.icon className="w-5 h-5 text-yellow-300" />
                <span>{stat.label}</span>
              </div>
            </Tilt>
          ))}
        </motion.div>

        {/* How to Play Tambola Section */}
        <motion.section
          className="py-12 px-4 sm:px-6 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 text-yellow-300 font-[Poppins]"
            variants={itemVariants}
          >
            How to Play Tambola 🎉
          </motion.h2>
          <motion.p
            className="text-center text-gray-200 max-w-3xl mx-auto mb-12 text-base sm:text-lg"
            variants={itemVariants}
          >
            Tambola (aka Bingo/Housie) is a fun game of numbers! The host calls
            numbers (1-90), and players mark them on their tickets to win
            exciting prizes.
          </motion.p>

          {/* For Hosts */}
          <motion.div className="mb-12" variants={containerVariants}>
            <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-white">
              For Hosts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Play,
                  title: "1. Start Game",
                  desc: "Create & configure your game room.",
                },
                {
                  icon: Share,
                  title: "2. Share Code",
                  desc: "Invite friends with a unique code.",
                },
                {
                  icon: Sparkles,
                  title: "3. Enjoy Game",
                  desc: "Call numbers & celebrate wins!",
                },
              ].map((step, index) => (
                <Tilt key={step.title} tiltMaxAngleX={10} tiltMaxAngleY={10}>
                  <motion.div
                    variants={itemVariants}
                    whileHover="hover"
                    className="relative bg-white/20 p-6 rounded-xl shadow-lg backdrop-blur-md hover:bg-white/30 transition-all duration-300 border-2 border-transparent hover:border-yellow-300/50"
                    onMouseEnter={() => setActiveStep(index)}
                    onMouseLeave={() => setActiveStep(null)}
                  >
                    <step.icon className="w-12 h-12 mx-auto mb-4 text-yellow-300 animate-pulse" />
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h4>
                    <p className="text-gray-200 text-center">{step.desc}</p>
                    {activeStep === index && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-b-xl"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </motion.div>

          {/* For Participants */}
          <motion.div variants={containerVariants}>
            <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-white">
              For Participants
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Share,
                  title: "1. Enter Code",
                  desc: "Use the invite code to join.",
                },
                {
                  icon: UserPlus,
                  title: "2. Add Name",
                  desc: "Set your player alias.",
                },
                {
                  icon: UsersIcon,
                  title: "3. Play Game",
                  desc: "Mark numbers & win!",
                },
              ].map((step, index) => (
                <Tilt key={step.title} tiltMaxAngleX={10} tiltMaxAngleY={10}>
                  <motion.div
                    variants={itemVariants}
                    whileHover="hover"
                    className="relative bg-white/20 p-6 rounded-xl shadow-lg backdrop-blur-md hover:bg-white/30 transition-all duration-300 border-2 border-transparent hover:border-yellow-300/50"
                    onMouseEnter={() => setActiveStep(index + 3)}
                    onMouseLeave={() => setActiveStep(null)}
                  >
                    <step.icon className="w-12 h-12 mx-auto mb-4 text-yellow-300 animate-pulse" />
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h4>
                    <p className="text-gray-200 text-center">{step.desc}</p>
                    {activeStep === index + 3 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-b-xl"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </motion.div>

          {/* CTA to Start Playing */}
          <motion.div className="mt-12 text-center" variants={itemVariants}>
            <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15}>
              <ButtonCustom
                variant="primary"
                size="lg"
                onClick={() => navigate("/create-room")}
                className="bg-gradient-to-r from-yellow-400 to-pink-500 text-gray-900 font-bold shadow-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:to-pink-600 transition-all duration-300 animate-pulse border-2 border-transparent hover:border-yellow-300"
              >
                Ready to Play? Start Now! 🚀
              </ButtonCustom>
            </Tilt>
          </motion.div>
        </motion.section>

        {/* Floating Play Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 120 }}
        >
          <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15}>
            <ButtonCustom
              variant="primary"
              size="lg"
              onClick={() => navigate("/create-room")}
              className="bg-gradient-to-r from-yellow-400 to-pink-500 text-gray-900 font-bold rounded-full shadow-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:to-pink-600 transition-all duration-300 animate-bounce border-2 border-transparent hover:border-yellow-300"
            >
              Play Now!
            </ButtonCustom>
          </Tilt>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-12 text-center text-sm text-gray-300"
          variants={itemVariants}
        >
          <p>© 2025 Tambola Online. Let the games begin!</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;
