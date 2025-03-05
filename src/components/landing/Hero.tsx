
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Trophy, Dice, Play, Home } from "lucide-react";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  const rotateVariants = {
    initial: { rotate: 0 },
    rotate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -100, y: -100 }}
          animate={{ opacity: 0.6, x: -50, y: -50 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 0.6, x: 50, y: 50 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Dice and Game Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          initial="initial"
          animate="float"
          className="absolute top-[15%] left-[10%]"
        >
          <div className="relative w-20 h-20 bg-gradient-to-br from-pink-300 to-pink-500 rounded-2xl shadow-xl transform rotate-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={floatingVariants}
          initial="initial"
          animate="float"
          transition={{ delay: 0.5 }}
          className="absolute bottom-[20%] right-[15%]"
        >
          <div className="relative w-16 h-16 bg-gradient-to-br from-purple-300 to-purple-500 rounded-2xl shadow-xl transform -rotate-12">
            <div className="absolute inset-0 grid grid-cols-2 gap-1 p-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={rotateVariants}
          initial="initial"
          animate="rotate"
          className="absolute top-[30%] right-[25%] opacity-30"
        >
          <div className="w-40 h-40 border-4 border-dashed border-pink-300 rounded-full" />
        </motion.div>

        <motion.div
          variants={rotateVariants}
          initial="initial"
          animate="rotate"
          transition={{ duration: 25 }}
          className="absolute bottom-[30%] left-[20%] opacity-30"
        >
          <div className="w-64 h-64 border-4 border-dashed border-purple-300 rounded-full" />
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen justify-center">
        <motion.div
          className="w-full max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top Navigation */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-between items-center mb-4 px-4"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-full cursor-pointer"
            >
              <Home className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full cursor-pointer"
              onClick={() => navigate("/leaderboard")}
            >
              <span className="text-white font-medium mr-2">Leaderboard</span>
              <Trophy className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>

          {/* Main Game Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/20 p-8 mb-12"
          >
            {/* Hero Title */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h1 className="text-7xl sm:text-9xl font-black drop-shadow-lg">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-white">
                  Tambola
                </span>
              </h1>
              <p className="text-white/80 text-xl max-w-3xl mx-auto mt-4">
                The ultimate online housie experience to play with friends & family
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/60 to-purple-700/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg"
              >
                <motion.div 
                  variants={pulseVariants} 
                  initial="initial" 
                  animate="pulse"
                  className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-xl"
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-white text-3xl font-bold mb-1">1000+</h3>
                <p className="text-white/70 text-center">Active Players</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/60 to-purple-700/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg"
              >
                <motion.div 
                  variants={pulseVariants} 
                  initial="initial" 
                  animate="pulse"
                  className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-xl"
                >
                  <Dice className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-white text-3xl font-bold mb-1">500+</h3>
                <p className="text-white/70 text-center">Games Played</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/60 to-purple-700/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg"
              >
                <motion.div 
                  variants={pulseVariants} 
                  initial="initial" 
                  animate="pulse"
                  className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-xl"
                >
                  <Trophy className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-white text-3xl font-bold mb-1">4.9/5</h3>
                <p className="text-white/70 text-center">Player Rating</p>
              </motion.div>
            </motion.div>

            {/* Main CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center max-w-xl mx-auto"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/create-room")}
                className="flex-1 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl transform transition-transform group-hover:scale-105 duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl py-6 px-8 border-2 border-white/20 shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300">
                  <Play className="w-10 h-10 text-white mb-2" />
                  <span className="text-white text-2xl font-bold">Create Room</span>
                  <motion.div 
                    initial={{width: 0}}
                    whileHover={{width: "80%"}}
                    className="h-1 bg-white/30 rounded-full mt-2"
                  />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/join-room")}
                className="flex-1 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl transform transition-transform group-hover:scale-105 duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl py-6 px-8 border-2 border-white/20 shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                  <Users className="w-10 h-10 text-white mb-2" />
                  <span className="text-white text-2xl font-bold">Join Room</span>
                  <motion.div 
                    initial={{width: 0}}
                    whileHover={{width: "80%"}}
                    className="h-1 bg-white/30 rounded-full mt-2"
                  />
                </div>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Feature Mini Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          >
            {[
              { number: "2+", label: "Minutes Average Game" },
              { number: "50+", label: "Different Patterns" },
              { number: "60s", label: "To Join a Game" },
              { number: "100%", label: "Fun Guaranteed" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg"
              >
                <h3 className="text-white text-2xl font-bold">{item.number}</h3>
                <p className="text-white/70 text-center text-sm">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div 
            variants={itemVariants}
            className="text-center text-white/60 text-sm mt-8"
          >
            <p>© 2025 Tambola Online. Play responsibly and have fun!</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
