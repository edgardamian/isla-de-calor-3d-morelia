import fs from 'fs';
import { fromArrayBuffer } from 'geotiff';

async function main() {
  const buf = fs.readFileSync('imagen_termica_sig/LST_Celsius_Morelia_20251019_FINAL.tif');
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  const tiff = await fromArrayBuffer(ab);
  const image = await tiff.getImage();

  console.log('Width:', image.getWidth());
  console.log('Height:', image.getHeight());
  console.log('SamplesPerPixel:', image.getSamplesPerPixel());
  console.log('BitsPerSample:', image.getBitsPerSample());
  console.log('SampleFormat:', image.getSampleFormat());
  console.log('BoundingBox:', image.getBoundingBox());
  console.log('GeoKeys:', image.getGeoKeys());

  const rasters = await image.readRasters();
  const data = rasters[0];

  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  let count = 0;
  const sampleValues = [];

  for (let i = 0; i < data.length; i++) {
    const val = data[i];
    // Filter out NoData (common NoData: -9999, NaN, < -50, > 150)
    if (!isNaN(val) && isFinite(val) && val > -40 && val < 100) {
      if (val < min) min = val;
      if (val > max) max = val;
      sum += val;
      count++;
      if (sampleValues.length < 500000 && Math.random() < 0.2) {
        sampleValues.push(val);
      }
    }
  }

  sampleValues.sort((a, b) => a - b);
  const p = (pct) => sampleValues[Math.floor(sampleValues.length * (pct / 100))];

  console.log('\n=== REAL LST GEOTIFF STATISTICS (CELSIUS) ===');
  console.log(`Min: ${min.toFixed(2)} °C`);
  console.log(`Max: ${max.toFixed(2)} °C`);
  console.log(`Mean: ${(sum / count).toFixed(2)} °C`);
  console.log(`P2% (Coldest vegetative/water): ${p(2)?.toFixed(2)} °C`);
  console.log(`P10% (Vegetation/shadows):     ${p(10)?.toFixed(2)} °C`);
  console.log(`P25% (Rural / Mixed):          ${p(25)?.toFixed(2)} °C`);
  console.log(`P50% (Median Urban/Rural):     ${p(50)?.toFixed(2)} °C`);
  console.log(`P75% (Dense Urban Residential):${p(75)?.toFixed(2)} °C`);
  console.log(`P90% (Commercial / Asphalt):   ${p(90)?.toFixed(2)} °C`);
  console.log(`P98% (Extreme Heat Island):    ${p(98)?.toFixed(2)} °C`);
  console.log(`Valid pixels count: ${count.toLocaleString()}`);

  // Histogram bins (10 equal intervals)
  console.log('\n=== TEMPERATURE HISTOGRAM DISTRIBUTION ===');
  const binStep = (max - min) / 10;
  const bins = new Array(10).fill(0);
  for (const v of sampleValues) {
    const idx = Math.min(9, Math.max(0, Math.floor((v - min) / binStep)));
    bins[idx]++;
  }
  for (let b = 0; b < 10; b++) {
    const bStart = min + b * binStep;
    const bEnd = bStart + binStep;
    const pct = ((bins[b] / sampleValues.length) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(pct / 2));
    console.log(`[${bStart.toFixed(1)}°C - ${bEnd.toFixed(1)}°C]: ${pct.padStart(5)}% | ${bar}`);
  }
}

main().catch(console.error);
