import React from 'react';
import {
  Flame,
  X,
  AlertTriangle,
  Building,
  Thermometer,
  Trees,
  Navigation,
  Info,
} from 'lucide-react';

export default function AffectedAreaCard({ areaData, onClose, onFocusArea }) {
  if (!areaData || !areaData.properties) return null;

  const { nombre, tipo, causa1, causa2, causa3, est_mean, est_median, est_max } =
    areaData.properties;

  const causes = [causa1, causa2, causa3].filter(Boolean);

  const maxTemp = est_max || 38.0;
  const isExtreme = maxTemp >= 42.0;

  return (
    <div className="fixed bottom-5 right-4 z-40 w-[calc(100vw-2rem)] sm:w-80 pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="glass-panel rounded-2xl p-4 border border-red-500/30 bg-slate-950/90 text-slate-100 shadow-2xl backdrop-blur-2xl flex flex-col gap-3">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              isExtreme
                ? 'bg-red-500/25 border border-red-500/50 text-red-400 shadow-red-500/30'
                : 'bg-orange-500/25 border border-orange-500/50 text-orange-400 shadow-orange-500/25'
            }`}>
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400 text-[9px] font-bold uppercase tracking-wider">
                <AlertTriangle className="w-2.5 h-2.5" />
                {tipo || 'Área Afectada'}
              </div>
              <h2 className="text-sm font-bold text-white leading-tight mt-0.5">
                {nombre}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="Cerrar ficha"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Temperature Stats Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 flex flex-col items-center text-center">
            <span className="text-[9px] uppercase font-semibold text-red-300/80 flex items-center gap-0.5">
              <Thermometer className="w-2.5 h-2.5 text-red-400" />
              Máx
            </span>
            <span className="text-sm font-black text-red-400 mt-0.5">
              {est_max ? `${est_max.toFixed(1)}°C` : 'N/D'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-orange-950/30 border border-orange-500/20 flex flex-col items-center text-center">
            <span className="text-[9px] uppercase font-semibold text-orange-300/80">
              Media
            </span>
            <span className="text-sm font-black text-orange-300 mt-0.5">
              {est_mean ? `${est_mean.toFixed(1)}°C` : 'N/D'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/20 flex flex-col items-center text-center">
            <span className="text-[9px] uppercase font-semibold text-amber-300/80">
              Mediana
            </span>
            <span className="text-sm font-black text-amber-300 mt-0.5">
              {est_median ? `${est_median.toFixed(1)}°C` : 'N/D'}
            </span>
          </div>
        </div>

        {/* Physical Causes Section */}
        {causes.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Info className="w-3 h-3 text-orange-400" />
              Causas Antrópicas
            </label>
            <div className="flex flex-col gap-1 max-h-28 overflow-y-auto scrollbar-thin pr-0.5">
              {causes.map((causa, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-1.5 p-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-[11px] text-slate-200"
                >
                  <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                  <span className="leading-snug">{causa}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-white/10">
          {onFocusArea && (
            <button
              onClick={() => onFocusArea(areaData)}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-[11px] font-semibold shadow-md shadow-red-500/20 flex items-center justify-center gap-1 transition-all"
            >
              <Navigation className="w-3 h-3" />
              <span>Centrar Vista</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="py-1.5 px-3 rounded-xl glass-button text-[11px] text-slate-300 hover:text-white"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
