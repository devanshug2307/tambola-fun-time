import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const baseClasses = "tambola-btn inline-flex items-center justify-center";

    const variantClasses = {
      primary: "tambola-btn-primary",
      secondary: "tambola-btn-secondary",
      accent: "tambola-btn-accent",
      outline:
        "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500/40",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500/40",
    };

    const sizeClasses = {
      sm: "text-xs px-3 py-1.5 rounded-md",
      md: "text-sm px-4 py-2 rounded-md",
      lg: "text-base px-6 py-3 rounded-lg",
      icon: "p-2 rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ButtonCustom.displayName = "ButtonCustom";

export { ButtonCustom };
