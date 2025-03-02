
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useGameContext } from "@/context/GameContext";

const CreateRoomForm: React.FC = () => {
  const navigate = useNavigate();
  const { createRoom } = useGameContext();
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : type === "number" 
          ? parseInt(value) 
          : value,
    }));
  };
  
  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      winningPatterns: {
        ...prev.winningPatterns,
        [name]: checked,
      },
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPatterns = Object.entries(formData.winningPatterns)
      .filter(([_, isSelected]) => isSelected)
      .map(([pattern, _]) => {
        switch(pattern) {
          case "earlyFive": return "Early Five";
          case "topLine": return "Top Line";
          case "middleLine": return "Middle Line";
          case "bottomLine": return "Bottom Line";
          case "fullHouse": return "Full House";
          default: return "";
        }
      })
      .filter(p => p !== "");
    
    const roomCode = createRoom({
      maxPlayers: formData.maxPlayers,
      ticketPrice: formData.ticketPrice,
      numberCallSpeed: formData.numberCallSpeed,
      autoMarkEnabled: formData.autoMarkEnabled,
      winningPatterns: selectedPatterns,
    });
    
    navigate("/game");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Create Game Room</h2>
        <p className="text-gray-600 mt-1">Configure your game settings</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Players
            </label>
            <select
              id="maxPlayers"
              name="maxPlayers"
              value={formData.maxPlayers}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tambola-blue focus:border-tambola-blue"
            >
              {[5, 10, 15, 20, 30, 50].map(num => (
                <option key={num} value={num}>{num} players</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Ticket Price (virtual coins)
            </label>
            <input
              type="number"
              id="ticketPrice"
              name="ticketPrice"
              min="0"
              max="100"
              value={formData.ticketPrice}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tambola-blue focus:border-tambola-blue"
            />
          </div>
          
          <div>
            <label htmlFor="numberCallSpeed" className="block text-sm font-medium text-gray-700 mb-1">
              Number Call Speed (seconds)
            </label>
            <input
              type="range"
              id="numberCallSpeed"
              name="numberCallSpeed"
              min="5"
              max="30"
              step="5"
              value={formData.numberCallSpeed}
              onChange={handleChange}
              className="block w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Fast (5s)</span>
              <span>{formData.numberCallSpeed}s</span>
              <span>Slow (30s)</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoMarkEnabled"
              name="autoMarkEnabled"
              checked={formData.autoMarkEnabled}
              onChange={handleChange}
              className="h-4 w-4 text-tambola-blue focus:ring-tambola-blue border-gray-300 rounded"
            />
            <label htmlFor="autoMarkEnabled" className="ml-2 block text-sm text-gray-700">
              Enable Auto-Daub (automatically mark numbers)
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Winning Patterns</h3>
          <div className="space-y-2">
            {[
              { id: "earlyFive", label: "Early Five" },
              { id: "topLine", label: "Top Line" },
              { id: "middleLine", label: "Middle Line" },
              { id: "bottomLine", label: "Bottom Line" },
              { id: "fullHouse", label: "Full House" },
            ].map(pattern => (
              <div key={pattern.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={pattern.id}
                  name={pattern.id}
                  checked={formData.winningPatterns[pattern.id as keyof typeof formData.winningPatterns]}
                  onChange={handlePatternChange}
                  className="h-4 w-4 text-tambola-blue focus:ring-tambola-blue border-gray-300 rounded"
                />
                <label htmlFor={pattern.id} className="ml-2 block text-sm text-gray-700">
                  {pattern.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <ButtonCustom
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
          >
            Cancel
          </ButtonCustom>
          <ButtonCustom
            type="submit"
            variant="primary"
          >
            Create Room
          </ButtonCustom>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateRoomForm;
