import fs from 'fs';

const fd = fs.openSync('./public/ISLA_DE_CALOR_3D_V5.glb', 'r');
const chunkHeader = Buffer.alloc(8);
fs.readSync(fd, chunkHeader, 0, 8, 12);
const chunkLength = chunkHeader.readUInt32LE(0);
const jsonBuf = Buffer.alloc(chunkLength);
fs.readSync(fd, jsonBuf, 0, chunkLength, 20);
fs.closeSync(fd);

const gltf = JSON.parse(jsonBuf.toString('utf8'));
console.log('Accessor 0 (Buildings Position):', gltf.accessors[0]);
console.log('Accessor 4 (MDE Position):', gltf.accessors[4]);
