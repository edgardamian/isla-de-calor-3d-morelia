import fs from 'fs';

const fd = fs.openSync('./public/ISLA_DE_CALOR_3D_V5.glb', 'r');
const chunkHeader = Buffer.alloc(8);
fs.readSync(fd, chunkHeader, 0, 8, 12);
const chunkLength = chunkHeader.readUInt32LE(0);
const jsonBuf = Buffer.alloc(chunkLength);
fs.readSync(fd, jsonBuf, 0, chunkLength, 20);
fs.closeSync(fd);

const gltf = JSON.parse(jsonBuf.toString('utf8'));
gltf.meshes.forEach((m) => {
  console.log(`\nMesh: ${m.name}`);
  m.primitives.forEach((p, i) => {
    console.log(`  Primitive #${i}:`);
    console.log(`    Attributes:`, Object.keys(p.attributes));
    const mat = gltf.materials[p.material];
    console.log(`    Material name:`, mat?.name);
    console.log(`    baseColorTexture:`, mat?.pbrMetallicRoughness?.baseColorTexture);
  });
});
