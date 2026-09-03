import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { getIsMobile } from '../../utils/deviceDetection';

export default function SceneEnvironment({
  sunTime = 7.0, // Decimal hours (e.g. 7.0 = 07:00 AM)
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
    // SOMBRAS VECTORIALES CONTINUAS: shadowRadius (1.3) con PCFSoftShadowMap proyecta líneas rectas continuas sin escalones de píxel ("serruchos")
    let dirColor = '#fffbeb';
    let dirIntensity = 3.5;
    let ambientIntensity = 0.12; // Sombra sólida y oscura para análisis de calles sin sol
    let fillColor = '#93c5fd';
    let fillIntensity = 0.03;
    let skyColor = '#030712';
    let shadowBias = -0.00001;
    let shadowNormalBias = 0.0001;
    let shadowRadius = 1.3;      // Suavizado sub-píxel: convierte los serruchos en líneas rectas continuas del edificio

    if (t < 8.0) {
      // Early morning / Dawn (06:00 - 08:00)
      const morningAlpha = (t - 6.0) / 2.0;
      dirColor = '#ffedd5';
      dirIntensity = 3.1 + morningAlpha * 0.4;
      ambientIntensity = 0.10 + morningAlpha * 0.03;
      fillColor = '#7dd3fc';
      fillIntensity = 0.03;
      skyColor = '#0a0f1d';
      shadowBias = -0.000012;
      shadowNormalBias = 0.0001;
      shadowRadius = 1.3;
    } else if (t >= 8.0 && t <= 12.0) {
      // Landsat Morning Pass (08:00 - 12:00)
      dirColor = '#fffbeb';
      dirIntensity = 3.55;
      ambientIntensity = 0.12;
      fillColor = '#93c5fd';
      fillIntensity = 0.03;
      skyColor = '#030712';
      shadowBias = -0.00001;
      shadowNormalBias = 0.0001;
      shadowRadius = 1.3;
    } else if (t > 12.0 && t < 15.0) {
      // Solar Noon / Zenith (12:00 - 15:00)
      dirColor = '#ffffff';
      dirIntensity = 3.6;
      ambientIntensity = 0.15;
      fillColor = '#cbd5e1';
      fillIntensity = 0.03;
      skyColor = '#020617';
      shadowBias = -0.00001;
      shadowNormalBias = 0.00008;
      shadowRadius = 1.3;
    } else if (t >= 15.0 && t <= 18.0) {
      // Late Afternoon (15:00 - 18:00)
      dirColor = '#fed7aa';
      dirIntensity = 3.5;
      ambientIntensity = 0.11;
      fillColor = '#a855f7';
      fillIntensity = 0.04;
      skyColor = '#070b16';
      shadowBias = -0.00001;
      shadowNormalBias = 0.0001;
      shadowRadius = 1.3;
    } else {
      // Sunset & Twilight (18:00 - 20:00)
      const sunsetAlpha = (t - 18.0) / 2.0;
      dirColor = '#fdba74';
      dirIntensity = 3.5 - sunsetAlpha * 0.5;
      ambientIntensity = 0.09 - sunsetAlpha * 0.02;
      fillColor = '#c084fc';
      fillIntensity = 0.04;
      skyColor = '#0c0a1f';
      shadowBias = -0.000012;
      shadowNormalBias = 0.0001;
      shadowRadius = 1.3;
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

  const isMobile = getIsMobile();

  return (
    <>
      <color attach="background" args={[solarState.skyColor]} />
      <fog attach="fog" args={[solarState.skyColor, 150, 480]} />
      <ambientLight intensity={isMobile ? 0.35 : solarState.ambientIntensity} />

      {/* Target object at city center */}
      <primitive object={targetObjectRef.current} position={[0, 0, 0]} />

      {/* Primary Directional Light */}
      <directionalLight
        position={solarState.dirPosition}
        target={targetObjectRef.current}
        intensity={solarState.dirIntensity}
        color={solarState.dirColor}
        castShadow={enableShadows && !isMobile}
        shadow-mapSize-width={isMobile ? 512 : 2048}
        shadow-mapSize-height={isMobile ? 512 : 2048}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
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
        intensity={isMobile ? 0.22 : 0.06}
      />
    </>
  );
}



