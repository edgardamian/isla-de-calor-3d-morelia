import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { sampleThermalIntersection } from '../../utils/thermalSampler';

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
  onInspectPoint,
}) {
  const gltf = useGLTF(MODEL_PATH);

  // Store original textures
  const originalTexturesRef = useRef(new Map());
  const buildingShadersRef = useRef([]);
  const mdeShadersRef = useRef([]);

  // Process scene and normalize geometry
  const { processedScene, modelBounds, meshRefs } = useMemo(() => {
    if (!gltf || !gltf.scene) {
      return { processedScene: null, modelBounds: null, meshRefs: {} };
    }

    const scene = gltf.scene;
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

          // Ultra-fast O(N) integer column footprint matching + roof triangulation: Loads in <10ms with 0 freeze
          if (isBuilding && pos && !geom.attributes.extrusionHeight) {
            const count = pos.count;
            const deltaH = new Float32Array(count);
            const indices = geom.index ? geom.index.array : null;
            const triCount = indices ? indices.length / 3 : count / 3;

            // Pass 1: Column minimum and maximum Y using numeric keys (zero string allocation)
            const colMinY = new Map();
            const colMaxY = new Map();

            for (let i = 0; i < count; i++) {
              const kx = Math.round(pos.getX(i));
              const kz = Math.round(pos.getZ(i));
              const key = kx * 100000 + kz;
              const y = pos.getY(i);

              const min = colMinY.get(key);
              if (min === undefined || y < min) colMinY.set(key, y);

              const max = colMaxY.get(key);
              if (max === undefined || y > max) colMaxY.set(key, y);
            }

            // Pass 2: Assign height relative to base for all vertices
            for (let i = 0; i < count; i++) {
              const kx = Math.round(pos.getX(i));
              const kz = Math.round(pos.getZ(i));
              const key = kx * 100000 + kz;
              const minY = colMinY.get(key) ?? pos.getY(i);
              const maxY = colMaxY.get(key) ?? pos.getY(i);
              const colH = maxY - minY;

              if (colH > 0.3 && colH < 150) {
                const y = pos.getY(i);
                const relH = y - minY;
                if (relH > 0.25) {
                  deltaH[i] = Math.min(150, relH);
                }
              }
            }

            // Pass 3: Roof triangle equalization (ensures every roof triangle has unified heights across all 3 vertices)
            for (let pass = 0; pass < 2; pass++) {
              for (let t = 0; t < triCount; t++) {
                const i0 = indices ? indices[t * 3] : t * 3;
                const i1 = indices ? indices[t * 3 + 1] : t * 3 + 1;
                const i2 = indices ? indices[t * 3 + 2] : t * 3 + 2;

                const ny0 = norm ? norm.getY(i0) : 1;
                const ny1 = norm ? norm.getY(i1) : 1;
                const ny2 = norm ? norm.getY(i2) : 1;

                // Roof polygon (normals pointing up)
                if (ny0 > 0.15 && ny1 > 0.15 && ny2 > 0.15) {
                  const maxH = Math.max(deltaH[i0], deltaH[i1], deltaH[i2]);
                  if (maxH > 0.5) {
                    deltaH[i0] = maxH;
                    deltaH[i1] = maxH;
                    deltaH[i2] = maxH;
                  }
                }
              }
            }

            // Pass 4: Sync wall top vertices touching roofs
            for (let t = 0; t < triCount; t++) {
              const i0 = indices ? indices[t * 3] : t * 3;
              const i1 = indices ? indices[t * 3 + 1] : t * 3 + 1;
              const i2 = indices ? indices[t * 3 + 2] : t * 3 + 2;

              const maxH = Math.max(deltaH[i0], deltaH[i1], deltaH[i2]);
              if (maxH > 0.5) {
                if (deltaH[i0] > maxH * 0.6) deltaH[i0] = maxH;
                if (deltaH[i1] > maxH * 0.6) deltaH[i1] = maxH;
                if (deltaH[i2] > maxH * 0.6) deltaH[i2] = maxH;
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
            mat.shadowSide = isBuilding ? THREE.BackSide : THREE.FrontSide;
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

            // Hook GPU vertex shader for TRUE polygon vertical extrusion on buildings
            // and custom fragment shader for MDE terrain to ensure lateral skirts & base have full wireframe visibility
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
            } else {
              mat.onBeforeCompile = (shader) => {
                shader.uniforms.uIsWireframe = { value: wireframe ? 1.0 : 0.0 };
                mat.userData.mdeShader = shader;
                if (!mdeShadersRef.current.includes(shader)) {
                  mdeShadersRef.current.push(shader);
                }

                shader.fragmentShader = `
                  uniform float uIsWireframe;
                ` + shader.fragmentShader;

                shader.fragmentShader = shader.fragmentShader.replace(
                  '#include <map_fragment>',
                  `
                  #ifdef USE_MAP
                    vec4 sampledDiffuseColor = texture2D( map, vMapUv );
                    float texBrightness = sampledDiffuseColor.r + sampledDiffuseColor.g + sampledDiffuseColor.b;
                    
                    // In the Landsat LST texture, the lateral skirts, borders and bottom base have black/empty NODATA (texBrightness < 0.08 or alpha < 0.1)
                    if (texBrightness < 0.08 || sampledDiffuseColor.a < 0.1) {
                      if (uIsWireframe > 0.5) {
                        // High visibility cyan-blue for mesh lines on sides and bottom
                        sampledDiffuseColor = vec4(0.40, 0.65, 0.95, 1.0);
                      } else {
                        // Sleek dark slate base block in solid mode
                        sampledDiffuseColor = vec4(0.20, 0.26, 0.35, 1.0);
                      }
                    } else if (uIsWireframe > 0.5) {
                      // Boost minimum wireframe visibility so deep blue/cold regions don't fade into black
                      sampledDiffuseColor.rgb = max(sampledDiffuseColor.rgb, vec3(0.25, 0.30, 0.45));
                    }
                    diffuseColor *= sampledDiffuseColor;
                  #endif
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

    // Sync wireframe uniform across all compiled MDE shaders
    mdeShadersRef.current.forEach((shader) => {
      if (shader.uniforms?.uIsWireframe) {
        shader.uniforms.uIsWireframe.value = wireframe ? 1.0 : 0.0;
      }
    });

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

        if (mat.userData?.mdeShader?.uniforms?.uIsWireframe) {
          mat.userData.mdeShader.uniforms.uIsWireframe.value = wireframe ? 1.0 : 0.0;
        }

        if (mdeTextureMode === 'thermal' && origMap) {
          mat.map = origMap;
          mat.color.set('#ffffff');
          mat.roughness = 0.7;
          mat.metalness = 0.05;
        } else if (mdeTextureMode === 'thermal' && !origMap) {
          mat.map = null;
          mat.color.set(wireframe ? '#60a5fa' : '#334155');
          mat.roughness = 0.8;
          mat.metalness = 0.1;
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
