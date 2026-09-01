import fs from 'fs';

const fd = fs.openSync('./public/ISLA_DE_CALOR_3D_V5.glb', 'r');
const chunkHeader = Buffer.alloc(8);
fs.readSync(fd, chunkHeader, 0, 8, 12);
const chunkLength = chunkHeader.readUInt32LE(0);
const jsonBuf = Buffer.alloc(chunkLength);
fs.readSync(fd, jsonBuf, 0, chunkLength, 20);

const gltf = JSON.parse(jsonBuf.toString('utf8'));

// Find bufferViews
console.log('BufferViews count:', gltf.bufferViews.length);
console.log('Images:', gltf.images);

// The binary chunk starts at 20 + chunkLength + 8
const binChunkOffset = 20 + chunkLength + 8;

gltf.images.forEach((img, idx) => {
  if (img.bufferView !== undefined) {
    const bv = gltf.bufferViews[img.bufferView];
    const imgBuf = Buffer.alloc(bv.byteLength);
    fs.readSync(fd, imgBuf, 0, bv.byteLength, binChunkOffset + (bv.byteOffset || 0));
    const ext = img.mimeType === 'image/png' ? 'png' : 'jpg';
    const filename = `extracted_img_${idx}_${img.name || 'unnamed'}.${ext}`;
    fs.writeFileSync(filename, imgBuf);
    console.log(`Saved ${filename} (${(bv.byteLength / 1024).toFixed(1)} KB)`);
  }
});

fs.closeSync(fd);
