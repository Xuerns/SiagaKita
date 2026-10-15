import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  variant?: "symbol" | "badge";
}

export function SiagaKitaLogo({ size = 24, variant = "symbol", className = "", ...props }: LogoProps) {
  if (variant === "badge") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <rect width="64" height="64" rx="16" fill="#176B4D" />
        <rect width="64" height="64" rx="16" fill="url(#sk_grad)" />
        <g stroke="#6EE7B7" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 40L23 21C24.5 18.5 26.8 18.5 28.3 21L36 33L40.5 27.5C41.8 25.8 43.8 25.8 45.1 27.5L52 38.5" />
          <path d="M12 47.5C17.5 44 22.5 44 28 47.5C33.5 51 38.5 51 44 47.5C47 45.5 49.5 45.5 52 46.5" />
        </g>
        <defs>
          <linearGradient id="sk_grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#25845F" stopOpacity="0.4" />
            <stop offset="1" stopColor="#0F3822" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M2.5 14.5L8.5 6.5C9.2 5.5 10.3 5.5 11 6.5L14.5 12L16.5 9.5C17.1 8.7 18.1 8.7 18.7 9.5L21.5 14" />
      <path d="M2.5 18.5C5 16.8 7.5 16.8 10 18.5C12.5 20.2 15 20.2 17.5 18.5C19 17.5 20.2 17.5 21.5 18" />
    </svg>
  );
}
