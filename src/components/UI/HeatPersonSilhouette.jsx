import React from 'react';

/**
 * HeatFaceAqueductIcon (Basado en emoji 🥵 + Acueducto de Morelia minimalista)
 * Utiliza la paleta de colores oficial del proyecto (Naranja LST, Cian térmico, Azul espacial y Blanco).
 * Arcos de gran visibilidad y contraste que se reconocen al instante.
 */
export default function HeatPersonSilhouette({
  className = 'w-10 h-10',
  animated = false,
  showSweat = true,
}) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
      >
        <defs>
          {/* Hot Face Radiant LST Gradient (Emoji 🥵) */}
          <radialGradient id="projHotFaceGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff8a00" />
            <stop offset="60%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#dc2626" />
          </radialGradient>

          {/* Minimalist Aqueduct Gradient (Colores del proyecto: Cian / Azul térmico y Blanco) */}
          <linearGradient id="projAqueductGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Cyan Glow for Aqueduct Accents */}
          <linearGradient id="projCyanAccent" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>

          {/* Sweat Drop Gradient */}
          <linearGradient id="projSweatGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Tongue Gradient */}
          <linearGradient id="projTongueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* ======================================================== */}
        {/* 1. ACUEDUCTO DE MORELIA MINIMALISTA (Alta Visibilidad)   */}
        {/* ======================================================== */}
        <g id="aqueductMorelia">
          {/* Canal superior / Cornisa continua del Acueducto */}
          <rect x="2" y="6" width="60" height="4" rx="1" fill="url(#projAqueductGrad)" />
          <rect x="2" y="10" width="60" height="2" fill="url(#projCyanAccent)" opacity="0.8" />

          {/* 3 Arcos Romanos Grandes y Definidos */}
          
          {/* Arco Izquierdo */}
          <path
            d="M 4 12 H 20 V 48 H 16 V 26 C 16 22 8 22 8 26 V 48 H 4 Z"
            fill="url(#projAqueductGrad)"
          />
          {/* Luz / Curvatura del Arco Izquierdo */}
          <path
            d="M 8 26 C 8 20 16 20 16 26"
            stroke="url(#projCyanAccent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Arco Central (Visible arriba del emoji) */}
          <path
            d="M 22 12 H 42 V 48 H 38 V 26 C 38 22 26 22 26 26 V 48 H 22 Z"
            fill="url(#projAqueductGrad)"
          />
          {/* Luz / Curvatura del Arco Central */}
          <path
            d="M 26 26 C 26 19 38 19 38 26"
            stroke="url(#projCyanAccent)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Arco Derecho */}
          <path
            d="M 44 12 H 60 V 48 H 56 V 26 C 56 22 48 22 48 26 V 48 H 44 Z"
            fill="url(#projAqueductGrad)"
          />
          {/* Luz / Curvatura del Arco Derecho */}
          <path
            d="M 48 26 C 48 20 56 20 56 26"
            stroke="url(#projCyanAccent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Línea base de cimientos */}
          <line x1="2" y1="48" x2="62" y2="48" stroke="url(#projAqueductGrad)" strokeWidth="1.5" opacity="0.6" />
        </g>

        {/* ======================================================== */}
        {/* 2. ONDAS DE RADIACIÓN SOLAR                              */}
        {/* ======================================================== */}
        <g className={animated ? 'animate-pulse' : ''}>
          <path
            d="M 27 3 C 26 1.5 28 0.5 27 0"
            stroke="#fbbf24"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 32 2 C 31 0.5 33 -0.5 32 -1.5"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 37 3 C 36 1.5 38 0.5 37 0"
            stroke="#ef4444"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        {/* ======================================================== */}
        {/* 3. CARITA DE CALOR (EMOJI 🥵 EN PRIMER PLANO)            */}
        {/* ======================================================== */}
        <g id="heatFaceEmoji">
          {/* Sombra de contorno para separar perfectamente del acueducto */}
          <circle cx="32" cy="39" r="17.5" fill="#0f172a" opacity="0.75" />
          
          {/* Cabeza 🥵 con degradado LST */}
          <circle
            cx="32"
            cy="39"
            r="16"
            fill="url(#projHotFaceGrad)"
            stroke="#ffffff"
            strokeWidth="1.2"
          />

          {/* Mejillas sonrojadas por calor */}
          <ellipse cx="21" cy="42" rx="3" ry="1.8" fill="#991b1b" opacity="0.65" />
          <ellipse cx="43" cy="42" rx="3" ry="1.8" fill="#991b1b" opacity="0.65" />

          {/* Cejas estresadas / caídas por el calor (blanco nítido) */}
          <path
            d="M 22 31 C 24 30 27 32 28 34"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 42 31 C 40 30 37 32 36 34"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Ojos achinados de esfuerzo térmico (> <) */}
          <path
            d="M 23 37 L 26.5 39 L 23 41"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 41 37 L 37.5 39 L 41 41"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Boca abierta jadeando con lengua afuera */}
          {/* Cavidad bucal oscura */}
          <path
            d="M 26.5 45 Q 32 43.5 37.5 45 Q 37.5 51 32 52 Q 26.5 51 26.5 45 Z"
            fill="#450a0a"
          />
          {/* Lengua rosada */}
          <path
            d="M 29.5 46 Q 32 46 34.5 46 Q 35 52.5 32 52.5 Q 29 52.5 29.5 46 Z"
            fill="url(#projTongueGrad)"
            stroke="#ffe4e6"
            strokeWidth="0.6"
          />
          {/* Línea de la lengua */}
          <line x1="32" y1="47" x2="32" y2="50.5" stroke="#9f1239" strokeWidth="0.8" strokeLinecap="round" />

          {/* Gota de sudor cian brillante con destello blanco */}
          {showSweat && (
            <g className={animated ? 'animate-bounce' : ''}>
              {/* Sombra de la gota */}
              <ellipse cx="19" cy="35" rx="3.5" ry="4.5" fill="#0369a1" opacity="0.4" />
              {/* Cuerpo de la gota */}
              <path
                d="M 18.5 28 C 18.5 28 14.5 32 14.5 35 C 14.5 37.5 16.5 39.5 19 39.5 C 21.5 39.5 23.5 37.5 23.5 35 C 23.5 32 19.5 28 18.5 28 Z"
                fill="url(#projSweatGrad)"
                stroke="#ffffff"
                strokeWidth="0.9"
              />
              {/* Reflejo brillante */}
              <ellipse cx="17" cy="33.5" rx="1.2" ry="2" fill="#ffffff" opacity="0.9" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
