import React from 'react';

export const CrackersLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
          {/* Shield Shape */}
          <path 
            d="M50 5 L90 25 V65 C90 80 50 95 50 95 C50 95 10 80 10 65 V25 L50 5Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4"
            className="text-accent"
          />
          {/* Inner Shield */}
          <path 
            d="M50 15 L80 30 V60 C80 72 50 85 50 85 C50 85 20 72 20 60 V30 L50 15Z" 
            fill="currentColor" 
            className="text-accent/20"
          />
          {/* "C" Letter */}
          <path 
            d="M45 40 C40 40 35 45 35 50 C35 55 40 60 45 60" 
            fill="none" 
            stroke="white" 
            strokeWidth="6" 
            strokeLinecap="round"
          />
          {/* "K" Letter */}
          <path 
            d="M55 40 V60 M55 50 L65 40 M55 50 L65 60" 
            fill="none" 
            stroke="white" 
            strokeWidth="6" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-sm font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
        CRACKERS
      </span>
    </div>
  );
};
