import React from 'react';
import { Flame, X, BookOpen, TreePine, Building2, Sun, Factory, Mail } from 'lucide-react';

export default function HeatIslandConceptModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 border border-white/20 shadow-2xl p-6 text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-red-500/20 to-orange-500/20 border border-red-500/40 text-red-400 shadow-lg shadow-red-500/10">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-snug">
                ¿Qué es una Isla de Calor?
              </h2>
              <p className="text-[11px] text-slate-400">
                Isla de Calor Urbana (ICU) • Marco Científico
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official User Provided Definition Block */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/30 via-slate-900 to-slate-950 border border-orange-500/30 text-xs leading-relaxed text-slate-200 space-y-2 shadow-inner">
          <div className="flex items-center gap-1.5 text-orange-400 text-[11px] font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Definición</span>
          </div>
          <p className="text-justify font-normal text-slate-200 leading-relaxed text-[12px]">
            El efecto conocido como <strong className="text-white font-semibold">isla de calor urbana (ICU)</strong> produce mayores temperaturas del aire y las superficies en el centro y en general en las zonas urbanizadas comparado con sus áreas suburbanas, rurales y naturales circundantes.
          </p>
          <p className="text-justify font-normal text-slate-200 leading-relaxed text-[12px]">
            Este fenómeno se relaciona principalmente con la <strong className="text-orange-300">alta densidad de urbanización</strong>, la <strong className="text-orange-300">alta absortancia de los materiales</strong> presentes en la ciudad, la <strong className="text-orange-300">escasez de espacios verdes</strong>, las características morfológicas de los <strong className="text-orange-300">cañones urbanos</strong>, y el <strong className="text-orange-300">calor antropogénico</strong> liberado.
          </p>
          <div className="pt-1 text-right">
            <span className="text-[10px] font-mono text-slate-400 italic bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
              (Alchapar et al., 2012; Oke et al., 1991)
            </span>
          </div>
        </div>

        {/* Key Determinant Factors Grid */}
        <div className="space-y-2 pt-1">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">
            Factores Clave del Fenómeno
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Densidad Urbana</strong>
                <span className="text-slate-400 text-[10px] leading-tight">Superficies impermeables y cantera/asfalto que almacenan radiación.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 flex items-start gap-2.5">
              <TreePine className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Falta de Áreas Verdes</strong>
                <span className="text-slate-400 text-[10px] leading-tight">Déficit de arbolado para amortiguamiento por evapotranspiración.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 flex items-start gap-2.5">
              <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Cañones Urbanos</strong>
                <span className="text-slate-400 text-[10px] leading-tight">Atrapamiento de calor entre muros y reducción del viento.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 flex items-start gap-2.5">
              <Factory className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Calor Antropogénico</strong>
                <span className="text-slate-400 text-[10px] leading-tight">Calor residual generado por vehículos, comercio e industria.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Author Personal Credits */}
        <div className="pt-2 border-t border-white/10 text-center space-y-1">
          <p className="text-xs font-semibold text-slate-200">
            Edgar Mora D.
          </p>
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
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

        {/* Close action */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            Entendido / Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
