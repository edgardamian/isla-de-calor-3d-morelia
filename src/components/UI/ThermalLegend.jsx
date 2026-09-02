import React, { useState } from 'react';
import { Thermometer, ChevronDown, ChevronUp } from 'lucide-react';

export default function ThermalLegend() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-20 pointer-events-auto max-w-xs sm:max-w-md">
      <div className="glass-panel rounded-2xl p-4 text-slate-100 border border-white/15 shadow-2xl backdrop-blur-xl transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">
                Escala Térmica LST
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                19.0°C – 45.0°C
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isExpanded ? 'Contraer leyenda' : 'Expandir leyenda'}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Exact QGIS h5/jet Thermal Gradient Bar (16 Interpolated Stops) */}
        <div className="space-y-1.5">
          <div
            className="h-3.5 w-full rounded-full p-0.5 shadow-inner border border-white/25"
            style={{
              background:
                'linear-gradient(to right, #0000bf 0%, #0000ff 6.7%, #003fff 13.3%, #007fff 20%, #00bfff 26.7%, #00ffff 33.3%, #3fffff 40%, #7fffbf 46.7%, #bfff7f 53.3%, #ffff3f 60%, #ffff00 66.7%, #ffbf00 73.3%, #ff7f00 80%, #ff3f00 86.7%, #ff0000 93.3%, #bf0000 100%)',
            }}
          />

          {/* Temperature Tick Labels */}
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-200 font-semibold px-0.5">
            <span className="text-[#00bfff] font-bold">19.0°C</span>
            <span className="text-[#00ffff]">24.2°C</span>
            <span className="text-[#7fffbf]">29.4°C</span>
            <span className="text-[#ffff00]">34.6°C</span>
            <span className="text-[#ff7f00]">39.8°C</span>
            <span className="text-[#ef4444] font-bold">45.0°C</span>
          </div>
        </div>

        {/* Detailed Legend Info */}
        {isExpanded && (
          <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1 text-[11px] leading-snug">
            <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0000bf] border border-white/30"></span>
                <span>Mínima (19.0°C)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffff00]"></span>
                <span>Media (31.1°C)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#bf0000] border border-white/30"></span>
                <span>Máxima (45.0°C)</span>
              </span>
            </div>
            <div className="text-[9px] text-slate-400 pt-1 border-t border-white/5 flex items-center justify-between font-mono">
              <span>Resolución Espacial: 30m</span>
              <span className="text-cyan-400">16 Rangos Térmicos</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
