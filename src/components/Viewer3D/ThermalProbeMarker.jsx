import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Thermometer, X, Building2, Mountain } from 'lucide-react';

export default function ThermalProbeMarker({ probeData, onClose }) {
  const ringRef = useRef();
  const pinRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.2);
    }
    if (pinRef.current) {
      pinRef.current.position.y = Math.sin(t * 3) * 0.15 + 0.3;
    }
  });

  if (!probeData || !probeData.point) return null;

  const [x, y, z] = probeData.point;
  const color = probeData.classification?.colorHex || '#f97316';
  const temp = probeData.temperature;

  return (
    <group position={[x, y, z]}>
      {/* Ground ripple ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[0.6, 0.75, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>

      {/* Floating 3D pin pointer */}
      <group ref={pinRef}>
        {/* Glow Sphere */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>

        {/* Pin cone stem pointing down */}
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.15, 0.7, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>

      {/* 3D Floating Tooltip HTML Overlay */}
      <Html
        position={[0, 1.6, 0]}
        center
        distanceFactor={35}
        zIndexRange={[100, 0]}
      >
        <div className="pointer-events-auto select-none transition-all duration-300 transform -translate-y-2">
          <div className="glass-panel p-3.5 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl text-white min-w-[220px] max-w-[240px] space-y-2.5">
            
            {/* Header with Close */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-lg flex items-center justify-center shadow-md"
                  style={{ backgroundColor: `${color}30`, borderColor: color }}
                >
                  <Thermometer className="w-3 h-3" style={{ color }} />
                </div>
                <span className="text-[11px] font-bold tracking-wide text-slate-100">
                  Identificador Térmico
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Cerrar identificador"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main Temperature Display */}
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono tracking-tight" style={{ color }}>
                  {temp !== null ? temp.toFixed(1) : '--.-'}
                </span>
                <span className="text-sm font-bold text-slate-300">°C</span>
              </div>
              
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${probeData.classification.badgeClass}`}
              >
                {probeData.classification.category}
              </span>
            </div>

            {/* Compact Thermal Progress Bar */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[8px] font-mono text-slate-400">
                <span>19°C</span>
                <span className="text-amber-300">Media 30.2°C</span>
                <span>43°C</span>
              </div>
              <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full rounded-full"
                  style={{
                    background:
                      'linear-gradient(to right, #0000bf 0%, #00ffff 33%, #ffff00 66%, #bf0000 100%)',
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.9)] -translate-x-0.5"
                  style={{
                    left: `${Math.min(100, Math.max(0, ((temp - 19) / 24) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Metadata (Object type & Altitude) */}
            <div className="text-[10px] font-mono text-slate-300 space-y-1 bg-slate-950/60 p-2 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  {probeData.isBuilding ? (
                    <Building2 className="w-3 h-3 text-amber-400" />
                  ) : (
                    <Mountain className="w-3 h-3 text-blue-400" />
                  )}
                  Elemento:
                </span>
                <span className="font-semibold text-slate-200">
                  {probeData.isBuilding ? 'Edificación' : 'Terreno MDE'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Altitud:</span>
                <span className="text-cyan-400 font-bold">
                  {probeData.altitudeMsnm} msnm
                </span>
              </div>
            </div>

          </div>
        </div>
      </Html>
    </group>
  );
}
