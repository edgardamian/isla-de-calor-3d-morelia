import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Viewer Error Caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-6 text-center text-slate-100">
          <div className="max-w-md w-full glass-panel rounded-3xl p-6 border border-orange-500/30 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mx-auto text-orange-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h2 className="text-xl font-bold text-white">
              Error al inicializar el Visor 3D
            </h2>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              El navegador móvil requiere reiniciar el contexto WebGL para cargar la geometría 3D de Morelia.
            </p>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors shadow-lg shadow-orange-500/30"
            >
              <RotateCcw className="w-4 h-4" />
              Recargar Visor
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
