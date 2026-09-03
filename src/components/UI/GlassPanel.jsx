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
  ChevronDown,
  ChevronRight,
  Mountain,
  Sparkles,
  Palette,
  Clock,
  Play,
  Pause,
  AlertTriangle,
} from 'lucide-react';
import HeatPersonSilhouette from './HeatPersonSilhouette';
import HeatIslandConceptModal from './HeatIslandConceptModal';

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
  sunTime = 7.0,
  onChangeSunTime,
  isPlayingShadows = false,
  onTogglePlayShadows,
  shadowSpeed = 1,
  onChangeShadowSpeed,
  enableShadows = true,
  onToggleShadows,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSolarOpen, setIsSolarOpen] = useState(false); // Collapsed by default
  const [showConceptModal, setShowConceptModal] = useState(false);

  return (
    <aside
      className={`fixed top-4 left-4 z-30 transition-all duration-500 ease-in-out pointer-events-auto ${
        isCollapsed
          ? 'w-14 h-14'
          : 'w-[calc(100vw-2rem)] sm:w-96 max-h-[calc(100vh-2rem)]'
      }`}
    >
      {/* Collapsed State Toggle Button */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-14 h-14 rounded-2xl glass-panel bg-slate-900/90 flex items-center justify-center text-orange-400 shadow-2xl hover:scale-105 transition-transform border border-orange-500/30 p-2"
          title="Expandir Panel Informativo"
        >
          <HeatPersonSilhouette className="w-10 h-10" animated={true} />
        </button>
      )}

      {/* Expanded Main Glass Panel */}
      {!isCollapsed && (
        <div className="w-full max-h-[calc(100vh-2rem)] overflow-y-auto glass-panel rounded-3xl p-5 sm:p-6 text-slate-100 flex flex-col gap-4 border border-white/15 shadow-2xl backdrop-blur-xl scrollbar-thin">
          
          {/* Header Section */}
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-orange-500/40 flex items-center justify-center shadow-lg shadow-orange-500/20 p-1">
                  <HeatPersonSilhouette className="w-10 h-10" animated={false} />
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
                  Ciudad de Morelia • Gemelo Digital v1.0.1-2026.09
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

          {/* Button: ¿Qué es una Isla de Calor? */}
          <button
            onClick={() => setShowConceptModal(true)}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-500/40 text-orange-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>¿Qué es una Isla de Calor?</span>
          </button>

          {/* ======================================================== */}
          {/* 1. HERRAMIENTA DE CONTROL DE TEXTURAS Y CAPAS 3D          */}
          {/* ======================================================== */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/70 border border-orange-500/20 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <label className="text-[11px] font-semibold text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-orange-400" />
                Texturas y Capas 3D
              </label>
              <span className="text-[10px] font-mono text-cyan-400">
                19.0°C – 45.0°C
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
                        ? 'bg-blue-600/30 border border-blue-400 text-white font-semibold shadow-sm'
                        : 'glass-button text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Mountain className={`w-3.5 h-3.5 ${mdeTextureMode === 'topography' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>Relieve Base</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Buildings Texture Controls */}
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
                  title={showBuildings ? 'Ocultar Edificaciones' : 'Mostrar Edificaciones'}
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
                    title="Textura térmica continua proyectada"
                  >
                    <Flame className={`w-3.5 h-3.5 ${buildingTextureMode === 'thermal' ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span>Térmico</span>
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

          {/* ======================================================== */}
          {/* 2. PERSPECTIVAS DE CÁMARA                                */}
          {/* ======================================================== */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              Perspectivas de Cámara
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'isometric', label: 'Isométrica', icon: Compass },
                { id: 'topDown', label: 'Cenital', icon: Grid },
                { id: 'frontal', label: 'Perfil Sur', icon: Building2 },
                { id: 'lateral', label: 'Perfil Oriente', icon: Layers },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPreset(p.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl text-xs font-medium transition-all border ${
                      isSelected
                        ? 'bg-orange-500/20 border-orange-500/50 text-white shadow-md shadow-orange-500/10'
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

          {/* ======================================================== */}
          {/* 3. HERRAMIENTAS DE EXAGERACIÓN VERTICAL                  */}
          {/* ======================================================== */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            
            {/* 1. Exageración Relieve Topográfico */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-blue-400" />
                  Relieve Topográfico (MDE)
                </label>
                <span className="text-[10px] font-mono text-cyan-400">
                  {elevationScale.toFixed(1)}x
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
                    onClick={() => onChangeElevationScale(item.val)}
                    className={`py-1.5 px-1.5 rounded-lg text-[11px] font-medium transition-all text-center ${
                      elevationScale === item.val
                        ? 'bg-blue-500/30 border border-blue-500/60 text-white shadow-sm font-semibold'
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

          {/* ======================================================== */}
          {/* 5. HERRAMIENTAS DE EXPLORACIÓN                           */}
          {/* ======================================================== */}
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
          {/* 6. SIMULACIÓN SOLAR Y ANIMACIÓN DE SOMBRAS 3D (BETA)     */}
          {/*    (Última herramienta, plegada por defecto)             */}
          {/* ======================================================== */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => setIsSolarOpen(!isSolarOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-white/10 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  Simulador Solar & Sombras
                </span>
                <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40 uppercase">
                  Beta
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-300 hidden sm:inline">
                  {formatSolarTime(sunTime)}
                </span>
                {isSolarOpen ? (
                  <ChevronDown className="w-4 h-4 text-amber-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {isSolarOpen && (
              <div className="space-y-2.5 p-3 rounded-2xl bg-slate-950/80 border border-amber-500/20 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px] font-semibold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Hora Solar Simulada
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30 flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {formatSolarTime(sunTime)}
                  </span>
                </div>

                {/* Time Slider (06:00 AM to 08:00 PM in 1-minute steps) */}
                <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
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
                      title="Desliza para cambiar la hora solar"
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
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${enableShadows ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'}`}>
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-200">Sistema de Sombras 3D</p>
                      <p className="text-[9px] text-slate-400">Oclusión y relieve</p>
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
            )}
          </div>

        </div>
      )}

      {/* Heat Island Concept Scientific Modal */}
      <HeatIslandConceptModal
        isOpen={showConceptModal}
        onClose={() => setShowConceptModal(false)}
      />
    </aside>
  );
}
