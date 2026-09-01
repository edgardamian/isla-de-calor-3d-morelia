import React, { useState, useCallback } from 'react';
import SceneCanvas from './components/Viewer3D/SceneCanvas';
import GlassPanel from './components/UI/GlassPanel';
import ThermalLegend from './components/UI/ThermalLegend';
import ViewControlsHUD from './components/UI/ViewControlsHUD';
import LoadingScreen from './components/UI/LoadingScreen';

export default function App() {
  const [activePreset, setActivePreset] = useState('isometric');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  
  // Elevation scales
  const [elevationScale, setElevationScale] = useState(1.5);
  const [buildingHeightScale, setBuildingHeightScale] = useState(1.0);
  
  // Texture and layer visibility states
  const [showMDE, setShowMDE] = useState(true);
  const [mdeTextureMode, setMdeTextureMode] = useState('thermal'); // 'thermal' | 'topography'
  const [showBuildings, setShowBuildings] = useState(true);
  const [buildingTextureMode, setBuildingTextureMode] = useState('thermal'); // 'thermal' | 'architectural'
  
  const [lightingPreset, setLightingPreset] = useState('landsatReal');
  const [modelStats, setModelStats] = useState(null);

  const handleResetView = useCallback(() => {
    setActivePreset('isometric');
    setResetTrigger((prev) => prev + 1);
  }, []);

  const handleSelectPreset = useCallback((presetId) => {
    setActivePreset(presetId);
  }, []);

  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => !prev);
  }, []);

  const handleToggleWireframe = useCallback(() => {
    setWireframe((prev) => !prev);
  }, []);

  const handleChangeElevationScale = useCallback((val) => {
    setElevationScale(val);
  }, []);

  const handleChangeBuildingHeightScale = useCallback((val) => {
    setBuildingHeightScale(val);
  }, []);

  const handleToggleShowMDE = useCallback(() => {
    setShowMDE((prev) => !prev);
  }, []);

  const handleChangeMDETextureMode = useCallback((mode) => {
    setMdeTextureMode(mode);
  }, []);

  const handleToggleShowBuildings = useCallback(() => {
    setShowBuildings((prev) => !prev);
  }, []);

  const handleChangeBuildingTextureMode = useCallback((mode) => {
    setBuildingTextureMode(mode);
  }, []);

  const handleSelectLighting = useCallback((presetId) => {
    setLightingPreset(presetId);
  }, []);

  const handleModelLoaded = useCallback((stats) => {
    setModelStats(stats);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      
      {/* 3D WebGL Canvas Component (100vw x 100vh) */}
      <SceneCanvas
        activePreset={activePreset}
        resetTrigger={resetTrigger}
        autoRotate={autoRotate}
        wireframe={wireframe}
        elevationScale={elevationScale}
        buildingHeightScale={buildingHeightScale}
        showMDE={showMDE}
        showBuildings={showBuildings}
        mdeTextureMode={mdeTextureMode}
        buildingTextureMode={buildingTextureMode}
        lightingPreset={lightingPreset}
        onModelLoaded={handleModelLoaded}
      />

      {/* Loading Screen using Drei useProgress hook */}
      <LoadingScreen />

      {/* Superimposed UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        
        {/* Left Side Glassmorphism Panel */}
        <GlassPanel
          onResetView={handleResetView}
          activePreset={activePreset}
          onSelectPreset={handleSelectPreset}
          autoRotate={autoRotate}
          onToggleAutoRotate={handleToggleAutoRotate}
          wireframe={wireframe}
          onToggleWireframe={handleToggleWireframe}
          elevationScale={elevationScale}
          onChangeElevationScale={handleChangeElevationScale}
          buildingHeightScale={buildingHeightScale}
          onChangeBuildingHeightScale={handleChangeBuildingHeightScale}
          showMDE={showMDE}
          onToggleShowMDE={handleToggleShowMDE}
          mdeTextureMode={mdeTextureMode}
          onChangeMDETextureMode={handleChangeMDETextureMode}
          showBuildings={showBuildings}
          onToggleShowBuildings={handleToggleShowBuildings}
          buildingTextureMode={buildingTextureMode}
          onChangeBuildingTextureMode={handleChangeBuildingTextureMode}
          lightingPreset={lightingPreset}
          onSelectLighting={handleSelectLighting}
          modelStats={modelStats}
        />

        {/* Bottom Right Land Surface Temperature Legend */}
        {mdeTextureMode === 'thermal' && <ThermalLegend />}

        {/* Top Right HUD Action Controls */}
        <ViewControlsHUD onResetView={handleResetView} />
        
      </div>
      
    </main>
  );
}