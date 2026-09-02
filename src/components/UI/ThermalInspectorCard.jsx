import React from 'react';
import {
  Thermometer,
  Building2,
  Mountain,
  Flame,
  X,
  Compass,
  Satellite,
  Info,
} from 'lucide-react';

export default function ThermalInspectorCard({ probeData, onClose }) {
  if (!probeData) return null;

  const {
    temperature,
    isBuilding,
    altitudeMsnm,
    classification,
    point,
  } = probeData;

  const color = classification?.colorHex || '#f97316';
  const progressPercent = Math.min(
    100,
    Math.max(0, ((temperature - 19.0) / (43.0 - 19.0)) * 100)
  );

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-[92vw] max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="glass-panel rounded-3xl p-4 sm:p-5 text-slate-100 border border-white/20 shadow-2xl backdrop-blur-2xl space-y-3.5 relative overflow-hidden">
        
        {/* Glow accent */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: color }}
        />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${color}25`, borderColor: `${color}60` }}
            >
              <Thermometer className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">
                  Inspección Térmica de Superficie
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                  Sensor TIRS
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Punto muestreado en tiempo real
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Temperature Highlight Section */}
        <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded-2xl border border-white/10 shadow-inner">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Temperatura Superficial (LST)
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black font-mono tracking-tight" style={{ color }}>
                {temperature !== null ? temperature.toFixed(1) : '--.-'}
              </span>
              <span className="text-base font-bold text-slate-300">°C</span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border shadow-sm ${classification.badgeClass}`}
            >
              {classification.category}
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              Δ vs Media: {(temperature - 30.2 > 0 ? '+' : '') + (temperature - 30.2).toFixed(1)}°C
            </span>
          </div>
        </div>

        {/* Thermal Bar Relative to Scale */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-slate-400">
            <span>19.0°C (Mín)</span>
            <span className="text-amber-300 font-semibold">30.2°C (Media)</span>
            <span>43.0°C (Máx)</span>
          </div>
          <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
            {/* Spectral colormap background */}
            <div
              className="h-full rounded-full"
              style={{
                background:
                  'linear-gradient(to right, #0000bf 0%, #00ffff 33%, #ffff00 66%, #bf0000 100%)',
              }}
            />
            {/* Value marker indicator */}
            <div
              className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] -translate-x-1"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-xl border border-white/5">
            {isBuilding ? (
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Mountain className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <div>
              <span className="text-[9px] text-slate-400 block">Tipo de Elemento</span>
              <span className="text-white font-semibold text-[10px]">
                {isBuilding ? 'Edificación 3D' : 'Terreno (MDE)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-xl border border-white/5">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 block">Altitud Topográfica</span>
              <span className="text-cyan-300 font-bold text-[10px]">
                {altitudeMsnm} msnm
              </span>
            </div>
          </div>
        </div>

        {/* Description & Impact */}
        <div className="flex items-start gap-2 text-[10px] text-slate-300/90 leading-snug bg-slate-900/50 p-2 rounded-xl border border-white/5">
          <Info className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
          <p>{classification.description}</p>
        </div>

      </div>
    </div>
  );
}
