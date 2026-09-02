import React from 'react';

/**
 * HeatFaceAqueductIcon (Basado en emoji 🥵 + Acueducto de Morelia)
 * Minimalista, nítido y de alto contraste para máxima legibilidad.
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
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Hot Face Gradient (🥵 Red-Hot Flush) */}
          <radialGradient id="hotFaceGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff7a00" />
            <stop offset="55%" stopColor="#ff2e00" />
            <stop offset="100%" stopColor="#b91c1c" />
          </radialGradient>

          {/* Aqueduct Cantera Rosa Gradient */}
          <linearGradient id="aqueductGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fecdd3" />
            <stop offset="100%" stopColor="#fda4af" />
          </linearGradient>

          {/* Sweat Drop Gradient */}
          <linearGradient id="sweatGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Tongue Gradient */}
          <linearGradient id="tongueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* ======================================================== */}
        {/* 1. ACUEDUCTO DE MORELIA (Fondo Arquitectónico)           */}
        {/* ======================================================== */}
        <g opacity="0.85">
          {/* Cornisa Superior del Acueducto */}
          <rect x="4" y="14" width="56" height="3" rx="1" fill="url(#aqueductGrad)" />
          
          {/* Muro base sobre los arcos */}
          <rect x="6" y="17" width="52" height="3" fill="url(#aqueductGrad)" />

          {/* 3 Arcos de Medio Punto con Pilares */}
          {/* Pilar 1 */}
          <rect x="6" y="20" width="4" height="24" rx="0.5" fill="url(#aqueductGrad)" />
          
          {/* Arco 1 */}
          <path
            d="M10 27 C10 21, 22 21, 22 27 L22 20 L10 20 Z"
            fill="url(#aqueductGrad)"
          />
          
          {/* Pilar 2 */}
          <rect x="22" y="20" width="4" height="24" rx="0.5" fill="url(#aqueductGrad)" />

          {/* Arco 2 (Central) */}
          <path
            d="M26 27 C26 21, 38 21, 38 27 L38 20 L26 20 Z"
            fill="url(#aqueductGrad)"
          />

          {/* Pilar 3 */}
          <rect x="38" y="20" width="4" height="24" rx="0.5" fill="url(#aqueductGrad)" />

          {/* Arco 3 */}
          <path
            d="M42 27 C42 21, 54 21, 54 27 L54 20 L42 20 Z"
            fill="url(#aqueductGrad)"
          />

          {/* Pilar 4 */}
          <rect x="54" y="20" width="4" height="24" rx="0.5" fill="url(#aqueductGrad)" />

          {/* Línea de Base / Suelo */}
          <line x1="4" y1="44" x2="60" y2="44" stroke="url(#aqueductGrad)" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* ======================================================== */}
        {/* 2. ONDAS DE CALOR TÉRMICO (Sobre la cabeza)              */}
        {/* ======================================================== */}
        <g className={animated ? 'animate-pulse' : ''}>
          <path
            d="M26 8 C25 6, 27 4, 26 2"
            stroke="#fde047"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M32 6 C31 4, 33 2, 32 0.5"
            stroke="#f59e0b"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M38 8 C37 6, 39 4, 38 2"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* ======================================================== */}
        {/* 3. CARITA DE CALOR (EMOJI 🥵 ESTILO VECTORIAL)           */}
        {/* ======================================================== */}
        <g id="heatFace">
          {/* Borde exterior oscuro para contraste sobre cualquier fondo */}
          <circle cx="32" cy="36" r="19" fill="#7f1d1d" opacity="0.4" />
          
          {/* Cabeza Circular 🥵 */}
          <circle
            cx="32"
            cy="36"
            r="17.5"
            fill="url(#hotFaceGrad)"
            stroke="#ffe4e6"
            strokeWidth="1.2"
          />

          {/* Mejillas sonrojadas por calor */}
          <ellipse cx="20" cy="39" rx="3.5" ry="2" fill="#991b1b" opacity="0.6" />
          <ellipse cx="44" cy="39" rx="3.5" ry="2" fill="#991b1b" opacity="0.6" />

          {/* Cejas estresadas por calor (inclinadas hacia afuera) */}
          <path
            d="M21 28 C23 27, 26 29, 27 31"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M43 28 C41 27, 38 29, 37 31"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Ojos achinados / cerrados por el calor extremo (> <) */}
          <path
            d="M22 34 L26 36 L22 38"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M42 34 L38 36 L42 38"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Boca abierta jadeando con lengua afuera 🥵 */}
          {/* Cavidad bucal oscura */}
          <path
            d="M26 42 Q32 40 38 42 Q38 48 32 49 Q26 48 26 42 Z"
            fill="#450a0a"
          />
          {/* Lengua rosada colgando */}
          <path
            d="M29 43 Q32 43 35 43 Q35.5 50 32 50 Q28.5 50 29 43 Z"
            fill="url(#tongueGrad)"
            stroke="#ffe4e6"
            strokeWidth="0.6"
          />
          {/* Línea central de la lengua */}
          <line x1="32" y1="44" x2="32" y2="48" stroke="#be123c" strokeWidth="0.8" strokeLinecap="round" />

          {/* Gran gota de sudor en la sien (súper nítida y brillante) */}
          {showSweat && (
            <g className={animated ? 'animate-bounce' : ''}>
              {/* Sombra de la gota */}
              <ellipse cx="18" cy="32" rx="4" ry="5.5" fill="#0c4a6e" opacity="0.4" />
              {/* Cuerpo de la gota */}
              <path
                d="M17.5 24 C17.5 24, 13 29, 13 32 C13 35, 15.5 37, 18 37 C20.5 37, 23 35, 23 32 C23 29, 18.5 24, 17.5 24 Z"
                fill="url(#sweatGrad)"
                stroke="#ffffff"
                strokeWidth="1"
              />
              {/* Brillo blanco de reflejo */}
              <ellipse cx="15.5" cy="30.5" rx="1.5" ry="2.5" fill="#ffffff" opacity="0.85" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
