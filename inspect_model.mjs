import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Read file buffer
const buffer = fs.readFileSync('./public/ISLA_DE_CALOR_3D_V5.glb');
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
// Set draco path from node_modules or three/examples/jsm/libs/draco/
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
loader.setDRACOLoader(dracoLoader);

loader.parse(
  arrayBuffer,
  '',
  (gltf) => {
    console.log('--- GLTF PARSED SUCCESSFULLY ---');
    const scene = gltf.scene;
    
    // Calculate bounding box
    const bbox = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    console.log('Bounding Box Min:', bbox.min);
    console.log('Bounding Box Max:', bbox.max);
    console.log('Size (W x H x D):', size);
    console.log('Center:', center);

    console.log('\n--- MESHES & MATERIALS ---');
    let count = 0;
    scene.traverse((child) => {
      if (child.isMesh) {
        count++;
        console.log(`Mesh #${count}: name="${child.name}", visible=${child.visible}`);
        console.log(`  Position:`, child.position);
        console.log(`  Scale:`, child.scale);
        console.log(`  Rotation:`, child.rotation);
        if (child.geometry) {
          const pos = child.geometry.attributes.position;
          console.log(`  Geometry vertices count:`, pos ? pos.count : 0);
          const uvs = child.geometry.attributes.uv;
          console.log(`  Geometry UVs count:`, uvs ? uvs.count : 0);
        }
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m, idx) => {
            console.log(`  Material #${idx}: type=${m.type}, name="${m.name}", color=${m.color ? m.color.getHexString() : 'none'}, hasMap=${!!m.map}, emissive=${m.emissive ? m.emissive.getHexString() : 'none'}, roughness=${m.roughness}, metalness=${m.metalness}`);
            if (m.map) {
              console.log(`    Map image:`, m.map.image ? `${m.map.image.width}x${m.map.image.height}` : 'loading/embedded');
            }
          });
        }
      }
    });

    console.log(`\nTotal meshes: ${count}`);
    process.exit(0);
  },
  (err) => {
    console.error('Error parsing GLB:', err);
    process.exit(1);
  }
);
