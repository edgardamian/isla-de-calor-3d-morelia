import React, { useState, useCallback } from 'react';
import SceneCanvas from './components/Viewer3D/SceneCanvas';
import GlassPanel from './components/UI/GlassPanel';
import ThermalLegend from './components/UI/ThermalLegend';
import ThermalInspectorCard from './components/UI/ThermalInspectorCard';
import AffectedAreaCard from './components/UI/AffectedAreaCard';
import ReferencePointCard from './components/UI/ReferencePointCard';
import ViewControlsHUD from './components/UI/ViewControlsHUD';
import LoadingScreen from './components/UI/LoadingScreen';
import ErrorBoundary from './components/UI/ErrorBoundary';
import MobileUnsupportedNotice from './components/UI/MobileUnsupportedNotice';
import { getIsMobile } from './utils/deviceDetection';

export default function App() {
  const isMobile = getIsMobile();

  // On mobile devices, show polite desktop-requirement notice and sharing actions without mounting heavy WebGL
  if (isMobile) {
    return <MobileUnsupportedNotice />;
  }

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
  
  // GeoJSON Layers Visibility (Both OFF by default as requested)
  const [showReferencePoints, setShowReferencePoints] = useState(false);
  const [showAffectedAreas, setShowAffectedAreas] = useState(false);
  
  // Selected Features & Camera Navigation
  const [activePoint, setActivePoint] = useState(null);
  const [activeArea, setActiveArea] = useState(null);
  const [focusTarget, setFocusTarget] = useState(null);

  const [lightingPreset, setLightingPreset] = useState('sunrise');
  const [sunTime, setSunTime] = useState(7.0); // 07:00 AM (Amanecer)
  const [isPlayingShadows, setIsPlayingShadows] = useState(false);
  const [shadowSpeed, setShadowSpeed] = useState(1); // 1x, 2x, 4x
  const [enableShadows, setEnableShadows] = useState(true);
  const [modelStats, setModelStats] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Interactive Thermal Probe state
  const [probeData, setProbeData] = useState(null);

  // Smooth real-time shadow & solar animation loop
  React.useEffect(() => {
    if (!isPlayingShadows) return;
    let animationFrameId;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const deltaSec = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setSunTime((prev) => {
        // ~1.2 hours of sun simulation per second at 1x speed
        const step = 1.2 * shadowSpeed * deltaSec;
        let next = prev + step;
        if (next > 19.8) next = 6.2; // Loop from sunrise to sunset
        return next;
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlayingShadows, shadowSpeed]);

  const handleResetView = useCallback(() => {
    setActivePreset('isometric');
    setResetTrigger((prev) => prev + 1);
    setFocusTarget(null);
    setActivePoint(null);
    setActiveArea(null);
  }, []);

  const handleSelectPreset = useCallback((presetId) => {
    setActivePreset(presetId);
    setFocusTarget(null);
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

  // Layer Toggles & Interactions
  const handleToggleShowReferencePoints = useCallback(() => {
    setShowReferencePoints((prev) => !prev);
  }, []);

  const handleToggleShowAffectedAreas = useCallback(() => {
    setShowAffectedAreas((prev) => !prev);
  }, []);

  const handleSelectPoint = useCallback((pt) => {
    setActivePoint(pt);
    setActiveArea(null);
    setProbeData(null);
    // User stays wherever they currently are; camera does NOT zoom out or move
  }, []);

  const handleSelectArea = useCallback((area) => {
    setActiveArea(area);
    setActivePoint(null);
    setProbeData(null);
    // User stays wherever they currently are; camera does NOT zoom out or move
  }, []);

  const handleCloseArea = useCallback(() => {
    setActiveArea(null);
  }, []);

  const handleClosePoint = useCallback(() => {
    setActivePoint(null);
  }, []);

  // Triggered exclusively when user clicks 'Centrar Vista' inside the cards
  const handleFocusPoint = useCallback((pt) => {
    if (pt?.worldPos) {
      setFocusTarget({ target: pt.worldPos });
    }
  }, []);

  const handleFocusArea = useCallback((area) => {
    if (area?.worldPos) {
      setFocusTarget({ target: area.worldPos });
    }
  }, []);

  const handleSelectLighting = useCallback((presetId) => {
    setLightingPreset(presetId);
    if (presetId === 'sunrise') setSunTime(7.0);
    else if (presetId === 'landsatReal') setSunTime(11.1);
    else if (presetId === 'zenith') setSunTime(13.0);
    else if (presetId === 'sunset') setSunTime(18.75);
  }, []);

  const handleChangeSunTime = useCallback((newTime) => {
    setSunTime(newTime);
    if (newTime <= 8.5) setLightingPreset('sunrise');
    else if (newTime > 8.5 && newTime <= 12.0) setLightingPreset('landsatReal');
    else if (newTime > 12.0 && newTime <= 15.0) setLightingPreset('zenith');
    else setLightingPreset('sunset');
  }, []);

  const handleTogglePlayShadows = useCallback(() => {
    setIsPlayingShadows((prev) => !prev);
  }, []);

  const handleChangeShadowSpeed = useCallback((speed) => {
    setShadowSpeed(speed);
  }, []);

  const handleToggleShadows = useCallback(() => {
    setEnableShadows((prev) => !prev);
  }, []);

  const handleModelLoaded = useCallback((stats) => {
    setModelStats(stats);
    setIsModelLoaded(true);
  }, []);

  const handleInspectPoint = useCallback((data) => {
    setProbeData(data);
    setActiveArea(null);
  }, []);

  const handleCloseProbe = useCallback(() => {
    setProbeData(null);
  }, []);

  const handleCameraMove = useCallback(() => {
    setFocusTarget(null);
    setProbeData((prevData) => {
      if (prevData !== null) return null;
      return prevData;
    });
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      
      {/* 3D WebGL Canvas Component (100vw x 100vh) */}
      <ErrorBoundary>
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
          showReferencePoints={showReferencePoints}
          showAffectedAreas={showAffectedAreas}
          lightingPreset={lightingPreset}
          sunTime={sunTime}
          enableShadows={enableShadows}
          onModelLoaded={handleModelLoaded}
          probeData={probeData}
          onInspectPoint={handleInspectPoint}
          onCloseProbe={handleCloseProbe}
          onCameraMove={handleCameraMove}
          focusTarget={focusTarget}
          onSelectPoint={handleSelectPoint}
          onSelectArea={handleSelectArea}
          activePoint={activePoint}
          activeArea={activeArea}
        />
      </ErrorBoundary>

      {/* Loading Screen using Drei useProgress hook & model state */}
      <LoadingScreen isLoaded={isModelLoaded} />

      {/* Superimposed UI Overlay Layer */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        
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
          sunTime={sunTime}
          onChangeSunTime={handleChangeSunTime}
          isPlayingShadows={isPlayingShadows}
          onTogglePlayShadows={handleTogglePlayShadows}
          shadowSpeed={shadowSpeed}
          onChangeShadowSpeed={handleChangeShadowSpeed}
          enableShadows={enableShadows}
          onToggleShadows={handleToggleShadows}
          modelStats={modelStats}
        />

        {/* Bottom Right Land Surface Temperature Legend & Expandable Metadata */}
        {!probeData && !activeArea && !activePoint && <ThermalLegend modelStats={modelStats} />}

        {/* Compact & Well-proportioned Thermal Identifier Card */}
        {probeData && (
          <ThermalInspectorCard
            probeData={probeData}
            onClose={handleCloseProbe}
          />
        )}

        {/* Reference Point Information Card */}
        {activePoint && (
          <ReferencePointCard
            pointData={activePoint}
            onClose={handleClosePoint}
            onFocusPoint={handleFocusPoint}
          />
        )}

        {/* Affected Heat Island Area Information Card */}
        {activeArea && (
          <AffectedAreaCard
            areaData={activeArea}
            onClose={handleCloseArea}
            onFocusArea={handleFocusArea}
          />
        )}

        {/* Top Right HUD Action Controls */}
        <ViewControlsHUD
          onResetView={handleResetView}
          hasProbeSelection={!!probeData || !!activeArea || !!activePoint}
          showReferencePoints={showReferencePoints}
          onToggleShowReferencePoints={handleToggleShowReferencePoints}
          showAffectedAreas={showAffectedAreas}
          onToggleShowAffectedAreas={handleToggleShowAffectedAreas}
        />
        
      </div>
      
    </main>
  );
}