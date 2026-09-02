import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CAMERA_PRESETS } from '../../constants/cameraPresets';

export default function CameraController({
  activePreset = 'isometric',
  resetTrigger = 0,
  autoRotate = false,
  onControlsReady,
}) {
  const { camera } = useThree();
  const controlsRef = useRef(null);
  
  const isTransitioningRef = useRef(false);
  const targetCamPosRef = useRef(new THREE.Vector3(...CAMERA_PRESETS.isometric.position));
  const targetLookAtRef = useRef(new THREE.Vector3(...CAMERA_PRESETS.isometric.target));

  // Initialize or respond to preset changes
  useEffect(() => {
    const preset = CAMERA_PRESETS[activePreset] || CAMERA_PRESETS.isometric;
    targetCamPosRef.current.set(...preset.position);
    targetLookAtRef.current.set(...preset.target);
    isTransitioningRef.current = true;
  }, [activePreset, resetTrigger]);

  useEffect(() => {
    if (controlsRef.current && onControlsReady) {
      onControlsReady(controlsRef.current);
    }
  }, [onControlsReady]);

  // Smooth lerp frame loop
  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioningRef.current) {
      const lerpSpeed = Math.min(1, delta * 4.5);
      
      camera.position.lerp(targetCamPosRef.current, lerpSpeed);
      controlsRef.current.target.lerp(targetLookAtRef.current, lerpSpeed);
      controlsRef.current.update();

      const distPos = camera.position.distanceTo(targetCamPosRef.current);
      const distTarget = controlsRef.current.target.distanceTo(targetLookAtRef.current);

      if (distPos < 0.1 && distTarget < 0.1) {
        camera.position.copy(targetCamPosRef.current);
        controlsRef.current.target.copy(targetLookAtRef.current);
        controlsRef.current.update();
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      enableDamping={true}
      dampingFactor={0.06}
      // Required constraint: maxPolarAngle strictly <= Math.PI / 2.1
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={0.05}
      minDistance={1.0}
      maxDistance={250}
      autoRotate={autoRotate}
      autoRotateSpeed={0.7}
      onStart={() => {
        isTransitioningRef.current = false;
      }}
    />
  );
}
