import React from 'react';
import {
  MapPin,
  X,
  Navigation,
  Compass,
  Mountain,
  Info,
} from 'lucide-react';
import { getReferencePointDescription } from '../../constants/referencePointDescriptions';

export default function ReferencePointCard({ pointData, onClose, onFocusPoint }) {
  if (!pointData) return null;

  const name = pointData.name || pointData.feature?.properties?.nombre || 'Punto de Referencia';
  const info = getReferencePointDescription(name);

  const coords = pointData.feature?.geometry?.coordinates;
  const lng = coords ? coords[0].toFixed(4) : null;
  const lat = coords ? coords[1].toFixed(4) : null;

  // Approximate elevation
  const alt = Math.round(pointData.y || 1925);

  return (
    <div className="fixed bottom-5 right-4 z-40 w-[calc(100vw-2rem)] sm:w-80 pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="glass-panel rounded-2xl p-4 border border-sky-400/40 bg-slate-950/90 text-slate-100 shadow-2xl backdrop-blur-2xl flex flex-col gap-3">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0 shadow-md text-sky-400 shadow-sky-500/20">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${info.badgeColor}`}>
                {info.category}
              </div>
              <h2 className="text-sm font-bold text-white leading-tight mt-0.5">
                {name}
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

        {/* Brief Description */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 text-xs text-slate-200 leading-relaxed">
          {info.desc}
        </div>

        {/* Geographic location details */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          {lat && lng && (
            <div className="p-2 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-2 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-mono text-[10px]">
                {lat}°N, {lng}°W
              </span>
            </div>
          )}

          <div className="p-2 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-2 text-slate-300">
            <Mountain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono text-[10px]">
              ~{alt} msnm
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-white/10">
          {onFocusPoint && (
            <button
              onClick={() => onFocusPoint(pointData)}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-[11px] font-semibold shadow-md shadow-sky-500/20 flex items-center justify-center gap-1 transition-all"
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
