import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function SceneEnvironment({
  sunTime = 11.1, // Decimal hours (e.g. 11.1 = 11:06 AM)
  enableShadows = true,
}) {
  const targetObjectRef = useRef(new THREE.Object3D());

  // Continuous solar trajectory & atmospheric calculation:
  // Evaluates realistic sun arc across Morelia (19.7°N) from 06:00 (Sunrise) to 20:00 (Sunset/Twilight)
  const solarState = useMemo(() => {
    const t = Math.max(6.0, Math.min(20.0, sunTime));
    const progress = (t - 6.0) / (20.0 - 6.0); // 0 (06:00) to 1 (20:00)

    // Solar Elevation & Azimuth 3D coordinates
    // Sun rises in the East (x < 0), reaches maximum elevation near 13:00 (Zenith), sets in the West (x > 0)
    const sinArc = Math.sin(progress * Math.PI);
    const cosArc = Math.cos(progress * Math.PI);

    const x = cosArc * -48.0; // East to West trajectory
    const y = Math.max(9.0, sinArc * 58.0 + 6.0); // Sun elevation (keeps sun above horizon to prevent detached shadows)
    const z = sinArc * 20.0 + 16.0; // Southern sky bias for Northern Hemisphere

    // Fill light from opposite direction for atmospheric bounce
    const fillX = -x * 0.7;
    const fillY = Math.max(12.0, y * 0.5);
    const fillZ = -z * 0.7;

    // Atmospheric color interpolation based on solar elevation
    // BackSide shadow casting allows razor-sharp definition (shadowRadius: 0) while locking shadows flush against building base (zero gap)
    let dirColor = '#fffbeb';
    let dirIntensity = 3.3;
    let ambientIntensity = 0.20;
    let fillColor = '#93c5fd';
    let fillIntensity = 0.06;
    let skyColor = '#030712';
    let shadowBias = -0.00001;
    let shadowNormalBias = 0.0001;
    let shadowRadius = 0; // 100% defined, crisp architectural shadows

    if (t < 8.0) {
      // Early morning / Dawn (06:00 - 08:00)
      const morningAlpha = (t - 6.0) / 2.0;
      dirColor = '#ffedd5';
      dirIntensity = 2.9 + morningAlpha * 0.4;
      ambientIntensity = 0.16 + morningAlpha * 0.05;
      fillColor = '#7dd3fc';
      fillIntensity = 0.06;
      skyColor = '#0a0f1d';
      shadowBias = -0.000015;
      shadowNormalBias = 0.0001;
      shadowRadius = 0;
    } else if (t >= 8.0 && t <= 12.0) {
      // Landsat Morning Pass (08:00 - 12:00)
      dirColor = '#fffbeb';
      dirIntensity = 3.35;
      ambientIntensity = 0.20;
      fillColor = '#93c5fd';
      fillIntensity = 0.06;
      skyColor = '#030712';
      shadowBias = -0.00001;
      shadowNormalBias = 0.0001;
      shadowRadius = 0;
    } else if (t > 12.0 && t < 15.0) {
      // Solar Noon / Zenith (12:00 - 15:00)
      dirColor = '#ffffff';
      dirIntensity = 3.4;
      ambientIntensity = 0.24;
      fillColor = '#cbd5e1';
      fillIntensity = 0.05;
      skyColor = '#020617';
      shadowBias = -0.00001;
      shadowNormalBias = 0.00008;
      shadowRadius = 0;
    } else if (t >= 15.0 && t <= 18.0) {
      // Late Afternoon (15:00 - 18:00)
      dirColor = '#fed7aa';
      dirIntensity = 3.3;
      ambientIntensity = 0.18;
      fillColor = '#a855f7';
      fillIntensity = 0.08;
      skyColor = '#070b16';
      shadowBias = -0.000012;
      shadowNormalBias = 0.0001;
      shadowRadius = 0;
    } else {
      // Sunset & Twilight (18:00 - 20:00)
      const sunsetAlpha = (t - 18.0) / 2.0;
      dirColor = '#fdba74';
      dirIntensity = 3.4 - sunsetAlpha * 0.5;
      ambientIntensity = 0.16 - sunsetAlpha * 0.04;
      fillColor = '#c084fc';
      fillIntensity = 0.08;
      skyColor = '#0c0a1f';
      shadowBias = -0.000015;
      shadowNormalBias = 0.0001;
      shadowRadius = 0;
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

      {/* Target object at city center */}
      <primitive object={targetObjectRef.current} position={[0, 0, 0]} />

      {/* Primary Directional Light (Sol enfocado y anclado a la base de los edificios sin desprendimiento) */}
      <directionalLight
        position={solarState.dirPosition}
        target={targetObjectRef.current}
        intensity={solarState.dirIntensity}
        color={solarState.dirColor}
        castShadow={enableShadows}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
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
        intensity={0.15}
      />
    </>
  );
}



