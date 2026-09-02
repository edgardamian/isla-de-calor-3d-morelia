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
      {/* Top Center Discreet Instruction Pill */}
      {!hasProbeSelection && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/80 border border-white/15 text-slate-200 text-xs shadow-xl backdrop-blur-md animate-in fade-in duration-300">
          <Thermometer className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span>
            Haz <strong className="text-orange-400">clic derecho</strong> sobre el terreno o edificios para consultar la temperatura
          </span>
        </div>
      )}

      {/* Top Right Floating Toolbar */}
      <div className="fixed top-4 right-4 z-20 pointer-events-auto flex items-center gap-2">
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
          title="Guía de Navegación e Instrucciones"
        >
          <HelpCircle className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* Navigation Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Instrucciones y Controles 3D
                  </h3>
                  <p className="text-xs text-slate-400">
                    Uso del Identificador Térmico y Navegación
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

            {/* Step-by-step Thermal Identifier Guide */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-950/40 to-slate-900/60 border border-orange-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500 text-white uppercase tracking-wider">
                  Identificador Térmico LST
                </span>
                <span className="text-[10px] text-orange-300 font-mono">¿Cómo usarlo?</span>
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>
                  <strong className="text-white">Muestreo Instantáneo:</strong> Haz <span className="text-orange-400 font-bold">clic derecho</span> sobre cualquier edificación o relieve para medir su temperatura en °C y altitud.
                </li>
                <li>
                  <strong className="text-white">Auto-Apagado de Máxima Fluidez:</strong> En cuanto gires la rueda del ratón (zoom) o arrastres para moverte, el pin y la tarjeta se ocultan de inmediato para mantener 60 FPS estables.
                </li>
              </ol>
            </div>

            {/* Instruction cards */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <MousePointer className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Rotar Cámara (Órbita)</p>
                  <p className="text-slate-400">Clic primario (izquierdo) + arrastrar.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Move className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Desplazar / Paneo</p>
                  <p className="text-slate-400">Shift + arrastrar o arrastrar con clic derecho.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ZoomIn className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Acercar / Alejar (Zoom)</p>
                  <p className="text-slate-400">Rueda de desplazamiento del ratón.</p>
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
