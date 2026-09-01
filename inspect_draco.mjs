import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Inspect GLTF meshes in Node.js
console.log('Loading GLTF to inspect Draco decompressed mesh attributes...');
