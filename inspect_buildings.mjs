import fs from 'fs';

const fd = fs.openSync('./public/ISLA_DE_CALOR_3D_V5.glb', 'r');
const chunkHeader = Buffer.alloc(8);
fs.readSync(fd, chunkHeader, 0, 8, 12);
const chunkLength = chunkHeader.readUInt32LE(0);

const jsonBuf = Buffer.alloc(chunkLength);
fs.readSync(fd, jsonBuf, 0, chunkLength, 20);
fs.closeSync(fd);

const gltf = JSON.parse(jsonBuf.toString('utf8'));

console.log('=== NODES ===');
console.log(JSON.stringify(gltf.nodes, null, 2));

console.log('=== MESHES ===');
console.log(JSON.stringify(gltf.meshes, null, 2));

console.log('=== MATERIALS ===');
console.log(JSON.stringify(gltf.materials, null, 2));

console.log('=== TEXTURES ===');
console.log(JSON.stringify(gltf.textures, null, 2));

console.log('=== IMAGES ===');
console.log(JSON.stringify(gltf.images, null, 2));
