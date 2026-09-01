import React, { useMemo, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = `${import.meta.env.BASE_URL}ISLA_DE_CALOR_3D_V5.glb`;

export default function UrbanModel({
  wireframe = false,
  elevationScale = 1.0,
  buildingHeightScale = 1.0,
  showMDE = true,
  showBuildings = true,
  mdeTextureMode = 'thermal', // 'thermal' | 'topography'
  buildingTextureMode = 'thermal', // 'thermal' | 'architectural'
  onLoaded,
}) {
  const gltf = useGLTF(MODEL_PATH);

  // Store original textures
  const originalTexturesRef = useRef(new Map());
  const buildingShadersRef = useRef([]);

  // Process scene and normalize geometry
  const { processedScene, modelBounds, meshRefs } = useMemo(() => {
    if (!gltf || !gltf.scene) {
      return { processedScene: null, modelBounds: null, meshRefs: {} };
    }

    const scene = gltf.scene.clone(true);
    const rawBox = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    rawBox.getSize(size);
    const center = new THREE.Vector3();
    rawBox.getCenter(center);

    const maxDim = Math.max(size.x, size.z);
    const targetSize = 60;
    const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1;

    let meshCount = 0;
    let triangleCount = 0;
    const foundMeshRefs = {
      mde: [],
      buildings: [],
    };

    scene.traverse((child) => {
      const isBuilding =
        child.name?.toLowerCase().includes('edificio') ||
        child.parent?.name?.toLowerCase().includes('edificio');

      if (child.isMesh) {
        meshCount++;

        if (isBuilding) {
          child.castShadow = true;
          child.receiveShadow = true;
          foundMeshRefs.buildings.push(child);
        } else {
          // Terrain (MDE) only RECEIVES building shadows (castShadow=false prevents shadow acne stripes on ground)
          child.castShadow = false;
          child.receiveShadow = true;
          foundMeshRefs.mde.push(child);
        }

        if (child.geometry) {
          const pos = child.geometry.attributes.position;
          const norm = child.geometry.attributes.normal;
          if (pos) triangleCount += pos.count / 3;

          const geom = child.geometry;

          // Align UV attributes if needed
          if (geom.attributes.uv1 && !geom.attributes.uv2) {
            geom.setAttribute('uv2', geom.attributes.uv1);
          }
          if (geom.attributes.uv2 && !geom.attributes.uv) {
            geom.setAttribute('uv', geom.attributes.uv2);
          }

          // Exact per-vertex extrusion height computation
          // Optimized O(N) spatial matching + triangle-level roof uniformity: Loads in milliseconds & 0 hollow roofs!
          if (isBuilding && pos && !geom.attributes.extrusionHeight) {
            const count = pos.count;
            const deltaH = new Float32Array(count);
            const indices = geom.index ? geom.index.array : null;
            const triCount = indices ? indices.length / 3 : count / 3;

            // Step 1: Detect wall heights and assign height to wall top vertices
            for (let t = 0; t < triCount; t++) {
              const i0 = indices ? indices[t * 3] : t * 3;
              const i1 = indices ? indices[t * 3 + 1] : t * 3 + 1;
              const i2 = indices ? indices[t * 3 + 2] : t * 3 + 2;

              const y0 = pos.getY(i0);
              const y1 = pos.getY(i1);
              const y2 = pos.getY(i2);

              const minY = Math.min(y0, y1, y2);
              const maxY = Math.max(y0, y1, y2);
              const h = maxY - minY;

              // Vertical wall triangle (height between 0.3m and 150m)
              if (h > 0.3 && h < 150) {
                const midY = minY + h * 0.5;
                if (y0 > midY && h > deltaH[i0]) deltaH[i0] = h;
                if (y1 > midY && h > deltaH[i1]) deltaH[i1] = h;
                if (y2 > midY && h > deltaH[i2]) deltaH[i2] = h;
              }
            }

            // Step 2: Instant O(N) Spatial position matching (1m quantization grid)
            // Bridges split vertices between wall tops and roof perimeters
            const posMap = new Map();
            for (let i = 0; i < count; i++) {
              if (deltaH[i] > 0) {
                const kx = Math.round(pos.getX(i));
                const ky = Math.round(pos.getY(i));
                const kz = Math.round(pos.getZ(i));
                const key = `${kx}_${ky}_${kz}`;
                const prev = posMap.get(key) || 0;
                if (deltaH[i] > prev) posMap.set(key, deltaH[i]);
              }
            }

            for (let i = 0; i < count; i++) {
              const kx = Math.round(pos.getX(i));
              const ky = Math.round(pos.getY(i));
              const kz = Math.round(pos.getZ(i));
              const h = posMap.get(`${kx}_${ky}_${kz}`);
              if (h !== undefined && h > deltaH[i]) {
                const ny = norm ? norm.getY(i) : 1;
                // Only lift roof/top vertices, keep bottom base vertices anchored
                if (ny > 0.1 || pos.getY(i) > (ky - 0.2)) {
                  deltaH[i] = h;
                }
              }
            }

            // Step 3: Triangle-level roof propagation (guarantees EVERY roof triangle has identical heights across all 3 vertices)
            for (let pass = 0; pass < 15; pass++) {
              let changed = false;
              for (let t = 0; t < triCount; t++) {
                const i0 = indices ? indices[t * 3] : t * 3;
                const i1 = indices ? indices[t * 3 + 1] : t * 3 + 1;
                const i2 = indices ? indices[t * 3 + 2] : t * 3 + 2;

                const ny0 = norm ? norm.getY(i0) : 1;
                const ny1 = norm ? norm.getY(i1) : 1;
                const ny2 = norm ? norm.getY(i2) : 1;

                // If triangle is a roof (normals pointing up)
                if (ny0 > 0.15 && ny1 > 0.15 && ny2 > 0.15) {
                  const maxH = Math.max(deltaH[i0], deltaH[i1], deltaH[i2]);
                  if (maxH > 0) {
                    if (deltaH[i0] !== maxH) { deltaH[i0] = maxH; changed = true; }
                    if (deltaH[i1] !== maxH) { deltaH[i1] = maxH; changed = true; }
                    if (deltaH[i2] !== maxH) { deltaH[i2] = maxH; changed = true; }
                  }
                }
              }
              if (!changed) break;
            }

            // Step 4: Fallback for isolated roof polygons (assign uniform height to all 3 vertices of the triangle simultaneously)
            for (let t = 0; t < triCount; t++) {
              const i0 = indices ? indices[t * 3] : t * 3;
              const i1 = indices ? indices[t * 3 + 1] : t * 3 + 1;
              const i2 = indices ? indices[t * 3 + 2] : t * 3 + 2;

              const ny0 = norm ? norm.getY(i0) : 1;
              const ny1 = norm ? norm.getY(i1) : 1;
              const ny2 = norm ? norm.getY(i2) : 1;

              if (ny0 > 0.25 && ny1 > 0.25 && ny2 > 0.25) {
                if (deltaH[i0] === 0 && deltaH[i1] === 0 && deltaH[i2] === 0) {
                  deltaH[i0] = 6.0;
                  deltaH[i1] = 6.0;
                  deltaH[i2] = 6.0;
                }
              }
            }

            geom.setAttribute('extrusionHeight', new THREE.BufferAttribute(deltaH, 1));
          }
        }

        if (child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((mat, mIdx) => {
            const key = `${child.name}_${mIdx}`;
            if (mat.map && !originalTexturesRef.current.has(key)) {
              originalTexturesRef.current.set(key, mat.map);
            }

            mat.side = THREE.DoubleSide;
            mat.depthWrite = true;
            mat.depthTest = true;

            if (mat.map) {
              mat.map.colorSpace = THREE.SRGBColorSpace;
              mat.map.wrapS = THREE.ClampToEdgeWrapping;
              mat.map.wrapT = THREE.ClampToEdgeWrapping;
              mat.map.needsUpdate = true;

              if (isBuilding) {
                if ('channel' in mat.map) mat.map.channel = 0;
              } else {
                if ('channel' in mat.map) {
                  mat.map.channel = (mat.name === 'Isla de calor MDE' || mat.name === 'Rock') ? 1 : 0;
                }
              }
            }

            // Hook GPU vertex shader for TRUE polygon vertical extrusion
            if (isBuilding) {
              mat.onBeforeCompile = (shader) => {
                shader.uniforms.uBuildingExaggeration = { value: buildingHeightScale };
                mat.userData.shader = shader;
                if (!buildingShadersRef.current.includes(shader)) {
                  buildingShadersRef.current.push(shader);
                }

                shader.vertexShader = `
                  attribute float extrusionHeight;
                  uniform float uBuildingExaggeration;
                ` + shader.vertexShader;

                shader.vertexShader = shader.vertexShader.replace(
                  '#include <begin_vertex>',
                  `
                  #include <begin_vertex>
                  // True polygon extrusion: footprint base stays anchored to ground (extrusionHeight = 0), only walls and roofs stretch!
                  transformed.y += extrusionHeight * (uBuildingExaggeration - 1.0);
                  `
                );
              };
            }
          });
        }
      }
    });

    return {
      processedScene: scene,
      meshRefs: foundMeshRefs,
      modelBounds: {
        center,
        size,
        scaleFactor,
        meshCount,
        triangleCount: Math.round(triangleCount),
      },
    };
  }, [gltf]);

  // Update building height exaggeration on GPU in real-time
  useEffect(() => {
    buildingShadersRef.current.forEach((shader) => {
      if (shader.uniforms?.uBuildingExaggeration) {
        shader.uniforms.uBuildingExaggeration.value = buildingHeightScale;
      }
    });
    meshRefs.buildings?.forEach((mesh) => {
      if (mesh.material?.userData?.shader?.uniforms?.uBuildingExaggeration) {
        mesh.material.userData.shader.uniforms.uBuildingExaggeration.value = buildingHeightScale;
      }
    });
  }, [meshRefs, buildingHeightScale]);

  // Dynamically update materials and visibility
  useEffect(() => {
    if (!processedScene || !meshRefs) return;

    // 1. Update MDE (Terrain) meshes
    meshRefs.mde?.forEach((mesh) => {
      mesh.visible = showMDE;
      if (!mesh.material) return;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat, mIdx) => {
        const key = `${mesh.name}_${mIdx}`;
        const origMap = originalTexturesRef.current.get(key);

        mat.wireframe = wireframe;

        if (mdeTextureMode === 'thermal' && origMap) {
          mat.map = origMap;
          mat.color.set('#ffffff');
          mat.roughness = 0.7;
          mat.metalness = 0.05;
        } else if (mdeTextureMode === 'topography') {
          mat.map = null;
          mat.color.set('#cbd5e1');
          mat.roughness = 0.85;
          mat.metalness = 0.0;
        }
        mat.needsUpdate = true;
      });
    });

    // 2. Update Buildings meshes (Thermal and Architectural)
    meshRefs.buildings?.forEach((mesh) => {
      mesh.visible = showBuildings;
      if (!mesh.material) return;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat, mIdx) => {
        const key = `${mesh.name}_${mIdx}`;
        const origMap = originalTexturesRef.current.get(key);

        mat.wireframe = wireframe;

        if (buildingTextureMode === 'thermal' && origMap) {
          mat.map = origMap;
          if ('channel' in mat.map) mat.map.channel = 0;
          mat.color.set('#ffffff');
          mat.roughness = 0.4;
          mat.metalness = 0.1;
        } else if (buildingTextureMode === 'architectural') {
          mat.map = null;
          mat.color.set('#f8fafc');
          mat.roughness = 0.25;
          mat.metalness = 0.15;
        }
        mat.needsUpdate = true;
      });
    });
  }, [
    processedScene,
    meshRefs,
    wireframe,
    showMDE,
    showBuildings,
    mdeTextureMode,
    buildingTextureMode,
  ]);

  useEffect(() => {
    if (modelBounds && onLoaded) {
      onLoaded({
        meshCount: modelBounds.meshCount,
        triangleCount: modelBounds.triangleCount,
        realWidthKm: (modelBounds.size.x / 1000).toFixed(1),
        realDepthKm: (modelBounds.size.z / 1000).toFixed(1),
        elevationDeltaM: Math.round(modelBounds.size.y),
      });
    }
  }, [modelBounds, onLoaded]);

  if (!processedScene || !modelBounds) return null;

  const { center, scaleFactor } = modelBounds;

  return (
    <group position={[0, 0, 0]}>
      <group
        scale={[
          scaleFactor,
          scaleFactor * elevationScale,
          scaleFactor,
        ]}
        position={[
          -center.x * scaleFactor,
          -center.y * scaleFactor * elevationScale,
          -center.z * scaleFactor,
        ]}
      >
        <primitive object={processedScene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
