import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function SceneEnvironment({
  sunTime = 11.1, // Decimal hours (e.g. 11.1 = 11:06 AM)
  enableShadows = true,
}) {
  // Continuous solar trajectory & atmospheric calculation:
  // Evaluates realistic sun arc across Morelia (19.7°N) from 06:00 (Sunrise) to 20:00 (Sunset/Twilight)
  const solarState = useMemo(() => {
    const t = Math.max(6.0, Math.min(20.0, sunTime));
    const progress = (t - 6.0) / (20.0 - 6.0); // 0 (06:00) to 1 (20:00)

    // Solar Elevation & Azimuth 3D coordinates
    // Sun rises in the East (x < 0), reaches maximum elevation near 13:00 (Zenith), sets in the West (x > 0)
    const sinArc = Math.sin(progress * Math.PI);
    const cosArc = Math.cos(progress * Math.PI);

    const x = cosArc * -52.0; // East to West trajectory
    const y = Math.max(6.0, sinArc * 62.0 + 4.0); // Sun elevation
    const z = sinArc * 20.0 + 16.0; // Southern sky bias for Northern Hemisphere

    // Fill light from opposite direction for atmospheric bounce
    const fillX = -x * 0.7;
    const fillY = Math.max(12.0, y * 0.5);
    const fillZ = -z * 0.7;

    // Atmospheric color interpolation based on solar elevation
    // Dawn / Sunrise: Golden-rose
    // Landsat Morning: Bright natural crisp white
    // Zenith / Midday: Pure neutral white
    // Sunset: Deep amber-orange
    let dirColor = '#fffbeb';
    let dirIntensity = 1.95;
    let ambientIntensity = 0.55;
    let fillColor = '#93c5fd';
    let fillIntensity = 0.35;
    let skyColor = '#030712';
    let shadowBias = -0.00025;
    let shadowRadius = 2.5;

    if (t < 8.0) {
      // Early morning / Dawn (06:00 - 08:00)
      const morningAlpha = (t - 6.0) / 2.0;
      dirColor = '#ffedd5';
      dirIntensity = 1.6 + morningAlpha * 0.4;
      ambientIntensity = 0.38 + morningAlpha * 0.15;
      fillColor = '#7dd3fc';
      fillIntensity = 0.35;
      skyColor = '#0a0f1d';
      shadowBias = -0.00035;
      shadowRadius = 3.5;
    } else if (t >= 8.0 && t <= 12.0) {
      // Landsat Morning Pass (08:00 - 12:00)
      dirColor = '#fffbeb';
      dirIntensity = 1.95;
      ambientIntensity = 0.55;
      fillColor = '#93c5fd';
      fillIntensity = 0.35;
      skyColor = '#030712';
      shadowBias = -0.00025;
      shadowRadius = 2.5;
    } else if (t > 12.0 && t < 15.0) {
      // Solar Noon / Zenith (12:00 - 15:00)
      dirColor = '#ffffff';
      dirIntensity = 2.05;
      ambientIntensity = 0.65;
      fillColor = '#cbd5e1';
      fillIntensity = 0.28;
      skyColor = '#020617';
      shadowBias = -0.0002;
      shadowRadius = 2.0;
    } else if (t >= 15.0 && t <= 18.0) {
      // Late Afternoon (15:00 - 18:00)
      const afternoonAlpha = (t - 15.0) / 3.0;
      dirColor = '#fed7aa';
      dirIntensity = 2.1;
      ambientIntensity = 0.5;
      fillColor = '#a855f7';
      fillIntensity = 0.4;
      skyColor = '#070b16';
      shadowBias = -0.0003;
      shadowRadius = 3.0;
    } else {
      // Sunset & Twilight (18:00 - 20:00)
      const sunsetAlpha = (t - 18.0) / 2.0;
      dirColor = '#fdba74';
      dirIntensity = 2.2 - sunsetAlpha * 0.5;
      ambientIntensity = 0.42 - sunsetAlpha * 0.1;
      fillColor = '#c084fc';
      fillIntensity = 0.45;
      skyColor = '#0c0a1f';
      shadowBias = -0.0004;
      shadowRadius = 4.0;
    }

    return {
      dirPosition: [x, y, z],
      dirIntensity,
      dirColor,
      fillPosition: [fillX, fillY, fillZ],
      fillIntensity,
      fillColor,
      ambientIntensity,
      skyColor,
      shadowBias,
      shadowRadius,
    };
  }, [sunTime]);

  return (
    <>
      <color attach="background" args={[solarState.skyColor]} />
      <fog attach="fog" args={[solarState.skyColor, 150, 480]} />

      <ambientLight intensity={solarState.ambientIntensity} />

      {/* Primary Directional Light (Sol dinámico continuo con sombras animadas en tiempo real) */}
      <directionalLight
        position={solarState.dirPosition}
        intensity={solarState.dirIntensity}
        color={solarState.dirColor}
        castShadow={enableShadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-camera-left={-48}
        shadow-camera-right={48}
        shadow-camera-top={48}
        shadow-camera-bottom={-48}
        shadow-bias={solarState.shadowBias}
        shadow-normalBias={0.03}
        shadow-radius={solarState.shadowRadius}
      />

      {/* Secondary Atmospheric Fill light */}
      <directionalLight
        position={solarState.fillPosition}
        intensity={solarState.fillIntensity}
        color={solarState.fillColor}
      />

      {/* Hemisphere sky bounce */}
      <hemisphereLight
        skyColor={solarState.fillColor}
        groundColor="#0f172a"
        intensity={0.35}
      />
    </>
  );
}


