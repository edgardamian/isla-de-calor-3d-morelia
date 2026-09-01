import React from 'react';
import { useProgress } from '@react-three/drei';
import { Flame, Layers, Box, Cpu } from 'lucide-react';

export default function LoadingScreen() {
  const { active, progress, loaded, total, item } = useProgress();

  if (!active && progress === 100) return null;

  const formattedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const estimatedMB = (45.8 * (formattedProgress / 100)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl text-slate-100 transition-opacity duration-700">
      {/* Decorative background glow */}
      <div className="absolute w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -bottom-10 right-10"></div>
      <div className="absolute w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -top-10 left-10"></div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        
        {/* Animated 3D Radar / Spinner Icon */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border border-white/15 shadow-2xl flex items-center justify-center relative overflow-hidden group">
            {/* Spinning thermal ring */}
            <div className="absolute inset-0 border-2 border-transparent border-t-orange-500 border-r-red-500 rounded-2xl animate-spin"></div>
            
            {/* Pulsing center icon */}
            <Flame className="w-10 h-10 text-orange-400 animate-pulse drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
          </div>

          {/* Orbiting particle */}
          <div className="absolute -inset-2 border border-orange-500/20 rounded-3xl animate-ping opacity-30"></div>
        </div>

        {/* Title */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            Cargando Modelo 3D
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Isla de Calor Urbana
          </h2>
          <p className="text-xs text-slate-400">
            Zona Metropolitana de Morelia • MDE & Morfología
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/90 rounded-2xl p-4 border border-white/10 shadow-xl space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              Descargando geometría (~45.8 MB)
            </span>
            <span className="font-bold text-orange-400 text-sm">
              {formattedProgress}%
            </span>
          </div>

          {/* Glowing bar */}
          <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              style={{ width: `${formattedProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono pt-1">
            <span>{estimatedMB} MB / 45.8 MB</span>
            <span className="text-slate-500 truncate max-w-[180px]">
              {item ? item.split('/').pop() : 'ISLA_DE_CALOR_3D_V5.glb'}
            </span>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="mt-8 grid grid-cols-3 gap-2 w-full text-left">
          <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5 flex items-center gap-2">
            <Box className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="text-[10px] leading-tight">
              <p className="font-semibold text-slate-200">Relieve 3D</p>
              <p className="text-slate-500">MDE Alta Res.</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400 shrink-0" />
            <div className="text-[10px] leading-tight">
              <p className="font-semibold text-slate-200">Termografía</p>
              <p className="text-slate-500">LST Superficie</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-[10px] leading-tight">
              <p className="font-semibold text-slate-200">WebGL 2.0</p>
              <p className="text-slate-500">60 FPS Render</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
