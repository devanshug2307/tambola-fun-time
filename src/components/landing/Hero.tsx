import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import {
  Users,
  Trophy,
  Heart,
  Crown,
  Star,
  Gift,
  Play,
  Share,
} from "lucide-react";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-200 text-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-4 py-16 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Title */}
        <motion.h1
          className="text-6xl md:text-9xl font-black tracking-tight mb-6"
          variants={itemVariants}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-tambola-blue to-tambola-pink">
            Tambola
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed"
          variants={itemVariants}
        >
          Revolutionize game nights with our next-generation Housie experience.
          Create epic rooms, invite your squad, and turn every moment into a
          celebration of wins!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          variants={itemVariants}
        >
          <ButtonCustom
            variant="primary"
            size="lg"
            onClick={() => navigate("/create-room")}
            className="group relative overflow-hidden bg-gradient-to-r from-tambola-blue to-tambola-pink text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="relative z-10">Create Room</span>
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </ButtonCustom>
          <ButtonCustom
            variant="outline"
            size="lg"
            onClick={() => navigate("/join-room")}
            className="border-2 border-tambola-blue text-tambola-blue hover:bg-tambola-blue hover:text-white transition-all duration-300 transform hover:-translate-y-1"
          >
            Join Room
          </ButtonCustom>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="flex justify-center space-x-8 mb-16 text-purple-800"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <Users className="w-6 h-6" />
            <span className="font-semibold">1000+ Active Players</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <Trophy className="w-6 h-6" />
            <span className="font-semibold">500+ Winners</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <Heart className="w-6 h-6" />
            <span className="font-semibold">4.9/5 Rating</span>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {[
            {
              icon: Play,
              title: "Create a Game",
              description:
                "Customize rooms with unique rules and exciting prizes.",
              color: "bg-blue-100",
            },
            {
              icon: Share,
              title: "Invite Players",
              description: "Share room codes, connect with friends instantly.",
              color: "bg-green-100",
            },
            {
              icon: Trophy,
              title: "Win Together",
              description:
                "Experience the joy of collective triumph and excitement.",
              color: "bg-purple-100",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover="hover"
              className={`relative p-6 rounded-2xl shadow-lg ${feature.color} transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-bold text-purple-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
              {activeFeature === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-tambola-blue to-tambola-pink"
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {[
            {
              icon: Crown,
              title: "Premium Experience",
              description:
                "Immersive design, smooth animations, intuitive interface.",
            },
            {
              icon: Star,
              title: "Multiple Game Modes",
              description:
                "Explore exciting patterns from Early 5 to Full House!",
            },
            {
              icon: Gift,
              title: "Special Events",
              description: "Exclusive tournaments with amazing rewards await!",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover="hover"
              className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-bold text-purple-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-16 text-center text-gray-500"
          variants={itemVariants}
        >
          <p>© 2025 Tambola Online. Play responsibly and have fun!</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Hero;
