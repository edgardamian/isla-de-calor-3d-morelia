import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import UrbanModel from './UrbanModel';
import CameraController from './CameraController';
import SceneEnvironment from './SceneEnvironment';
import ThermalProbeMarker from './ThermalProbeMarker';
import { sampleThermalIntersection } from '../../utils/thermalSampler';

/**
 * High-performance One-Shot Right-Click Raycaster.
 * Zero CPU overhead during rotation, panning, or zoom.
 */
function RightClickThermalProbe({ onInspectPoint }) {
  const { camera, scene, gl } = useThree();

  useEffect(() => {
    const domElement = gl.domElement;
    if (!domElement) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Perform a single one-shot raycast across the scene
      const intersects = raycaster.intersectObjects(scene.children, true);
      const hit = intersects.find(
        (item) => item.object.isMesh && item.object.visible && item.point
      );

      if (hit && onInspectPoint) {
        const probeResult = sampleThermalIntersection(hit);
        if (probeResult) {
          onInspectPoint(probeResult);
        }
      }
    };

    domElement.addEventListener('contextmenu', handleContextMenu);
    return () => {
      domElement.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [camera, scene, gl, onInspectPoint]);

  return null;
}

export default function SceneCanvas({
  activePreset,
  resetTrigger,
  autoRotate,
  wireframe,
  elevationScale = 1.0,
  buildingHeightScale = 1.0,
  showMDE = true,
  showBuildings = true,
  mdeTextureMode = 'thermal',
  buildingTextureMode = 'thermal',
  lightingPreset,
  sunTime = 7.0,
  enableShadows = true,
  onModelLoaded,
  onControlsReady,
  probeData,
  onInspectPoint,
  onCloseProbe,
  onCameraMove,
}) {
  return (
    <div
      className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        onContextMenu={(e) => e.preventDefault()}
        shadows={enableShadows ? { type: THREE.PCFSoftShadowMap } : false}
        camera={{
          position: [42, 36, 42],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
      >
        <SceneEnvironment
          sunTime={sunTime}
          lightingPreset={lightingPreset}
          enableShadows={enableShadows}
        />

        <CameraController
          activePreset={activePreset}
          resetTrigger={resetTrigger}
          autoRotate={autoRotate}
          onControlsReady={onControlsReady}
          onCameraMoveStart={onCameraMove || onCloseProbe}
        />

        <RightClickThermalProbe onInspectPoint={onInspectPoint} />

        <Suspense fallback={null}>
          <UrbanModel
            wireframe={wireframe}
            elevationScale={elevationScale}
            buildingHeightScale={buildingHeightScale}
            showMDE={showMDE}
            showBuildings={showBuildings}
            mdeTextureMode={mdeTextureMode}
            buildingTextureMode={buildingTextureMode}
            onLoaded={onModelLoaded}
          />

          {probeData && (
            <ThermalProbeMarker
              probeData={probeData}
              onClose={onCloseProbe}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}