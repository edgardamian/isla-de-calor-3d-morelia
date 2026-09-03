import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Flame, AlertTriangle } from 'lucide-react';
import {
  processPolygonGeometry,
  BASELINE_ELEVATION_Y,
} from '../../utils/geoProjection';

const GEOJSON_URL = `${import.meta.env.BASE_URL}data/areas_afectadas.geojson`;

export default function AffectedAreasLayer({
  visible = true,
  mdeMeshes = [],
  onSelectArea,
  activeArea = null,
  hasSelection = false,
}) {
  const [geoData, setGeoData] = useState(null);
  const [labelScale, setLabelScale] = useState(1.0);
  const lastScaleRef = useRef(1.0);

  // Smooth zoom-out label scale: gently shrinks as camera moves away so labels don't overlap
  useFrame(({ camera }) => {
    const dist = camera.position.length();
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
      .catch((err) => console.warn('Could not load areas_afectadas.geojson:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Process geometries: perimeter lines and centroids
  const processedAreas = useMemo(() => {
    if (!geoData || !geoData.features) return [];

    const raycaster = new THREE.Raycaster();
    const down = new THREE.Vector3(0, -1, 0);

    return geoData.features
      .map((feature, idx) => {
        const ringCoords = feature.geometry?.coordinates?.[0];
        if (!ringCoords) return null;

        const geomInfo = processPolygonGeometry(ringCoords);
        if (!geomInfo) return null;

        const [centerX, centerZ] = geomInfo.centroid3D;

        // Sample ground elevation at centroid
        let centerY = BASELINE_ELEVATION_Y;
        if (mdeMeshes && mdeMeshes.length > 0) {
          raycaster.set(new THREE.Vector3(centerX, 3200, centerZ), down);
          const hits = raycaster.intersectObjects(mdeMeshes, false);
          if (hits.length > 0) {
            centerY = hits[0].point.y;
          }
        }

        // Perimeter line points in local 3D coordinates (with slight elevation lift)
        const linePoints = geomInfo.ring3D.map(([rx, rz]) => {
          return new THREE.Vector3(rx, centerY + 3, rz);
        });

        // 2D shape for translucent fill
        const shape = new THREE.Shape();
        geomInfo.ring3D.forEach(([rx, rz], pIdx) => {
          // Local offset relative to centroid
          const lx = rx - centerX;
          const lz = rz - centerZ;
          if (pIdx === 0) shape.moveTo(lx, lz);
          else shape.lineTo(lx, lz);
        });

        const maxTemp = feature.properties?.est_max || 38.0;
        let color = '#fb923c'; // orange
        if (maxTemp >= 42.0) color = '#ef4444'; // critical red
        else if (maxTemp >= 40.0) color = '#f97316'; // vibrant orange

        return {
          id: feature.properties?.fid || `area-${idx}`,
          name: feature.properties?.nombre || `Área ${idx + 1}`,
          feature,
          properties: feature.properties,
          centroid: [centerX, centerY, centerZ],
          radius: geomInfo.radius || 120,
          linePoints,
          shape,
          color,
          maxTemp,
        };
      })
      .filter(Boolean);
  }, [geoData, mdeMeshes]);

  if (!visible || processedAreas.length === 0) return null;

  return (
    <group>
      {processedAreas.map((area) => {
        const isSelected = activeArea?.id === area.id;
        const isDimmed = hasSelection && !isSelected;
        const [cx, cy, cz] = area.centroid;
        
        // Heat dome dimensions: rises above buildings (typically 10-30m)
        const domeRadius = area.radius || 120;
        const domeHeight = Math.max(42, Math.min(75, domeRadius * 0.42));
        const beaconHeight = domeHeight + 14;
        const needleLength = beaconHeight + 35; // Plunges down into the terrain

        // Create line loop geometry
        const lineGeom = new THREE.BufferGeometry().setFromPoints(area.linePoints);

        return (
          <group key={area.id} renderOrder={isSelected ? 100 : 0}>
            {/* 1. Glowing Perimeter Boundary Line on Ground */}
            <lineLoop geometry={lineGeom}>
              <lineBasicMaterial
                color={isSelected ? '#ffffff' : area.color}
                linewidth={3}
                transparent
                opacity={isSelected ? 0.95 : (isDimmed ? 0.25 : 0.85)}
              />
            </lineLoop>

            {/* 2. Semi-transparent Ground Thermal Footprint Fill */}
            <mesh
              position={[cx, cy + 1.2, cz]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectArea) onSelectArea(area);
              }}
            >
              <shapeGeometry args={[area.shape]} />
              <meshBasicMaterial
                color={area.color}
                transparent
                opacity={isSelected ? 0.45 : (isDimmed ? 0.08 : 0.25)}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>

            {/* 3. 3D Heat Island Atmospheric Dome (Cúpula Térmica sobre los edificios) */}
            <group position={[cx, cy, cz]}>
              {/* Translucent Solid Dome Shell */}
              <mesh
                scale={[domeRadius, domeHeight, domeRadius]}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectArea) onSelectArea(area);
                }}
              >
                <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial
                  color={area.color}
                  transparent={true}
                  opacity={isSelected ? 0.45 : (isDimmed ? 0.08 : 0.24)}
                  roughness={0.25}
                  metalness={0.1}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>

              {/* Wireframe Ribs of the Heat Dome */}
              <mesh scale={[domeRadius * 1.002, domeHeight * 1.002, domeRadius * 1.002]}>
                <sphereGeometry args={[1, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshBasicMaterial
                  wireframe
                  color={isSelected ? '#ffffff' : area.color}
                  transparent
                  opacity={isSelected ? 0.65 : (isDimmed ? 0.10 : 0.26)}
                />
              </mesh>

              {/* Central vertical needle: connects floating badge through the dome down to the terrain */}
              <mesh position={[0, beaconHeight - needleLength / 2, 0]}>
                <cylinderGeometry args={[isSelected ? 1.1 : (isDimmed ? 0.4 : 0.75), isSelected ? 1.1 : (isDimmed ? 0.4 : 0.75), needleLength, 8]} />
                <meshBasicMaterial
                  color={isSelected ? '#fca5a5' : area.color}
                  transparent
                  opacity={isSelected ? 0.95 : (isDimmed ? 0.18 : 0.8)}
                />
              </mesh>

              {/* Glowing diamond head at dome apex */}
              <mesh position={[0, beaconHeight, 0]} rotation={[0, Math.PI / 4, 0]}>
                <octahedronGeometry args={[isSelected ? 4.5 : (isDimmed ? 2.2 : 3.2), 0]} />
                <meshBasicMaterial
                  color={isSelected ? '#ffffff' : area.color}
                  transparent={isDimmed}
                  opacity={isDimmed ? 0.25 : 1.0}
                />
              </mesh>

              {/* 4. Compact Proportional HTML Centroid Badge with zoom scale */}
              <Html
                position={[0, beaconHeight + 10, 0]}
                center
                zIndexRange={isSelected ? [15, 25] : [0, 0]}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectArea) onSelectArea(area);
                  }}
                  style={{
                    transform: `scale(${isSelected ? Math.max(0.9, labelScale * 1.15) : (isDimmed ? labelScale * 0.95 : labelScale)})`,
                    transformOrigin: 'center bottom',
                    opacity: isDimmed ? 0.35 : 1.0,
                    zIndex: isSelected ? 50 : 1,
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 whitespace-nowrap cursor-pointer select-none border ${
                    isSelected
                      ? 'bg-red-600 text-white border-2 border-white shadow-red-500/70 ring-4 ring-red-400/50'
                      : 'bg-slate-950/90 hover:bg-slate-900 border-red-500/40 text-slate-100 shadow-black/80'
                  }`}
                  title="Clic para ver diagnóstico de causas"
                >
                  <Flame className="w-3.5 h-3.5 text-red-400 shrink-0 animate-pulse" />
                  <span>{area.name}</span>
                  <span className="text-[10px] text-orange-300 font-mono font-normal">
                    {area.maxTemp?.toFixed(1)}°C
                  </span>
                </button>
              </Html>
            </group>
          </group>
        );
      })}
    </group>
  );
}
