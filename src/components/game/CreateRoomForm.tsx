
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useGameContext } from "@/context/GameContext";
import { toast } from "sonner";

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

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border-4 border-purple-700 overflow-hidden"
      >
        <div className="bg-purple-700 p-6 text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Create Tambola Room
          </h2>
          <p className="text-white/80 mt-2">
            Set up your exciting Tambola game!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4 shadow-inner">
              <label
                htmlFor="numberCallSpeed"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Number Call Speed
              </label>
              <input
                type="range"
                id="numberCallSpeed"
                name="numberCallSpeed"
                min="1"
                max="30"
                step="1"
                value={formData.numberCallSpeed}
                onChange={handleChange}
                className="w-full h-2 bg-purple-700/30 rounded-full appearance-none cursor-pointer"
                disabled={isCreating}
              />
              <div className="flex justify-between text-xs text-gray-700 mt-2">
                <span>Fast (5s)</span>
                <span className="font-bold">{formData.numberCallSpeed}s</span>
                <span>Slow (30s)</span>
              </div>
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-4 shadow-inner">
              <input
                type="checkbox"
                id="autoMarkEnabled"
                name="autoMarkEnabled"
                checked={formData.autoMarkEnabled}
                onChange={handleChange}
                className="h-5 w-5 text-purple-700 focus:ring-purple-700 border-gray-300 rounded"
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
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Winning Patterns
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "earlyFive", label: "Early Five" },
                { id: "topLine", label: "Top Line" },
                { id: "middleLine", label: "Middle Line" },
                { id: "bottomLine", label: "Bottom Line" },
                { id: "fullHouse", label: "Full House" },
              ].map((pattern) => (
                <div
                  key={pattern.id}
                  className="flex items-center bg-gray-100 rounded-lg p-3 shadow-inner"
                >
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
                    className="h-5 w-5 text-purple-700 focus:ring-purple-700 border-gray-300 rounded"
                    disabled={isCreating}
                  />
                  <label
                    htmlFor={pattern.id}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {pattern.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between space-x-4">
            <button
              type="button"
              className="w-full px-4 py-2 text-purple-700 border border-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              disabled={isCreating}
            >
              {isCreating ? "Creating Room..." : "Create Room"}
            </button>
          </div>
        </form>

        {joinLink && (
          <div className="bg-gray-100 p-4 text-center">
            <p className="text-gray-700">
              Room Code:{" "}
              <span className="font-bold text-purple-700">{joinLink}</span>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateRoomForm;
