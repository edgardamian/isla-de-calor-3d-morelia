import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ThermalProbeMarker({ probeData }) {
  const ringRef = useRef();
  const pinRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.15);
    }
    if (pinRef.current) {
      pinRef.current.position.y = Math.sin(t * 3) * 0.02 + 0.04;
    }
  });

  if (!probeData || !probeData.point) return null;

  const [x, y, z] = probeData.point;
  const color = probeData.classification?.colorHex || '#f97316';

  return (
    <group position={[x, y, z]}>
      {/* Ground ripple ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.05, 0.08, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[0.09, 0.12, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.45}
          toneMapped={false}
        />
      </mesh>

      {/* Floating 3D pin pointer */}
      <group ref={pinRef}>
        {/* Glow Sphere tip */}
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>

        {/* Pin cone stem pointing down */}
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.025, 0.12, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
