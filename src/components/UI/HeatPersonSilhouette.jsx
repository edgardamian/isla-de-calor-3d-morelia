import React from 'react';

/**
 * Minimalist Person Under Heat Icon
 * Clean silhouette of a person wiping brow under heat with radiant thermal waves.
 */
export default function HeatPersonSilhouette({
  className = 'w-10 h-10',
  animated = false,
  showSweat = true,
}) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
      >
        <defs>
          {/* Warm Thermal Gradient for the Human Silhouette */}
          <linearGradient id="minimalHeatPersonGrad" x1="24" y1="12" x2="24" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Radiant Heat Wave Gradient */}
          <linearGradient id="minimalHeatWaveGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>

          {/* Sweat Drop Gradient */}
          <linearGradient id="minimalSweatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* 1. Minimalist Radiant Heat Waves above head */}
        <g className={animated ? 'animate-pulse' : ''}>
          <path
            d="M20 5C19.5 6.5 20.5 8 20 9.5"
            stroke="url(#minimalHeatWaveGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M24 3C23.5 5 24.5 7 24 9"
            stroke="url(#minimalHeatWaveGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M28 5C27.5 6.5 28.5 8 28 9.5"
            stroke="url(#minimalHeatWaveGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        {/* 2. Person Silhouette */}
        <g>
          {/* Head */}
          <circle cx="24" cy="18" r="6" fill="url(#minimalHeatPersonGrad)" />

          {/* Arm wiping forehead (forearm angled across brow) */}
          <path
            d="M24 16C26 16 28.5 16.5 30 18C30.8 18.8 30.5 20 29.5 20.5L25 21L24 19L24 16Z"
            fill="url(#minimalHeatPersonGrad)"
          />
          <path
            d="M30 18.5L34 26C34.5 27 33.5 28.5 32 28L28 25L29 21L30 18.5Z"
            fill="url(#minimalHeatPersonGrad)"
          />

          {/* Upper Body / Torso with curved shoulders */}
          <path
            d="M15 38C15 30.5 18.5 26.5 24 26.5C29.5 26.5 33 30.5 33 38C33 40.5 31.5 42 29 42H19C16.5 42 15 40.5 15 38Z"
            fill="url(#minimalHeatPersonGrad)"
          />

          {/* Left resting arm silhouette */}
          <path
            d="M15 28.5C13 31 12 35 13 38C13.5 39 15 39 15.5 38C16 36 16 33 17 30L15 28.5Z"
            fill="url(#minimalHeatPersonGrad)"
          />
        </g>

        {/* 3. Minimalist Sweat Droplet dripping */}
        {showSweat && (
          <g className={animated ? 'animate-[bounce_2s_ease-in-out_infinite]' : ''}>
            <path
              d="M18.5 16C18.5 16 17 18.2 17 19.2C17 20.2 17.7 21 18.5 21C19.3 21 20 20.2 20 19.2C20 18.2 18.5 16 18.5 16Z"
              fill="url(#minimalSweatGrad)"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
