
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useGameContext } from "@/context/GameContext";
import { toast } from "sonner";
import { Play, Clock, Check, X, Dice, Copy } from "lucide-react";

const CreateRoomForm: React.FC = () => {
  const navigate = useNavigate();
  const { createRoom } = useGameContext();
  const [isCreating, setIsCreating] = useState(false);
  const [joinLink, setJoinLink] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    maxPlayers: 10,
    ticketPrice: 5,
    numberCallSpeed: 10,
    autoMarkEnabled: true,
    winningPatterns: {
      earlyFive: true,
      topLine: true,
      middleLine: true,
      bottomLine: true,
      fullHouse: true,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value)
          : value,
    }));
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      winningPatterns: {
        ...prev.winningPatterns,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Make sure at least one winning pattern is selected
    const hasSelectedPattern = Object.values(formData.winningPatterns).some(
      (isSelected) => isSelected
    );
    if (!hasSelectedPattern) {
      toast.error("Please select at least one winning pattern");
      return;
    }

    setIsCreating(true);

    const selectedPatterns = Object.entries(formData.winningPatterns)
      .filter(([_, isSelected]) => isSelected)
      .map(([pattern, _]) => {
        switch (pattern) {
          case "earlyFive":
            return "Early Five";
          case "topLine":
            return "Top Line";
          case "middleLine":
            return "Middle Line";
          case "bottomLine":
            return "Bottom Line";
          case "fullHouse":
            return "Full House";
          default:
            return "";
        }
      })
      .filter((p) => p !== "");

    try {
      const roomCode = await createRoom({
        numberCallSpeed: formData.numberCallSpeed,
        autoMarkEnabled: formData.autoMarkEnabled,
        winningPatterns: selectedPatterns,
      });

      setJoinLink(roomCode);
      toast.success(`Room created! Room code: ${roomCode}`);
      navigate("/game");
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Room code copied to clipboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-pink-500 z-10"
      >
        <div className="relative">
          <div className="absolute top-0 right-0 p-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/")} 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-100 transition-colors"
            >
              <X size={18} />
            </motion.button>
          </div>
          
          <div className="bg-pink-500 p-6 text-center">
            <div className="flex justify-center mb-3">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3 
                }}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Play className="w-8 h-8 text-pink-500" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold text-white">Create Tambola Room</h2>
            <p className="text-white/80 mt-1">Set up your exciting Tambola game!</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="numberCallSpeed"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number Call Speed
                </label>
                <div className="flex items-center">
                  <Clock size={14} className="text-gray-400 mr-1" />
                  <span className="text-xs font-medium text-gray-500">{formData.numberCallSpeed}s</span>
                </div>
              </div>
              <input
                type="range"
                id="numberCallSpeed"
                name="numberCallSpeed"
                min="5"
                max="30"
                step="1"
                value={formData.numberCallSpeed}
                onChange={handleChange}
                className="w-full h-2 bg-pink-200 rounded-full appearance-none cursor-pointer accent-pink-500"
                disabled={isCreating}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Fast (5s)</span>
                <span>Slow (30s)</span>
              </div>
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg p-4 shadow-inner">
              <input
                type="checkbox"
                id="autoMarkEnabled"
                name="autoMarkEnabled"
                checked={formData.autoMarkEnabled}
                onChange={handleChange}
                className="h-5 w-5 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                disabled={isCreating}
              />
              <label
                htmlFor="autoMarkEnabled"
                className="ml-3 text-sm text-gray-700"
              >
                Enable Auto-Daub (automatically mark numbers)
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Winning Patterns</h3>
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                Select at least one
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "earlyFive", label: "Early Five", icon: <Dice size={16} /> },
                { id: "topLine", label: "Top Line", icon: <Dice size={16} /> },
                { id: "middleLine", label: "Middle Line", icon: <Dice size={16} /> },
                { id: "bottomLine", label: "Bottom Line", icon: <Dice size={16} /> },
                { id: "fullHouse", label: "Full House", icon: <Dice size={16} /> },
              ].map((pattern) => (
                <motion.div
                  key={pattern.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center bg-gray-50 rounded-lg p-3 shadow-inner cursor-pointer ${
                    formData.winningPatterns[
                      pattern.id as keyof typeof formData.winningPatterns
                    ]
                      ? "border-2 border-pink-500 bg-pink-50"
                      : "border border-gray-200"
                  }`}
                  onClick={() => {
                    if (!isCreating) {
                      handlePatternChange({
                        target: {
                          name: pattern.id,
                          checked: !formData.winningPatterns[
                            pattern.id as keyof typeof formData.winningPatterns
                          ],
                        },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      formData.winningPatterns[
                        pattern.id as keyof typeof formData.winningPatterns
                      ]
                        ? "bg-pink-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}>
                      {formData.winningPatterns[
                        pattern.id as keyof typeof formData.winningPatterns
                      ] ? (
                        <Check size={14} />
                      ) : (
                        pattern.icon
                      )}
                    </div>
                    <label
                      htmlFor={pattern.id}
                      className="ml-3 text-sm font-medium text-gray-700 cursor-pointer flex-1"
                    >
                      {pattern.label}
                    </label>
                    <input
                      type="checkbox"
                      id={pattern.id}
                      name={pattern.id}
                      checked={
                        formData.winningPatterns[
                          pattern.id as keyof typeof formData.winningPatterns
                        ]
                      }
                      onChange={handlePatternChange}
                      className="sr-only"
                      disabled={isCreating}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isCreating}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-70"
            >
              <span>{isCreating ? "Creating Room..." : "Create Room"}</span>
              {!isCreating && <Play size={18} />}
            </motion.button>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/join-room")}
              className="text-pink-500 hover:text-pink-700 text-sm font-medium"
            >
              Join an existing room instead
            </button>
          </div>
        </form>

        {joinLink && (
          <div className="bg-gray-50 p-4 border-t border-gray-100">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Room Code:</p>
                <p className="font-bold text-pink-600 text-lg tracking-wider">{joinLink}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => copyToClipboard(joinLink)}
                className="p-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
              >
                <Copy size={16} />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateRoomForm;
