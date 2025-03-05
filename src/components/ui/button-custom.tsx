
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
  isLoading?: boolean;
}

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant = "primary", 
      size = "md", 
      children, 
      isLoading = false,
      ...props 
    },
    ref
  ) => {
    const baseClasses = "tambola-btn inline-flex items-center justify-center relative transition-all duration-200 focus:outline-none";

    const variantClasses = {
      primary: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-purple-500/30 focus:ring-4 focus:ring-purple-500/30 font-medium",
      secondary: "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-pink-500/30 focus:ring-4 focus:ring-pink-500/30 font-medium",
      accent: "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg hover:shadow-amber-500/30 focus:ring-4 focus:ring-amber-500/30 font-medium",
      outline: "bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-gray-500/20",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-gray-500/20",
    };

    const sizeClasses = {
      sm: "text-xs px-3 py-1.5 rounded-md space-x-1",
      md: "text-sm px-4 py-2 rounded-md space-x-1.5",
      lg: "text-base px-6 py-3 rounded-lg space-x-2",
      icon: "p-2 rounded-full",
    };

    const disabledClasses = props.disabled ? "opacity-70 cursor-not-allowed pointer-events-none" : "";

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: props.disabled ? 1 : 1.02 }}
        whileTap={{ scale: props.disabled ? 1 : 0.98 }}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          disabledClasses,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

ButtonCustom.displayName = "ButtonCustom";

export { ButtonCustom };
