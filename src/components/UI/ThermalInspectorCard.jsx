import React from 'react';
import {
  Thermometer,
  Building2,
  Mountain,
  X,
  Compass,
  Info,
} from 'lucide-react';

export default function ThermalInspectorCard({ probeData, onClose }) {
  if (!probeData) return null;

  const {
    temperature,
    isBuilding,
    altitudeMsnm,
    classification,
  } = probeData;

  const color = classification?.colorHex || '#f97316';
  const progressPercent = Math.min(
    100,
    Math.max(0, ((temperature - 19.0) / (45.0 - 19.0)) * 100)
  );

  return (
    <div className="fixed bottom-4 right-4 z-30 pointer-events-auto w-[calc(100vw-2rem)] sm:w-80 max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-250">
      <div className="glass-panel rounded-2xl p-3.5 text-slate-100 border border-white/20 shadow-2xl backdrop-blur-2xl space-y-2.5 relative overflow-hidden">
        
        {/* Glow accent */}
        <div
          className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-25 pointer-events-none"
          style={{ backgroundColor: color }}
        />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shadow-md shrink-0"
              style={{ backgroundColor: `${color}25`, borderColor: `${color}60` }}
            >
              <Thermometer className="w-3.5 h-3.5" style={{ color }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">
                  Identificador Térmico
                </span>
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1 py-0.2 rounded border border-cyan-500/20">
                  LST
                </span>
              </div>
              <p className="text-[9px] text-slate-400">
                Punto seleccionado en tiempo real
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="Cerrar identificador"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Temperature Highlight Section */}
        <div className="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-xl border border-white/10 shadow-inner">
          <div>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">
              Temperatura Superficie
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-mono tracking-tight" style={{ color }}>
                {temperature !== null ? temperature.toFixed(1) : '--.-'}
              </span>
              <span className="text-xs font-bold text-slate-300">°C</span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border shadow-sm ${classification.badgeClass}`}
            >
              {classification.category}
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              Δ vs Media: {(temperature - 31.1 > 0 ? '+' : '') + (temperature - 31.1).toFixed(1)}°C
            </span>
          </div>
        </div>

        {/* Thermal Bar Relative to Scale with Exact 16-Stop Calibrated Colormap */}
        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-mono text-slate-300 font-medium">
            <span className="text-[#00bfff] font-bold">19.0°C</span>
            <span className="text-[#ffff00]">Media 31.1°C</span>
            <span className="text-[#ef4444] font-bold">45.0°C</span>
          </div>
          <div className="relative h-2.5 w-full bg-slate-900 rounded-full p-0.5 border border-white/20 shadow-inner">
            <div
              className="h-full rounded-full w-full"
              style={{
                background:
                  'linear-gradient(to right, #0000bf 0%, #0000ff 6.7%, #003fff 13.3%, #007fff 20%, #00bfff 26.7%, #00ffff 33.3%, #3fffff 40%, #7fffbf 46.7%, #bfff7f 53.3%, #ffff3f 60%, #ffff00 66.7%, #ffbf00 73.3%, #ff7f00 80%, #ff3f00 86.7%, #ff0000 93.3%, #bf0000 100%)',
              }}
            />
            {/* Position indicator bead */}
            <div
              className="absolute -top-0.5 bottom-0 w-2.5 h-3.5 bg-white rounded-full border border-slate-900 shadow-[0_0_8px_rgba(255,255,255,1)] -translate-x-1/2 transition-all duration-150"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 bg-slate-950/50 p-1.5 rounded-xl border border-white/5">
            {isBuilding ? (
              <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <Mountain className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            )}
            <div className="truncate">
              <span className="text-[8px] text-slate-400 block">Elemento</span>
              <span className="text-white font-semibold text-[9px] truncate">
                {isBuilding ? 'Edificación' : 'Terreno MDE'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/50 p-1.5 rounded-xl border border-white/5">
            <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[8px] text-slate-400 block">Altitud</span>
              <span className="text-cyan-300 font-bold text-[9px]">
                {altitudeMsnm} msnm
              </span>
            </div>
          </div>
        </div>

        {/* Concise Description */}
        <div className="flex items-start gap-1.5 text-[9px] text-slate-300/90 leading-tight bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
          <Info className="w-3 h-3 text-orange-400 shrink-0 mt-0.5" />
          <p>{classification.description}</p>
        </div>

      </div>
    </div>
  );
}
