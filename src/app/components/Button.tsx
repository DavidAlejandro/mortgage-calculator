import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <button
      className={`bg-primary hover:bg-primary-dark rounded px-4 py-2 text-sm font-bold text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
