import React, { useState } from 'react';
import {
  RotateCcw,
  Flame,
  Layers,
  Compass,
  Eye,
  EyeOff,
  Sun,
  Sunrise,
  Sunset,
  Satellite,
  Grid,
  TrendingUp,
  Building2,
  ChevronLeft,
  Mountain,
  Sparkles,
  Palette,
  Clock,
  Play,
  Pause,
  CloudSun,
} from 'lucide-react';

function formatSolarTime(decimalHours) {
  const totalMinutes = Math.round(decimalHours * 60);
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const padHours = String(hours12).padStart(2, '0');
  const padMinutes = String(minutes).padStart(2, '0');
  return `${padHours}:${padMinutes} ${period}`;
}

export default function GlassPanel({
  onResetView,
  activePreset,
  onSelectPreset,
  autoRotate,
  onToggleAutoRotate,
  wireframe,
  onToggleWireframe,
  elevationScale,
  onChangeElevationScale,
  buildingHeightScale,
  onChangeBuildingHeightScale,
  showMDE,
  onToggleShowMDE,
  mdeTextureMode,
  onChangeMDETextureMode,
  showBuildings,
  onToggleShowBuildings,
  buildingTextureMode,
  onChangeBuildingTextureMode,
  lightingPreset,
  onSelectLighting,
  sunTime = 11.1,
  onChangeSunTime,
  isPlayingShadows = false,
  onTogglePlayShadows,
  shadowSpeed = 1,
  onChangeShadowSpeed,
  enableShadows = true,
  onToggleShadows,
  modelStats,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-4 left-4 z-20 transition-all duration-500 ease-in-out pointer-events-auto ${
        isCollapsed
          ? 'w-14 h-14'
          : 'w-[calc(100vw-2rem)] sm:w-96 max-h-[calc(100vh-2rem)]'
      }`}
    >
      {/* Collapsed State Toggle Button */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-orange-400 shadow-2xl hover:scale-105 transition-transform border border-white/20"
          title="Expandir Panel Informativo"
        >
          <Flame className="w-7 h-7 animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
        </button>
      )}

      {/* Expanded Main Glass Panel */}
      {!isCollapsed && (
        <div className="w-full max-h-[calc(100vh-2rem)] overflow-y-auto glass-panel rounded-3xl p-5 sm:p-6 text-slate-100 flex flex-col gap-4 border border-white/15 shadow-2xl backdrop-blur-xl scrollbar-thin">
          
          {/* Header Section */}
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
                  <Satellite className="w-3 h-3" />
                  Landsat • LST Calibrado
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                  Isla de Calor Urbana
                </h1>
                <p className="text-xs font-medium text-orange-300/80">
                  Morelia, Michoacán
                </p>
              </div>
            </div>

            {/* Collapse button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Minimizar panel"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Satellite Capture Metadata Card */}
          <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 border-b border-white/5 pb-1.5">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Satellite className="w-3.5 h-3.5" />
                Metadatos de Captura Satelital
              </span>
              <span className="text-emerald-400 font-mono">Sensor TIRS</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex flex-col bg-slate-950/50 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-400" />
                  Fecha / Hora
                </span>
                <span className="text-white font-bold mt-0.5">2025-10-19</span>
                <span className="text-slate-400 text-[9px]">11:06:02</span>
              </div>

              <div className="flex flex-col bg-slate-950/50 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 flex items-center gap-1">
                  <CloudSun className="w-3 h-3 text-cyan-400" />
                  Nubosidad
                </span>
                <span className="text-emerald-400 font-bold mt-0.5">0.02 %</span>
                <span className="text-slate-400 text-[9px]">Cielo Despejado</span>
              </div>

              <div className="flex flex-col bg-slate-950/50 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400">Elevación Solar</span>
                <span className="text-amber-300 font-bold mt-0.5">53.70 °</span>
              </div>

              <div className="flex flex-col bg-slate-950/50 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400">Azimut Solar</span>
                <span className="text-amber-300 font-bold mt-0.5">145.28 °</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* HERRAMIENTA DE CONTROL DE TEXTURAS Y CAPAS 3D            */}
          {/* ======================================================== */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/70 border border-orange-500/20 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <label className="text-[11px] font-semibold text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-orange-400" />
                Texturas y Capas 3D
              </label>
              <span className="text-[10px] font-mono text-cyan-400">
                19.0°C – 43.0°C
              </span>
            </div>

            {/* 1. MDE (Terreno) Texture Controls */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-blue-400" />
                  Terreno (MDE)
                </span>
                <button
                  onClick={onToggleShowMDE}
                  className={`p-1 rounded-lg transition-colors flex items-center gap-1 text-[10px] ${
                    showMDE ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 bg-slate-800'
                  }`}
                  title={showMDE ? 'Ocultar Terreno' : 'Mostrar Terreno'}
                >
                  {showMDE ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showMDE ? 'Visible' : 'Oculto'}</span>
                </button>
              </div>

              {showMDE && (
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    onClick={() => onChangeMDETextureMode('thermal')}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                      mdeTextureMode === 'thermal'
                        ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 border border-orange-500/50 text-white font-semibold shadow-sm'
                        : 'glass-button text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${mdeTextureMode === 'thermal' ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span>Térmica LST</span>
                  </button>

                  <button
                    onClick={() => onChangeMDETextureMode('topography')}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                      mdeTextureMode === 'topography'
                        ? 'bg-blue-500/30 border border-blue-500/50 text-white font-semibold shadow-sm'
                        : 'glass-button text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Mountain className={`w-3.5 h-3.5 ${mdeTextureMode === 'topography' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>Topografía</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Buildings Texture Controls (Térmica y Blanco) */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  Edificaciones 3D
                </span>
                <button
                  onClick={onToggleShowBuildings}
                  className={`p-1 rounded-lg transition-colors flex items-center gap-1 text-[10px] ${
                    showBuildings ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 bg-slate-800'
                  }`}
                  title={showBuildings ? 'Ocultar Edificios' : 'Mostrar Edificios'}
                >
                  {showBuildings ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showBuildings ? 'Visible' : 'Oculto'}</span>
                </button>
              </div>

              {showBuildings && (
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    onClick={() => onChangeBuildingTextureMode('thermal')}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                      buildingTextureMode === 'thermal'
                        ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 border border-orange-500/50 text-white font-semibold shadow-sm'
                        : 'glass-button text-slate-400 hover:text-slate-200'
                    }`}
                    title="Textura térmica original del modelo"
                  >
                    <Flame className={`w-3.5 h-3.5 ${buildingTextureMode === 'thermal' ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span>Térmica</span>
                  </button>

                  <button
                    onClick={() => onChangeBuildingTextureMode('architectural')}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                      buildingTextureMode === 'architectural'
                        ? 'bg-slate-200/30 border border-slate-300 text-white font-semibold shadow-sm'
                        : 'glass-button text-slate-400 hover:text-slate-200'
                    }`}
                    title="Blanco arquitectónico limpio con sombras"
                  >
                    <Building2 className={`w-3.5 h-3.5 ${buildingTextureMode === 'architectural' ? 'text-white' : 'text-slate-400'}`} />
                    <span>Blanco</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Perspective Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              Perspectivas de Cámara
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'isometric', label: 'Isométrica', icon: Compass },
                { id: 'topDown', label: 'Cenital / Planta', icon: Grid },
                { id: 'frontal', label: 'Rasante (Sur)', icon: Building2 },
                { id: 'lateral', label: 'Perfil (Oriente)', icon: Layers },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPreset(p.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-orange-500/25 border border-orange-500/50 text-white shadow-md shadow-orange-500/20'
                        : 'glass-button text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantitative Thermal Metrics */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                Métricas Térmicas LST
              </label>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                19.0°C – 43.0°C
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-950/40 to-slate-900/60 border border-red-500/20 flex flex-col justify-between">
                <span className="text-[10px] text-red-300/80 font-medium">Temp. Máxima</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-bold text-red-400 font-mono">43.0</span>
                  <span className="text-xs text-red-300 font-semibold">°C</span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900/60 border border-amber-500/20 flex flex-col justify-between">
                <span className="text-[10px] text-amber-300/80 font-medium">Temp. Promedio</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-bold text-amber-400 font-mono">30.2</span>
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
                  <span className="text-lg font-bold text-purple-300 font-mono">24.0</span>
                  <span className="text-xs text-purple-300 font-semibold">°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* HERRAMIENTAS DE EXAGERACIÓN VERTICAL                     */}
          {/* ======================================================== */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            
            {/* 1. Exageración Relieve Topográfico */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-blue-400" />
                  Relieve Topográfico (MDE)
                </label>
                <span className="text-[10px] font-mono text-blue-400">
                  {elevationScale.toFixed(1)}x
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { val: 1.0, label: '1.0x Real' },
                  { val: 1.5, label: '1.5x Medio' },
                  { val: 2.0, label: '2.0x Alto' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => onChangeElevationScale(item.val)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                      elevationScale === item.val
                        ? 'bg-blue-500/25 border border-blue-500/50 text-blue-200 shadow-sm font-semibold'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Exageración Altura de Edificios 3D */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  Altura de Edificaciones 3D
                </label>
                <span className="text-[10px] font-mono text-amber-400">
                  {buildingHeightScale.toFixed(1)}x
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { val: 1.0, label: '1.0x Real' },
                  { val: 1.5, label: '1.5x' },
                  { val: 2.5, label: '2.5x' },
                  { val: 4.0, label: '4.0x' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => onChangeBuildingHeightScale(item.val)}
                    className={`py-1.5 px-1.5 rounded-lg text-[11px] font-medium transition-all text-center ${
                      buildingHeightScale === item.val
                        ? 'bg-amber-500/25 border border-amber-500/50 text-amber-200 shadow-sm font-semibold'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Tools & Layer Toggles */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Herramientas de Exploración
            </label>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onToggleAutoRotate}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  autoRotate
                    ? 'bg-blue-500/25 border border-blue-500/50 text-white'
                    : 'glass-button text-slate-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'text-blue-400 animate-spin' : 'text-slate-400'}`} />
                  Auto-rotar
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${autoRotate ? 'bg-blue-500 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  {autoRotate ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                onClick={onToggleWireframe}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  wireframe
                    ? 'bg-purple-500/25 border border-purple-500/50 text-white'
                    : 'glass-button text-slate-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Grid className={`w-3.5 h-3.5 ${wireframe ? 'text-purple-400' : 'text-slate-400'}`} />
                  Malla 3D
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${wireframe ? 'bg-purple-500 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  {wireframe ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>

            {/* ======================================================== */}
            {/* SIMULACIÓN SOLAR Y ANIMACIÓN DE SOMBRAS 3D                */}
            {/* ======================================================== */}
            <div className="space-y-2.5 pt-1.5 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Simulador Solar & Sombras
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30 flex items-center gap-1 shadow-sm">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {formatSolarTime(sunTime)}
                </span>
              </div>

              {/* Time Slider (06:00 AM to 08:00 PM in 1-minute steps) */}
              <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-2xl border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>06:00 AM (Amanecer)</span>
                  <span>08:00 PM (Ocaso)</span>
                </div>

                <div className="relative flex items-center py-1">
                  <input
                    type="range"
                    min="6.0"
                    max="20.0"
                    step="0.016666"
                    value={sunTime}
                    onChange={(e) => onChangeSunTime(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 focus:outline-none"
                    title="Desliza para cambiar la hora y los minutos"
                  />
                </div>

                {/* Solar Animation Controls: Play/Pause and Speed */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <button
                    onClick={onTogglePlayShadows}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-md ${
                      isPlayingShadows
                        ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                        : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30'
                    }`}
                  >
                    {isPlayingShadows ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Animar Sombras</span>
                      </>
                    )}
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-slate-400 font-mono pr-0.5">Vel:</span>
                    {[1, 2, 4].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => onChangeShadowSpeed(spd)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          shadowSpeed === spd
                            ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Solar Preset Buttons */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'sunrise', label: 'Amanecer', time: '07:00 AM', icon: Sunrise, color: 'text-amber-300' },
                  { id: 'landsatReal', label: 'Paso Satélite', time: '11:06 AM', icon: Satellite, color: 'text-cyan-400' },
                  { id: 'zenith', label: 'Cenital', time: '01:00 PM', icon: Sun, color: 'text-yellow-300' },
                  { id: 'sunset', label: 'Atardecer', time: '06:45 PM', icon: Sunset, color: 'text-orange-400' },
                ].map((l) => {
                  const Icon = l.icon;
                  const isSelected = lightingPreset === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => onSelectLighting(l.id)}
                      className={`py-1.5 px-2 rounded-xl text-left transition-all border flex flex-col gap-0.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/25 to-orange-500/20 border-amber-500/50 text-white shadow-md shadow-amber-500/10'
                          : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          <Icon className={`w-3.5 h-3.5 ${l.color}`} />
                          {l.label}
                        </span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 pl-5">{l.time}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic 3D Shadows System Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${enableShadows ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'}`}>
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-200">Sistema de Sombras 3D</p>
                    <p className="text-[9px] text-slate-400">Oclusión y relieve de edificios</p>
                  </div>
                </div>

                <button
                  onClick={onToggleShadows}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                    enableShadows
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 shadow-sm'
                      : 'bg-slate-800 text-slate-500 hover:text-slate-300 border border-white/5'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${enableShadows ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span>{enableShadows ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

          {/* Model Technical Info Footer */}
          {modelStats && (
            <div className="text-[10px] font-mono text-slate-400 flex flex-col gap-1 border-t border-white/5 pt-2.5">
              <div className="flex items-center justify-between">
                <span>Extensión: {modelStats.realWidthKm} × {modelStats.realDepthKm} km</span>
                <span className="text-emerald-400/90">ΔZ: {modelStats.elevationDeltaM}m</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[9px]">
                <span>{modelStats.triangleCount?.toLocaleString()} polígonos</span>
                <span>{modelStats.meshCount} mallas 3D</span>
                <span className="text-cyan-400">WebGL 2.0</span>
              </div>
            </div>
          )}

        </div>
      )}
    </aside>
  );
}
