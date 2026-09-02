import React from 'react';

/**
 * HeatPersonSilhouette Component
 * Represents a person suffering heat surrounded by an animated flame silhouette aura.
 */
export default function HeatPersonSilhouette({
  className = 'w-12 h-12',
  animated = true,
  showSweat = true,
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer pulsing flame silhouette glow */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 via-orange-500/30 to-amber-400/20 rounded-full blur-xl animate-pulse pointer-events-none" />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]"
      >
        <defs>
          {/* Flame Gradient */}
          <linearGradient id="flameSilhouetteGrad" x1="50" y1="95" x2="50" y2="5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="35%" stopColor="#ea580c" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>

          {/* Person Silhouette Gradient */}
          <linearGradient id="personSilhouetteGrad" x1="50" y1="20" x2="50" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="40%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fdba74" />
          </linearGradient>

          {/* Sweat Drop Gradient */}
          <linearGradient id="sweatDropGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* 1. OUTER FLAME SILHOUETTE (Encircling the person) */}
        <g className={animated ? 'animate-[pulse_2.2s_ease-in-out_infinite]' : ''}>
          {/* Back flame body */}
          <path
            d="M50 4C42 16 33 22 28 32C22 43 20 54 22 66C24 78 33 89 44 94C38 88 37 81 39 74C41 68 46 64 48 58C50 52 48 46 51 40C54 48 59 53 62 61C64 66 63 72 61 77C68 73 74 65 76 57C78 48 76 40 72 32C67 23 58 15 50 4Z"
            fill="url(#flameSilhouetteGrad)"
            opacity="0.35"
          />

          {/* Dancing flame contour */}
          <path
            d="M50 2C41 15 31 23 25 35C18 48 17 62 21 75C25 87 36 96 50 98C64 96 75 87 79 75C83 62 82 48 75 35C69 23 59 15 50 2ZM50 12C57 22 64 29 68 39C73 50 74 61 71 71C68 81 59 89 50 90C41 89 32 81 29 71C26 61 27 50 32 39C36 29 43 22 50 12Z"
            fill="url(#flameSilhouetteGrad)"
          />

          {/* Internal flame tongues */}
          <path
            d="M50 8C55 18 64 26 67 36C70 47 67 56 61 63C60 55 56 49 53 43C50 37 49 28 50 8Z"
            fill="#fef08a"
            opacity="0.6"
          />
        </g>

        {/* 2. PERSON SILHOUETTE EXPERIENCING HEAT */}
        <g>
          {/* Head */}
          <circle cx="49" cy="38" r="9" fill="url(#personSilhouetteGrad)" />

          {/* Arm wiping forehead (elbow bent, hand to brow) */}
          <path
            d="M56 36C56 34 54 32 51 32C48 32 46 33 46 35C46 36 50 37 53 37L61 41C63 42 65 40 64 38L56 36Z"
            fill="url(#personSilhouetteGrad)"
          />
          <path
            d="M60 41L65 52C66 54 64 57 61 57L57 56L57 48L60 41Z"
            fill="url(#personSilhouetteGrad)"
          />

          {/* Left resting shoulder/arm */}
          <path
            d="M39 49C36 52 34 57 34 63C34 65 36 67 38 66C40 65 41 61 42 57L42 49L39 49Z"
            fill="url(#personSilhouetteGrad)"
          />

          {/* Torso & Shoulders (slumped/exhausted posture) */}
          <path
            d="M39 48C42 46 45 45 49 45C53 45 57 46 59 48L61 66C61 70 59 74 56 77L50 81L43 77C40 74 38 70 38 66L39 48Z"
            fill="url(#personSilhouetteGrad)"
          />

          {/* Heat wavy rays above head */}
          <path
            d="M44 23C43 21 44 19 46 17"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M49 22C48 20 49 18 51 15"
            stroke="#f97316"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M54 24C53 22 54 20 56 18"
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Sweat droplets dripping from brow */}
          {showSweat && (
            <g className={animated ? 'animate-[bounce_1.5s_infinite]' : ''}>
              {/* Main sweat drop */}
              <path
                d="M41 33C41 33 39 36 39 37.5C39 38.8 40 40 41.5 40C43 40 44 38.8 44 37.5C44 36 41 33 41 33Z"
                fill="url(#sweatDropGrad)"
              />
              {/* Secondary tiny sweat drop */}
              <circle cx="37" cy="42" r="1" fill="#38bdf8" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
