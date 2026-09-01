import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import UrbanModel from './UrbanModel';
import CameraController from './CameraController';
import SceneEnvironment from './SceneEnvironment';

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
  enableShadows = true,
  onModelLoaded,
  onControlsReady,
}) {
  return (
    <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden">
      <Canvas
        shadows={enableShadows}
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
        dpr={[1, 2]}
      >
        <SceneEnvironment
          lightingPreset={lightingPreset}
          enableShadows={enableShadows}
        />
        
        <CameraController
          activePreset={activePreset}
          resetTrigger={resetTrigger}
          autoRotate={autoRotate}
          onControlsReady={onControlsReady}
        />

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
        </Suspense>
      </Canvas>
    </div>
  );
}