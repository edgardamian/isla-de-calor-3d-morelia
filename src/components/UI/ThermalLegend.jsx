import React, { useState } from 'react';
import {
  Thermometer,
  ChevronDown,
  ChevronUp,
  Satellite,
  Clock,
  CloudSun,
  Mountain,
  Layers,
  Box,
  Compass,
  TrendingUp,
} from 'lucide-react';

export default function ThermalLegend({ modelStats }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-30 pointer-events-auto w-[calc(100vw-2rem)] sm:w-96 max-w-md animate-in fade-in duration-300">
      <div className="glass-panel rounded-3xl p-4 text-slate-100 border border-white/15 shadow-2xl backdrop-blur-xl transition-all space-y-2.5 max-h-[80vh] overflow-y-auto scrollbar-thin">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Thermometer className="w-4 h-4 text-orange-400" />
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
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
            title={isExpanded ? 'Contraer metadatos' : 'Desplegar metadatos satelitales y del modelo'}
          >
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              {isExpanded ? 'Ocultar' : 'Metadatos'}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-orange-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-400" />
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

        {/* Comprehensive Metadata Section (Displayed only when expanded) */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-3 text-xs animate-in fade-in duration-200">
            
            {/* 1. Quantitative Thermal LST Metrics */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                  Métricas Térmicas LST
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  19.0°C – 45.0°C
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-950/40 to-slate-900/60 border border-red-500/20 flex flex-col justify-between">
                  <span className="text-[10px] text-red-300/80 font-medium">Temp. Máxima</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold text-red-400 font-mono">45.0</span>
                    <span className="text-xs text-red-300 font-semibold">°C</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900/60 border border-amber-500/20 flex flex-col justify-between">
                  <span className="text-[10px] text-amber-300/80 font-medium">Temp. Promedio</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold text-amber-400 font-mono">31.1</span>
                    <span className="text-xs text-amber-300 font-semibold">°C</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-950/30 to-slate-900/60 border border-blue-500/20 flex flex-col justify-between">
                  <span className="text-[10px] text-blue-300/80 font-medium">Temp. Mínima</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold text-blue-400 font-mono">19.0</span>
                    <span className="text-xs text-blue-300 font-semibold">°C</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-950/30 to-slate-900/60 border border-purple-500/20 flex flex-col justify-between">
                  <span className="text-[10px] text-purple-300/80 font-medium">Rango Térmico (ΔT)</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold text-purple-400 font-mono">26.0</span>
                    <span className="text-xs text-purple-300 font-semibold">°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Satellite Image Metadata */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-300 border-b border-white/5 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                  Captura Satelital Landsat 8/9
                </span>
                <span className="text-emerald-400 font-mono text-[10px]">Sensor TIRS (B10)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="flex flex-col bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <span className="text-slate-400 flex items-center gap-1 text-[9px]">
                    <Clock className="w-3 h-3 text-orange-400" />
                    Fecha y Hora UTC
                  </span>
                  <span className="text-white font-bold mt-0.5">2025-10-19</span>
                  <span className="text-slate-400 text-[9px]">11:06:02 CST</span>
                </div>

                <div className="flex flex-col bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <span className="text-slate-400 flex items-center gap-1 text-[9px]">
                    <CloudSun className="w-3 h-3 text-cyan-400" />
                    Nubosidad
                  </span>
                  <span className="text-emerald-400 font-bold mt-0.5">0.02 %</span>
                  <span className="text-slate-400 text-[9px]">Cielo Despejado</span>
                </div>

                <div className="flex flex-col bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[9px]">Elevación Solar</span>
                  <span className="text-amber-300 font-bold mt-0.5">53.70 °</span>
                </div>

                <div className="flex flex-col bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[9px]">Azimut Solar</span>
                  <span className="text-amber-300 font-bold mt-0.5">145.28 °</span>
                </div>
              </div>
            </div>

            {/* 3. Topography & MDE Elevation Metadata */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-blue-300 border-b border-white/5 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-blue-400" />
                  Topografía y Modelo de Elevación (MDE)
                </span>
                <span className="text-cyan-400 font-mono text-[10px]">INEGI 5m</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="flex flex-col bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[9px]">Extensión Geográfica</span>
                  <span className="text-white font-bold mt-0.5">
                    {modelStats ? `${modelStats.realWidthKm} × ${modelStats.realDepthKm} km` : '26.2 × 17.7 km'}
                  </span>
                  <span className="text-slate-400 text-[9px]">Área Metropolitana</span>
                </div>

                <div className="flex flex-col bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[9px]">Desnivel Topográfico (ΔZ)</span>
                  <span className="text-emerald-400 font-bold mt-0.5">
                    {modelStats ? `${modelStats.elevationDeltaM} m` : '270 m'}
                  </span>
                  <span className="text-slate-400 text-[9px]">Gradiente Vertical</span>
                </div>

                <div className="flex flex-col bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[9px]">Altitud Mínima</span>
                  <span className="text-cyan-300 font-bold mt-0.5">1,880 msnm</span>
                  <span className="text-slate-400 text-[9px]">Valle de Morelia</span>
                </div>

                <div className="flex flex-col bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[9px]">Altitud Máxima</span>
                  <span className="text-orange-300 font-bold mt-0.5">2,150 msnm</span>
                  <span className="text-slate-400 text-[9px]">Cumbres y Cerros</span>
                </div>
              </div>
            </div>

            {/* 4. 3D Mesh & Rendering Geometry Details */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-purple-300 border-b border-white/5 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-purple-400" />
                  Métricas del Modelo 3D
                </span>
                <span className="text-purple-400 font-mono text-[10px]">WebGL 2.0</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="flex flex-col bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[9px]">Polígonos / Triángulos</span>
                  <span className="text-white font-bold mt-0.5">
                    {modelStats?.triangleCount ? modelStats.triangleCount.toLocaleString() : '340,000'}
                  </span>
                </div>

                <div className="flex flex-col bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[9px]">Mallas 3D</span>
                  <span className="text-white font-bold mt-0.5">
                    {modelStats?.meshCount || 2} Mallas Principales
                  </span>
                  <span className="text-slate-400 text-[9px]">MDE + Edificaciones</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
