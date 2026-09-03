import React, { useState } from 'react';
import {
  Monitor,
  Share2,
  Copy,
  Check,
  Flame,
  MessageCircle,
  ExternalLink,
  Layers,
  Sun,
  MousePointer,
} from 'lucide-react';

export default function MobileUnsupportedNotice() {
  const [copied, setCopied] = useState(false);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://github.com/edgardamian/isla-de-calor-3d-morelia';
  const shareTitle = 'Isla de Calor Urbana 3D - Morelia';
  const shareMessage = `Isla de Calor Urbana 3D - Ciudad de Morelia (Gemelo Digital). Abre este enlace en tu computadora (PC o laptop): ${pageUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: 'Explora el Gemelo Digital 3D de la Isla de Calor de Morelia en tu computadora:',
          url: pageUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pageUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  const handleWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between p-5 sm:p-8 overflow-y-auto font-sans select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
              Isla de Calor Urbana 3D
            </h1>
            <p className="text-[11px] text-slate-400">
              Ciudad de Morelia • Gemelo Digital
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/15 border border-orange-500/40 text-orange-300">
          Solo en PC
        </span>
      </header>

      {/* Main Notice Card */}
      <main className="relative z-10 my-auto py-6 max-w-md mx-auto w-full text-center space-y-6">
        {/* Animated PC Monitor Graphic */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500 to-sky-500 opacity-20 blur-xl animate-pulse" />
          <div className="relative p-6 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-xl">
            <Monitor className="w-14 h-14 text-orange-400 mx-auto" />
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/30 rounded-full px-3 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              Experiencia de Escritorio
            </div>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Disponible para Computadoras
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed text-justify sm:text-center">
            Este visualizador 3D procesa un modelo de alta resolución con más de <strong className="text-orange-400">11.6 millones de geometrías</strong> y análisis térmico satelital en tiempo real.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Para garantizar fluidez y rendimiento gráfico, abre esta aplicación desde tu <strong className="text-white">computadora de escritorio o laptop</strong> (Chrome, Edge, Firefox, Safari o Brave).
          </p>
        </div>

        {/* Feature Highlights on PC */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3.5 text-left space-y-2.5 text-xs text-slate-300 shadow-inner">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Modelo 3D interactivo con más de 100,000 edificios</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-red-400 shrink-0" />
            <span>Diagnóstico térmico Landsat e islas de calor críticas</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Simulación de sombras y asoleamiento solar dinámico</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MousePointer className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Inspección con clic derecho de temperatura superficial</span>
          </div>
        </div>

        {/* Action Buttons: Share & Save for later */}
        <div className="space-y-2.5 pt-2">
          {/* Native System Share Button (WhatsApp, Messages, AirDrop, etc.) */}
          <button
            onClick={handleNativeShare}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir para abrir después en mi PC</span>
          </button>

          {/* Quick Direct Sharing Options Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp Direct */}
            <button
              onClick={handleWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar enlace</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pt-4 border-t border-white/10 text-center">
        <p className="text-[10px] text-slate-500 leading-tight">
          Instituto Municipal de Planeación de Morelia (IMPLAN)
        </p>
        <p className="text-[9px] text-slate-600">
          Laboratorio de Información Geográfica y Análisis Espacial
        </p>
      </footer>
    </div>
  );
}
