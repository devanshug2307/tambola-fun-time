
import React from "react";
import { motion } from "framer-motion";
import { Users, Ticket, Trophy, Settings, MessageSquare } from "lucide-react";

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Multiplayer Experience",
    description: "Create virtual rooms and invite friends and family to join from anywhere in the world."
  },
  {
    icon: <Ticket className="w-6 h-6" />,
    title: "Digital Tickets",
    description: "Beautifully designed digital Tambola tickets with smooth marking animations."
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "Customizable Games",
    description: "Configure winning patterns, ticket prices, and game speeds to your preference."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Live Chat",
    description: "Chat with all players during the game to enhance the social experience."
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Multiple Winning Patterns",
    description: "Compete for Early Five, Top Line, Middle Line, Bottom Line, and Full House."
  }
];

const FeatureSection: React.FC = () => {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            className="text-tambola-blue font-medium text-sm uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Game Features
          </motion.span>
          <motion.h2 
            className="mt-2 text-3xl md:text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need for the perfect Tambola experience
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our platform brings the traditional game into the digital age with
            modern features and a beautiful interface.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="w-12 h-12 rounded-xl bg-tambola-blue/10 flex items-center justify-center text-tambola-blue mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
