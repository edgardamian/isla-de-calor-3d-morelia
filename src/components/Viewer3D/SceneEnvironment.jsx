import React from 'react';

export default function SceneEnvironment({ lightingPreset = 'landsatReal' }) {
  // Real solar position calculated from Landsat metadata:
  // Elevación Solar: 53.70°, Azimut: 145.28° (2025-10-19 11:06:02)
  const presets = {
    landsatReal: {
      ambientIntensity: 0.6,
      dirPosition: [20.2, 48.4, 29.2], // Real Landsat Sun Angle
      dirIntensity: 1.85,
      dirColor: '#fffbeb',
      fillIntensity: 0.35,
      fillPosition: [-20.2, 25, -29.2],
      skyColor: '#030712',
    },
    midday: {
      ambientIntensity: 0.65,
      dirPosition: [25, 45, 25],
      dirIntensity: 1.8,
      dirColor: '#ffffff',
      fillIntensity: 0.4,
      fillPosition: [-25, 25, -25],
      skyColor: '#030712',
    },
    sunset: {
      ambientIntensity: 0.5,
      dirPosition: [40, 18, 12],
      dirIntensity: 2.2,
      dirColor: '#fed7aa',
      fillIntensity: 0.5,
      fillPosition: [-25, 15, -25],
      skyColor: '#0b0f19',
    },
    thermalStudio: {
      ambientIntensity: 0.8,
      dirPosition: [0, 50, 15],
      dirIntensity: 1.4,
      dirColor: '#f8fafc',
      fillIntensity: 0.5,
      fillPosition: [0, -10, 0],
      skyColor: '#020617',
    },
  };

  const current = presets[lightingPreset] || presets.landsatReal;

  return (
    <>
      <color attach="background" args={[current.skyColor]} />
      <fog attach="fog" args={[current.skyColor, 140, 450]} />

      <ambientLight intensity={current.ambientIntensity} />

      {/* Primary Directional Light (Landsat Real Sun Angle: Azim 145.28°, Elev 53.70°) */}
      <directionalLight
        position={current.dirPosition}
        intensity={current.dirIntensity}
        color={current.dirColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={180}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0003}
        shadow-radius={2}
      />

      {/* Secondary Fill light */}
      <directionalLight
        position={current.fillPosition}
        intensity={current.fillIntensity}
        color="#93c5fd"
      />

      {/* Hemisphere sky bounce */}
      <hemisphereLight
        skyColor="#60a5fa"
        groundColor="#0f172a"
        intensity={0.35}
      />
    </>
  );
}
