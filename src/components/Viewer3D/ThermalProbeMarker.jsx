import React from 'react';

export default function ThermalProbeMarker({ probeData }) {
  if (!probeData || !probeData.point) return null;

  const [x, y, z] = probeData.point;
  const color = probeData.classification?.colorHex || '#f97316';

  return (
    <group position={[x, y, z]}>
      {/* Static ground target ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <ringGeometry args={[0.035, 0.07, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Static beacon pointer needle */}
      <mesh position={[0, 0.065, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.015, 0.13, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {/* Glowing sphere tip */}
      <mesh position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}
