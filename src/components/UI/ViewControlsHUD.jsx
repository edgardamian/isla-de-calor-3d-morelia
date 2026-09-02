import React, { useState } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  HelpCircle,
  MousePointer,
  Move,
  ZoomIn,
  X,
  Compass,
  Thermometer,
} from 'lucide-react';

export default function ViewControlsHUD({
  onResetView,
  isProbeActive = true,
  onToggleProbe,
  hasProbeSelection = false,
  onClearProbe,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <>
      {/* Top Right Floating Toolbar */}
      <div className="fixed top-4 right-4 z-20 pointer-events-auto flex items-center gap-2">
        
        {/* Interactive Thermal Probe Toggle */}
        <button
          onClick={onToggleProbe}
          className={`p-2.5 rounded-2xl flex items-center gap-1.5 text-xs font-semibold shadow-xl transition-all border ${
            isProbeActive
              ? 'bg-gradient-to-r from-orange-500/25 to-red-500/25 border-orange-500/50 text-white shadow-orange-500/20'
              : 'glass-button text-slate-400 hover:text-white border-white/15'
          }`}
          title={isProbeActive ? 'Sonda Térmica Activa (Haz clic en un edificio/terreno)' : 'Activar Sonda Térmica'}
        >
          <Thermometer className={`w-4 h-4 ${isProbeActive ? 'text-orange-400 animate-pulse' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">{isProbeActive ? 'Sonda Activa' : 'Sonda'}</span>
        </button>

        {/* Reset View Quick Button */}
        <button
          onClick={onResetView}
          className="glass-button p-2.5 rounded-2xl text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-medium shadow-xl group border border-white/15"
          title="Restablecer Vista Isométrica"
        >
          <RotateCcw className="w-4 h-4 text-orange-400 group-hover:-rotate-90 transition-transform duration-500" />
          <span className="hidden sm:inline">Restablecer</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="glass-button p-2.5 rounded-2xl text-slate-300 hover:text-white shadow-xl border border-white/15"
          title={isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* Help & Navigation Modal Trigger */}
        <button
          onClick={() => setShowHelp(true)}
          className="glass-button p-2.5 rounded-2xl text-slate-300 hover:text-white shadow-xl border border-white/15"
          title="Guía de Navegación 3D"
        >
          <HelpCircle className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* Navigation Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Controles de Navegación 3D
                  </h3>
                  <p className="text-xs text-slate-400">
                    Interacción con el modelo topográfico
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction cards */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <MousePointer className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Rotar Cámara (Órbita)</p>
                  <p className="text-slate-400">Clic primario (izquierdo) + arrastrar o un dedo en pantallas táctiles.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Sonda Térmica LST</p>
                  <p className="text-slate-400">Haz clic sobre cualquier edificación o terreno para medir su temperatura en °C y altitud.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Move className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Desplazar / Paneo</p>
                  <p className="text-slate-400">Clic secundario (derecho) o Shift + arrastrar (dos dedos en táctil).</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ZoomIn className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Acercar / Alejar (Zoom)</p>
                  <p className="text-slate-400">Rueda de desplazamiento del ratón o pellizco en dispositivos móviles.</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
              <strong>Nota de restricción:</strong> El visor cuenta con un límite de ángulo polar para evitar pasar por debajo del relieve geográfico del modelo.
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 font-semibold text-xs text-white transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
