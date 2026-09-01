import React from 'react';

export default function SceneEnvironment({
  lightingPreset = 'landsatReal',
  enableShadows = true,
}) {
  // Solar lighting presets:
  // 1. sunrise (Amanecer): Sol bajo en el Este (07:30 AM), sombras largas hacia el Poniente, luz cálida dorada/rosada.
  // 2. landsatReal (Paso del Satélite): Ángulo real Landsat 8/9 & Sentinel-2 (11:06 AM, Elev: 53.7°, Azim: 145.3° Sureste).
  // 3. zenith (Cenital): Sol vertical 90° (Mediodía solar 13:00 PM), sombras mínimas directamente bajo cornisas, lectura térmica limpia.
  // 4. sunset (Atardecer): Sol bajo en el Oeste (18:45 PM), sombras dramáticas hacia el Oriente, tono ambarino y rojizo.
  const presets = {
    sunrise: {
      name: 'Amanecer',
      time: '07:30 AM',
      ambientIntensity: 0.45,
      dirPosition: [-48, 18, 30], // Sol bajo en el Oriente (Este)
      dirIntensity: 2.1,
      dirColor: '#ffedd5', // Luz cálida matutina dorada
      fillIntensity: 0.4,
      fillPosition: [40, 25, -20],
      fillColor: '#7dd3fc', // Relleno azul fresco matutino
      hemiSky: '#93c5fd',
      hemiGround: '#1e293b',
      hemiIntensity: 0.35,
      skyColor: '#0a0f1d',
      shadowBias: -0.0003,
      shadowRadius: 3,
    },
    landsatReal: {
      name: 'Paso del Satélite',
      time: '11:06 AM',
      ambientIntensity: 0.55,
      dirPosition: [20.2, 48.4, 29.2], // Ángulo solar real Landsat (Sureste)
      dirIntensity: 1.95,
      dirColor: '#fffbeb', // Luz solar natural brillante
      fillIntensity: 0.35,
      fillPosition: [-20.2, 25, -29.2],
      fillColor: '#93c5fd',
      hemiSky: '#60a5fa',
      hemiGround: '#0f172a',
      hemiIntensity: 0.35,
      skyColor: '#030712',
      shadowBias: -0.00025,
      shadowRadius: 2.5,
    },
    zenith: {
      name: 'Cenital (Mediodía)',
      time: '13:00 PM',
      ambientIntensity: 0.7,
      dirPosition: [0, 65, 5], // Sol directamente arriba en la vertical (90°)
      dirIntensity: 2.0,
      dirColor: '#ffffff', // Luz blanca pura cenital de máxima fidelidad
      fillIntensity: 0.25,
      fillPosition: [0, -10, 0],
      fillColor: '#cbd5e1',
      hemiSky: '#94a3b8',
      hemiGround: '#1e293b',
      hemiIntensity: 0.4,
      skyColor: '#020617',
      shadowBias: -0.0002,
      shadowRadius: 2,
    },
    sunset: {
      name: 'Atardecer',
      time: '18:45 PM',
      ambientIntensity: 0.4,
      dirPosition: [48, 15, -25], // Sol bajo en el Poniente (Oeste)
      dirIntensity: 2.3,
      dirColor: '#fdba74', // Tonalidad ámbar / dorada profunda
      fillIntensity: 0.45,
      fillPosition: [-40, 20, 20],
      fillColor: '#c084fc', // Relleno crepuscular violeta/azul
      hemiSky: '#f472b6',
      hemiGround: '#0f172a',
      hemiIntensity: 0.3,
      skyColor: '#0c0a1f',
      shadowBias: -0.00035,
      shadowRadius: 3.5,
    },
  };

  const current = presets[lightingPreset] || presets.landsatReal;

  return (
    <>
      <color attach="background" args={[current.skyColor]} />
      <fog attach="fog" args={[current.skyColor, 150, 480]} />

      <ambientLight intensity={current.ambientIntensity} />

      {/* Primary Directional Light (Sol principal con proyección de sombras de alta resolución) */}
      <directionalLight
        position={current.dirPosition}
        intensity={current.dirIntensity}
        color={current.dirColor}
        castShadow={enableShadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-camera-left={-48}
        shadow-camera-right={48}
        shadow-camera-top={48}
        shadow-camera-bottom={-48}
        shadow-bias={current.shadowBias}
        shadow-normalBias={0.03}
        shadow-radius={current.shadowRadius}
      />

      {/* Secondary Atmospheric Fill light */}
      <directionalLight
        position={current.fillPosition}
        intensity={current.fillIntensity}
        color={current.fillColor}
      />

      {/* Hemisphere sky bounce */}
      <hemisphereLight
        skyColor={current.hemiSky}
        groundColor={current.hemiGround}
        intensity={current.hemiIntensity}
      />
    </>
  );
}

