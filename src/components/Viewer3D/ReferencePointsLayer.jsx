import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MapPin } from 'lucide-react';
import { wgs84To3DLocal, BASELINE_ELEVATION_Y } from '../../utils/geoProjection';

const GEOJSON_URL = `${import.meta.env.BASE_URL}data/puntos_referencia.geojson`;

export default function ReferencePointsLayer({
  visible = true,
  mdeMeshes = [],
  onSelectPoint,
  activePoint = null,
  hasSelection = false,
}) {
  const [geoData, setGeoData] = useState(null);
  const [labelScale, setLabelScale] = useState(1.0);
  const lastScaleRef = useRef(1.0);

  // Smooth zoom-out label scale: gently shrinks as camera moves away so labels don't overlap
  useFrame(({ camera }) => {
    const dist = camera.position.length();
    // At close zoom (< 30): 1.05. At distance 60: ~0.95. At far zoom (> 120): ~0.74.
    const targetScale = THREE.MathUtils.clamp(1.06 - (dist - 25) * 0.003, 0.72, 1.06);
    if (Math.abs(targetScale - lastScaleRef.current) > 0.02) {
      lastScaleRef.current = targetScale;
      setLabelScale(Number(targetScale.toFixed(2)));
    }
  });

  // Fetch GeoJSON
  useEffect(() => {
    let isMounted = true;
    fetch(GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted) setGeoData(data);
      })
      .catch((err) => console.warn('Could not load puntos_referencia.geojson:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute 3D positions with terrain height sampling
  const processedPoints = useMemo(() => {
    if (!geoData || !geoData.features) return [];

    const raycaster = new THREE.Raycaster();
    const down = new THREE.Vector3(0, -1, 0);

    return geoData.features.map((feature, idx) => {
      const [lng, lat] = feature.geometry.coordinates;
      const [x, z] = wgs84To3DLocal(lng, lat);

      let y = BASELINE_ELEVATION_Y;
      if (mdeMeshes && mdeMeshes.length > 0) {
        raycaster.set(new THREE.Vector3(x, 4000, z), down);
        const hits = raycaster.intersectObjects(mdeMeshes, false);
        if (hits.length > 0) {
          y = hits[0].point.y;
        }
      }

      return {
        id: feature.properties.fid || `pt-${idx}`,
        name: feature.properties.nombre || `Punto ${idx + 1}`,
        feature,
        position: [x, y, z],
        x,
        y,
        z,
      };
    });
  }, [geoData, mdeMeshes]);

  if (!visible || processedPoints.length === 0) return null;

  return (
    <group>
      {processedPoints.map((pt) => {
        const isSelected = activePoint?.id === pt.id;
        const isDimmed = hasSelection && !isSelected;
        // Elevated beacon height so labels float above rooftops and terrain ridges
        const beaconHeight = 50;
        const needleLength = beaconHeight + 35; // Extends continuously into the terrain

        return (
          <group key={pt.id} position={[pt.x, pt.y, pt.z]} renderOrder={isSelected ? 100 : 0}>
            {/* Vertical glowing beacon needle - continuous clean line from pin down into the terrain */}
            <mesh position={[0, beaconHeight - needleLength / 2, 0]}>
              <cylinderGeometry args={[isSelected ? 0.95 : (isDimmed ? 0.35 : 0.55), isSelected ? 0.95 : (isDimmed ? 0.35 : 0.55), needleLength, 8]} />
              <meshBasicMaterial
                color={isSelected ? '#7dd3fc' : '#38bdf8'}
                transparent
                opacity={isSelected ? 0.95 : (isDimmed ? 0.18 : 0.75)}
              />
            </mesh>

            {/* Pin head sphere */}
            <mesh position={[0, beaconHeight, 0]}>
              <sphereGeometry args={[isSelected ? 4.2 : (isDimmed ? 2.2 : 2.8), 16, 16]} />
              <meshBasicMaterial
                color={isSelected ? '#38bdf8' : '#0ea5e9'}
                transparent={isDimmed}
                opacity={isDimmed ? 0.25 : 1.0}
              />
            </mesh>

            {/* Proportional HTML Badge - Selected item is in front; unselected items are dimmed */}
            <Html
              position={[0, beaconHeight + 9, 0]}
              center
              zIndexRange={isSelected ? [15, 25] : [0, 0]}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectPoint) onSelectPoint(pt);
                }}
                style={{
                  transform: `scale(${isSelected ? Math.max(0.9, labelScale * 1.15) : (isDimmed ? labelScale * 0.95 : labelScale)})`,
                  transformOrigin: 'center bottom',
                  opacity: isDimmed ? 0.35 : 1.0,
                  zIndex: isSelected ? 50 : 1,
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 whitespace-nowrap cursor-pointer select-none border ${
                  isSelected
                    ? 'bg-sky-500 text-white border-2 border-white shadow-sky-500/70 ring-4 ring-sky-400/50'
                    : 'bg-slate-950/90 hover:bg-slate-900 border-sky-400/40 text-sky-200 hover:text-white shadow-black/80'
                }`}
                title={`Ver ${pt.name}`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-sky-400'} shrink-0`} />
                <span>{pt.name}</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
