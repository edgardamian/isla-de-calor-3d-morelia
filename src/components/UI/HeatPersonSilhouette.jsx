import React from 'react';

/**
 * HeatFaceAqueductIcon (Emoji 🥵 + Acueducto de Morelia)
 * Paleta Térmica Armónica del Proyecto: Amarillos solares, Naranjas cálidos y Rojizos con transparencias.
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
        className="w-full h-full drop-shadow-[0_2px_12px_rgba(234,88,12,0.4)]"
      >
        <defs>
          {/* 1. Acueducto: Degradado Amarillo Solar -> Naranja con Transparencia */}
          <linearGradient id="thmAqueduct" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.65" />
          </linearGradient>

          {/* 2. Cornisa del Acueducto: Brillo Dorado */}
          <linearGradient id="thmCornice" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          {/* 3. Rostro 🥵: Degradado Térmico Radial (Naranja -> Rojizo Profundo) */}
          <radialGradient id="thmFace" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="55%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#b91c1c" />
          </radialGradient>

          {/* 4. Ondas de Calor Superiores */}
          <linearGradient id="thmWaves" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          {/* 5. Gota de Sudor (Contraste Cian Térmico / Hielo) */}
          <linearGradient id="thmSweat" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* 6. Lengua */}
          <linearGradient id="thmTongue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* ======================================================== */}
        {/* 1. ACUEDUCTO DE MORELIA (Naranja, Amarillo y Translúcido) */}
        {/* ======================================================== */}
        <g id="aqueductHarmonic">
          {/* Cornisa Superior Continua */}
          <rect x="2" y="6" width="60" height="3.5" rx="1" fill="url(#thmCornice)" />
          <rect x="2" y="9.5" width="60" height="2" fill="#f59e0b" opacity="0.6" />

          {/* 3 Arcos Romanos Estilizados */}
          
          {/* Arco Izquierdo */}
          <path
            d="M 4 12 H 20 V 48 H 16 V 26 C 16 22 8 22 8 26 V 48 H 4 Z"
            fill="url(#thmAqueduct)"
          />
          {/* Borde sutil del arco izquierdo */}
          <path
            d="M 8 26 C 8 20 16 20 16 26"
            stroke="#fef08a"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Arco Central (Se asoma detrás y sobre la cabeza) */}
          <path
            d="M 22 12 H 42 V 48 H 38 V 26 C 38 22 26 22 26 26 V 48 H 22 Z"
            fill="url(#thmAqueduct)"
          />
          {/* Borde sutil del arco central */}
          <path
            d="M 26 26 C 26 19 38 19 38 26"
            stroke="#fef08a"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Arco Derecho */}
          <path
            d="M 44 12 H 60 V 48 H 56 V 26 C 56 22 48 22 48 26 V 48 H 44 Z"
            fill="url(#thmAqueduct)"
          />
          {/* Borde sutil del arco derecho */}
          <path
            d="M 48 26 C 48 20 56 20 56 26"
            stroke="#fef08a"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Línea Base de Cimientos */}
          <line x1="2" y1="48" x2="62" y2="48" stroke="#f59e0b" strokeWidth="1.2" opacity="0.4" />
        </g>

        {/* ======================================================== */}
        {/* 2. ONDAS DE CALOR RADIANTE (Amarillo / Naranja)          */}
        {/* ======================================================== */}
        <g className={animated ? 'animate-pulse' : ''}>
          <path
            d="M 27 3 C 26 1.5 28 0.5 27 0"
            stroke="url(#thmWaves)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 32 2 C 31 0.5 33 -0.5 32 -1.5"
            stroke="url(#thmWaves)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M 37 3 C 36 1.5 38 0.5 37 0"
            stroke="url(#thmWaves)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        {/* ======================================================== */}
        {/* 3. CARITA DE CALOR (EMOJI 🥵 EN PRIMER PLANO)            */}
        {/* ======================================================== */}
        <g id="heatFaceEmoji">
          {/* Sombra de profundidad para separar armónicamente del acueducto */}
          <circle cx="32" cy="39" r="17.5" fill="#450a0a" opacity="0.65" />
          
          {/* Cabeza 🥵 */}
          <circle
            cx="32"
            cy="39"
            r="16"
            fill="url(#thmFace)"
            stroke="#fde047"
            strokeWidth="1.2"
          />

          {/* Mejillas con sonrojo térmico translúcido */}
          <ellipse cx="21" cy="42" rx="3" ry="1.8" fill="#7f1d1d" opacity="0.6" />
          <ellipse cx="43" cy="42" rx="3" ry="1.8" fill="#7f1d1d" opacity="0.6" />

          {/* Cejas estresadas por calor (Amarillo claro nítido) */}
          <path
            d="M 22 31 C 24 30 27 32 28 34"
            stroke="#fef08a"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 42 31 C 40 30 37 32 36 34"
            stroke="#fef08a"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Ojos achinados por el calor (> <) */}
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

          {/* Boca jadeando con lengua afuera */}
          {/* Cavidad bucal oscura */}
          <path
            d="M 26.5 45 Q 32 43.5 37.5 45 Q 37.5 51 32 52 Q 26.5 51 26.5 45 Z"
            fill="#2a0505"
          />
          {/* Lengua rosada */}
          <path
            d="M 29.5 46 Q 32 46 34.5 46 Q 35 52.5 32 52.5 Q 29 52.5 29.5 46 Z"
            fill="url(#thmTongue)"
            stroke="#fef08a"
            strokeWidth="0.6"
          />
          {/* Línea central de la lengua */}
          <line x1="32" y1="47" x2="32" y2="50.5" stroke="#9f1239" strokeWidth="0.8" strokeLinecap="round" />

          {/* Gran gota de sudor brillante */}
          {showSweat && (
            <g className={animated ? 'animate-bounce' : ''}>
              {/* Sombra de la gota */}
              <ellipse cx="19" cy="35" rx="3.5" ry="4.5" fill="#0c4a6e" opacity="0.4" />
              {/* Cuerpo de la gota */}
              <path
                d="M 18.5 28 C 18.5 28 14.5 32 14.5 35 C 14.5 37.5 16.5 39.5 19 39.5 C 21.5 39.5 23.5 37.5 23.5 35 C 23.5 32 19.5 28 18.5 28 Z"
                fill="url(#thmSweat)"
                stroke="#ffffff"
                strokeWidth="0.9"
              />
              {/* Reflejo de luz */}
              <ellipse cx="17" cy="33.5" rx="1.2" ry="2" fill="#ffffff" opacity="0.95" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
