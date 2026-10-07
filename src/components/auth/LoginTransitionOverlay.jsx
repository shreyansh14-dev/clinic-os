import React from 'react';

/**
 * LoginTransitionOverlay
 * Recreates Phase 2 (~1.2s - ~2.4s) and Phase 3 (~2.4s - ~4.2s):
 * - Expands over entire viewport in vivid brand purple (#5F2EEA)
 * - Centered geometric white star/cross healthcare emblem
 * - Uses cubic-bezier(0.65, 0, 0.35, 1) transition easing
 * - Retracts / dissolves gracefully to reveal login screen with characters settling
 */
export const LoginTransitionOverlay = ({
  isActive = false,
  isRetracting = false,
  onTransitionEnd = () => {}
}) => {
  if (!isActive && !isRetracting) return null;

  return (
    <div
      onAnimationEnd={onTransitionEnd}
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        isRetracting
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#5F2EEA'
      }}
    >
      {/* Centered White Geometric / Star-like Healthcare Emblem */}
      <div
        className={`flex flex-col items-center justify-center gap-4 transition-all duration-500 transform ${
          isRetracting ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-20 h-20 text-white animate-pulse"
          fill="none"
        >
          {/* Central 8-Point Rounded Healthcare Star / Cross Emblem */}
          <path
            d="M 50 10 
               C 50 28, 50 28, 68 32
               C 50 36, 50 36, 50 54
               C 50 36, 50 36, 32 32
               C 50 28, 50 28, 50 10 Z"
            fill="#FFFFFF"
            transform="scale(1.4) translate(-14, -6)"
          />
          {/* Subtle Accent Cross */}
          <rect x="46" y="24" width="8" height="52" rx="4" fill="#FFFFFF" opacity="0.95" />
          <rect x="24" y="46" width="52" height="8" rx="4" fill="#FFFFFF" opacity="0.95" />
        </svg>

        <div className="text-white text-center font-black tracking-widest text-sm uppercase">
          ClinicOS
        </div>
      </div>
    </div>
  );
};
