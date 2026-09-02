import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ThermalProbeMarker({ probeData }) {
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
    </group>
  );
}
