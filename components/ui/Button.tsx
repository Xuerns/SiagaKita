import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 rounded-[8px] gap-1.5",
    md: "text-sm px-4 py-2 rounded-[10px] gap-2",
    lg: "text-base px-5 py-2.5 rounded-[12px] gap-2.5 font-semibold",
  };

  const variants = {
    primary: "bg-[#176B4D] hover:bg-[#104A35] text-white focus:ring-[#25845F] shadow-sm active:scale-[0.98]",
    secondary: "bg-[#E5F5EA] hover:bg-[#d2edd9] text-[#176B4D] focus:ring-[#176B4D]",
    outline: "border border-[#CDD7D1] bg-white hover:bg-[#F8FAF9] text-[#17211D] focus:ring-[#CDD7D1]",
    danger: "bg-[#D64545] hover:bg-[#b83232] text-white focus:ring-[#D64545] shadow-sm active:scale-[0.98]",
    ghost: "bg-transparent hover:bg-[#F1F4F2] text-[#68756E] hover:text-[#17211D]",
  };

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  className = "",
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[16px] border border-[#E6EBE8] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 transition-all ${className}`}
    >
      {children}
    </div>
  );
}
