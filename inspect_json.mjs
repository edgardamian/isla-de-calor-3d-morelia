import fs from 'fs';

const fd = fs.openSync('./public/ISLA_DE_CALOR_3D_V5.glb', 'r');
const headerBuf = Buffer.alloc(12);
fs.readSync(fd, headerBuf, 0, 12, 0);

const magic = headerBuf.readUInt32LE(0);
const version = headerBuf.readUInt32LE(4);
const length = headerBuf.readUInt32LE(8);

console.log(`GLB Magic: 0x${magic.toString(16)}, Version: ${version}, Total length: ${(length / 1024 / 1024).toFixed(2)} MB`);

const chunkHeader = Buffer.alloc(8);
fs.readSync(fd, chunkHeader, 0, 8, 12);
const chunkLength = chunkHeader.readUInt32LE(0);
const chunkType = chunkHeader.readUInt32LE(4);

console.log(`Chunk 0 length: ${chunkLength}, type: 0x${chunkType.toString(16)} (JSON)`);

const jsonBuf = Buffer.alloc(chunkLength);
fs.readSync(fd, jsonBuf, 0, chunkLength, 20);
fs.closeSync(fd);

const gltf = JSON.parse(jsonBuf.toString('utf8'));
console.log('Extensions used:', gltf.extensionsUsed);
console.log('Extensions required:', gltf.extensionsRequired);
console.log('Nodes count:', gltf.nodes?.length);
console.log('Meshes count:', gltf.meshes?.length);
console.log('Materials count:', gltf.materials?.length);
console.log('Textures count:', gltf.textures?.length);
console.log('Images count:', gltf.images?.length);

console.log('\n--- NODES DETAIL ---');
gltf.nodes?.slice(0, 15).forEach((n, i) => {
  console.log(`Node #${i}: name="${n.name}", mesh=${n.mesh}, translation=${JSON.stringify(n.translation)}, scale=${JSON.stringify(n.scale)}, rotation=${JSON.stringify(n.rotation)}`);
});

console.log('\n--- MATERIALS DETAIL ---');
gltf.materials?.slice(0, 15).forEach((m, i) => {
  console.log(`Material #${i}: name="${m.name}", pbr=${JSON.stringify(m.pbrMetallicRoughness)}, emissive=${JSON.stringify(m.emissiveFactor)}, doubleSided=${m.doubleSided}`);
});

console.log('\n--- ACCESSORS (MIN/MAX) ---');
gltf.accessors?.slice(0, 10).forEach((acc, i) => {
  if (acc.min || acc.max) {
    console.log(`Accessor #${i}: type=${acc.type}, min=${JSON.stringify(acc.min)}, max=${JSON.stringify(acc.max)}`);
  }
});
