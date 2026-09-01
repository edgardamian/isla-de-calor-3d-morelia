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
    // High contrast for clearly defined architectural building shadows
    let dirColor = '#fffbeb';
    let dirIntensity = 2.9;
    let ambientIntensity = 0.25;
    let fillColor = '#93c5fd';
    let fillIntensity = 0.18;
    let skyColor = '#030712';
    let shadowBias = -0.0001;
    let shadowNormalBias = 0.04;
    let shadowRadius = 1.2;

    if (t < 8.0) {
      // Early morning / Dawn (06:00 - 08:00)
      const morningAlpha = (t - 6.0) / 2.0;
      dirColor = '#ffedd5';
      dirIntensity = 2.5 + morningAlpha * 0.4;
      ambientIntensity = 0.20 + morningAlpha * 0.08;
      fillColor = '#7dd3fc';
      fillIntensity = 0.18;
      skyColor = '#0a0f1d';
      shadowBias = -0.00015;
      shadowNormalBias = 0.05;
      shadowRadius = 1.5;
    } else if (t >= 8.0 && t <= 12.0) {
      // Landsat Morning Pass (08:00 - 12:00)
      dirColor = '#fffbeb';
      dirIntensity = 2.95;
      ambientIntensity = 0.26;
      fillColor = '#93c5fd';
      fillIntensity = 0.18;
      skyColor = '#030712';
      shadowBias = -0.0001;
      shadowNormalBias = 0.04;
      shadowRadius = 1.2;
    } else if (t > 12.0 && t < 15.0) {
      // Solar Noon / Zenith (12:00 - 15:00)
      dirColor = '#ffffff';
      dirIntensity = 3.1;
      ambientIntensity = 0.32;
      fillColor = '#cbd5e1';
      fillIntensity = 0.15;
      skyColor = '#020617';
      shadowBias = -0.0001;
      shadowNormalBias = 0.035;
      shadowRadius = 1.0;
    } else if (t >= 15.0 && t <= 18.0) {
      // Late Afternoon (15:00 - 18:00)
      dirColor = '#fed7aa';
      dirIntensity = 3.0;
      ambientIntensity = 0.24;
      fillColor = '#a855f7';
      fillIntensity = 0.2;
      skyColor = '#070b16';
      shadowBias = -0.00012;
      shadowNormalBias = 0.045;
      shadowRadius = 1.5;
    } else {
      // Sunset & Twilight (18:00 - 20:00)
      const sunsetAlpha = (t - 18.0) / 2.0;
      dirColor = '#fdba74';
      dirIntensity = 3.1 - sunsetAlpha * 0.5;
      ambientIntensity = 0.20 - sunsetAlpha * 0.05;
      fillColor = '#c084fc';
      fillIntensity = 0.22;
      skyColor = '#0c0a1f';
      shadowBias = -0.00018;
      shadowNormalBias = 0.055;
      shadowRadius = 1.8;
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
      shadowNormalBias,
      shadowRadius,
    };
  }, [sunTime]);

  return (
    <>
      <color attach="background" args={[solarState.skyColor]} />
      <fog attach="fog" args={[solarState.skyColor, 150, 480]} />

      <ambientLight intensity={solarState.ambientIntensity} />

      {/* Primary Directional Light (Sol dinámico de alta resolución para proyección nítida de sombras de edificios) */}
      <directionalLight
        position={solarState.dirPosition}
        intensity={solarState.dirIntensity}
        color={solarState.dirColor}
        castShadow={enableShadows}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={1}
        shadow-camera-far={240}
        shadow-camera-left={-38}
        shadow-camera-right={38}
        shadow-camera-top={38}
        shadow-camera-bottom={-38}
        shadow-bias={solarState.shadowBias}
        shadow-normalBias={solarState.shadowNormalBias}
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
        intensity={0.25}
      />
    </>
  );
}



