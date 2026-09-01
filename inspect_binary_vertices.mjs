import fs from 'fs';

// Read GLB binary chunk directly
const fd = fs.openSync('./public/ISLA_DE_CALOR_3D_V5.glb', 'r');

// Read JSON chunk
const chunk0Header = Buffer.alloc(8);
fs.readSync(fd, chunk0Header, 0, 8, 12);
const jsonLength = chunk0Header.readUInt32LE(0);
const jsonBuf = Buffer.alloc(jsonLength);
fs.readSync(fd, jsonBuf, 0, jsonLength, 20);
const gltf = JSON.parse(jsonBuf.toString('utf8'));

// Binary buffer offset
const binOffset = 20 + jsonLength + 8; // chunk1 data offset

// Read positions and normals of first 50 vertices of mesh 0
const posAcc = gltf.accessors[gltf.meshes[0].primitives[0].attributes.POSITION];
const normAcc = gltf.accessors[gltf.meshes[0].primitives[0].attributes.NORMAL];

const posBv = gltf.bufferViews[posAcc.bufferView];
const normBv = gltf.bufferViews[normAcc.bufferView];

const posBuf = Buffer.alloc(posAcc.count * 12); // 3 * float32
fs.readSync(fd, posBuf, 0, posAcc.count * 12, binOffset + (posBv.byteOffset || 0) + (posAcc.byteOffset || 0));

const normBuf = Buffer.alloc(normAcc.count * 12);
fs.readSync(fd, normBuf, 0, normAcc.count * 12, binOffset + (normBv.byteOffset || 0) + (normAcc.byteOffset || 0));

fs.closeSync(fd);

const posFloats = new Float32Array(posBuf.buffer, posBuf.byteOffset, posAcc.count * 3);
const normFloats = new Float32Array(normBuf.buffer, normBuf.byteOffset, normAcc.count * 3);

console.log('Total building vertices:', posAcc.count);
console.log('\nSample vertices (x, y, z, nx, ny, nz):');
for (let i = 0; i < 30; i++) {
  console.log(`V${i}: pos=(${posFloats[i*3].toFixed(2)}, ${posFloats[i*3+1].toFixed(2)}, ${posFloats[i*3+2].toFixed(2)}) | norm=(${normFloats[i*3].toFixed(2)}, ${normFloats[i*3+1].toFixed(2)}, ${normFloats[i*3+2].toFixed(2)})`);
}
