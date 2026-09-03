import React, { useState } from 'react';
import {
  Monitor,
  Share2,
  Copy,
  Check,
  Flame,
  MessageCircle,
  Layers,
  Sun,
  Maximize2,
  X,
  Sparkles,
  AlertTriangle,
  Mail,
} from 'lucide-react';
import HeatIslandConceptModal from './HeatIslandConceptModal';
import HeatPersonSilhouette from './HeatPersonSilhouette';

export default function MobileUnsupportedNotice() {
  const [copied, setCopied] = useState(false);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);

  const previewImg = `${import.meta.env.BASE_URL}img/imagen_escritorio.png`;
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
        // Cancelled by user
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
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto font-sans select-none">
      {/* Background ambient glowing spheres */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3.5 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-slate-900/90 border border-orange-500/40 flex items-center justify-center shadow-lg shadow-orange-500/20 p-1">
              <HeatPersonSilhouette className="w-8 h-8" animated={false} />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
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

        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/15 border border-orange-500/40 text-orange-300 flex items-center gap-1">
          <Monitor className="w-3 h-3" />
          Solo en PC
        </span>
      </header>

      {/* Main Notice Card */}
      <main className="relative z-10 my-3 max-w-lg mx-auto w-full space-y-3.5 text-center">
        {/* Title and explanation */}
        <div className="space-y-1.5 pt-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Disponible para Computadoras
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            Esta plataforma procesa más de <strong className="text-orange-400">11.6 millones de geometrías 3D</strong> y análisis térmico satelital. Para un rendimiento óptimo, está diseñada para abrirse en <strong className="text-white">computadoras de escritorio o laptops</strong>.
          </p>
        </div>

        {/* Button: ¿Qué es una Isla de Calor? */}
        <div>
          <button
            onClick={() => setShowConceptModal(true)}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-500/40 text-orange-200 font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>¿Qué es una Isla de Calor?</span>
          </button>
        </div>

        {/* Desktop Screenshot Preview Window Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-slate-900/90 shadow-2xl backdrop-blur-xl group">
          {/* Mock Browser/Window Title Bar */}
          <div className="bg-slate-900/95 px-3 py-2 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[180px]">
              isla-de-calor-3d-morelia (PC)
            </span>
            <button
              onClick={() => setShowFullscreenImage(true)}
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[10px] text-orange-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <Maximize2 className="w-2.5 h-2.5" />
              <span>Pantalla completa</span>
            </button>
          </div>

          {/* Actual Desktop Capture Image with click to fullscreen */}
          <div
            className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden cursor-pointer"
            onClick={() => setShowFullscreenImage(true)}
            title="Toca para ver en pantalla completa"
          >
            <img
              src={previewImg}
              alt="Captura real de la aplicación en computadora de escritorio"
              className="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Live Preview Pill Tag */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-white/20 text-white text-[10px] font-medium backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <Monitor className="w-3 h-3 text-orange-400" />
                Vista previa real en PC / Laptop
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-orange-500/80 text-white font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                <Maximize2 className="w-2.5 h-2.5" />
                Ver grande
              </span>
            </div>
          </div>
        </div>

        {/* Feature Highlights with user specified labels */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3 text-left grid grid-cols-2 gap-2 text-[11px] text-slate-300 shadow-inner">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate">100,000+ edificios 3D</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate">Temperatura superficial</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Ciclo solar dinámico</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate">Áreas afectadas representativas</span>
          </div>
        </div>

        {/* Action Buttons: Share & Save for later */}
        <div className="space-y-2 pt-1">
          {/* Native System Share Button (WhatsApp, Messages, AirDrop, etc.) */}
          <button
            onClick={handleNativeShare}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir para abrir después en mi PC</span>
          </button>

          {/* Quick Direct Sharing Options Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp Direct */}
            <button
              onClick={handleWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">¡Copiado!</span>
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

      {/* Fullscreen Screenshot Modal */}
      {showFullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col p-3 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto select-none"
          onClick={() => setShowFullscreenImage(false)}
        >
          <div className="flex items-center justify-between p-2 text-white border-b border-white/15">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-orange-400" />
              Captura Real • Versión de Escritorio (PC / Laptop)
            </span>
            <button
              onClick={() => setShowFullscreenImage(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-2 overflow-auto">
            <img
              src={previewImg}
              alt="Captura de pantalla de la versión de escritorio en pantalla completa"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Heat Island Concept Scientific Modal */}
      <HeatIslandConceptModal
        isOpen={showConceptModal}
        onClose={() => setShowConceptModal(false)}
      />

      {/* Footer with user credentials & identity logo */}
      <footer className="relative z-10 pt-3 border-t border-white/10 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900/90 border border-orange-500/40 flex items-center justify-center shadow-md p-1 shrink-0">
            <HeatPersonSilhouette className="w-7 h-7" animated={true} showSweat={true} />
          </div>
          <div className="text-left space-y-0.5">
            <p className="text-xs font-bold text-slate-200 leading-tight">
              Edgar Mora D.
            </p>
            <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
              <a
                href="mailto:edgar.mora.d@gmail.com"
                className="hover:text-orange-400 transition-colors underline underline-offset-2 flex items-center gap-1"
              >
                <Mail className="w-3 h-3 text-orange-400" />
                edgar.mora.d@gmail.com
              </a>
              <span>•</span>
              <span className="text-slate-300 font-medium">@edgar_rllr</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
