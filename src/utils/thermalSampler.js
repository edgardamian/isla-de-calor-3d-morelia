import * as THREE from 'three';

/**
 * Calibrated Landsat LST Colormap Stops (19.0°C to 45.0°C)
 * Calibrated to exact 16-range QGIS thermal raster scale for Morelia
 */
export const THERMAL_STOPS = [
  { temp: 19.0, r: 0,   g: 0,   b: 191, hex: '#0000bf' },
  { temp: 20.7, r: 0,   g: 0,   b: 255, hex: '#0000ff' },
  { temp: 22.5, r: 0,   g: 63,  b: 255, hex: '#003fff' },
  { temp: 24.2, r: 0,   g: 127, b: 255, hex: '#007fff' },
  { temp: 25.9, r: 0,   g: 191, b: 255, hex: '#00bfff' },
  { temp: 27.7, r: 0,   g: 255, b: 255, hex: '#00ffff' },
  { temp: 29.4, r: 63,  g: 255, b: 255, hex: '#3fffff' },
  { temp: 31.1, r: 127, g: 255, b: 191, hex: '#7fffbf' },
  { temp: 32.8, r: 191, g: 255, b: 127, hex: '#bfff7f' },
  { temp: 34.6, r: 255, g: 255, b: 63,  hex: '#ffff3f' },
  { temp: 36.3, r: 255, g: 255, b: 0,   hex: '#ffff00' },
  { temp: 38.0, r: 255, g: 191, b: 0,   hex: '#ffbf00' },
  { temp: 39.8, r: 255, g: 127, b: 0,   hex: '#ff7f00' },
  { temp: 41.5, r: 255, g: 63,  b: 0,   hex: '#ff3f00' },
  { temp: 43.3, r: 255, g: 0,   b: 0,   hex: '#ff0000' },
  { temp: 45.0, r: 191, g: 0,   b: 0,   hex: '#bf0000' },
];

// Cache offscreen canvases for ultra-fast pixel sampling
const canvasCache = new WeakMap();

function getCanvasContext(image) {
  if (canvasCache.has(image)) {
    return canvasCache.get(image);
  }

  const canvas = document.createElement('canvas');
  canvas.width = image.width || image.videoWidth || 1024;
  canvas.height = image.height || image.videoHeight || 1024;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  try {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  } catch (e) {
    console.warn('Unable to draw texture image to canvas:', e);
  }

  canvasCache.set(image, ctx);
  return ctx;
}

/**
 * Converts sampled RGB values into calibrated temperature in °C
 */
export function rgbToTemperature(r, g, b) {
  const brightness = r + g + b;
  if (brightness < 15) {
    return null; // NODATA or black border
  }

  // Find two closest color stops
  let closestIdx = 0;
  let minDist = Infinity;

  for (let i = 0; i < THERMAL_STOPS.length; i++) {
    const s = THERMAL_STOPS[i];
    const dr = r - s.r;
    const dg = g - s.g;
    const db = b - s.b;
    const dist = dr * dr + dg * dg + db * db;

    if (dist < minDist) {
      minDist = dist;
      closestIdx = i;
    }
  }

  // Find neighboring stop for continuous interpolation
  let secondIdx = closestIdx;
  let secondMinDist = Infinity;

  for (let i = 0; i < THERMAL_STOPS.length; i++) {
    if (i === closestIdx) continue;
    const s = THERMAL_STOPS[i];
    const dr = r - s.r;
    const dg = g - s.g;
    const db = b - s.b;
    const dist = dr * dr + dg * dg + db * db;

    if (dist < secondMinDist) {
      secondMinDist = dist;
      secondIdx = i;
    }
  }

  const s1 = THERMAL_STOPS[closestIdx];
  const s2 = THERMAL_STOPS[secondIdx];

  const w1 = Math.sqrt(secondMinDist) / (Math.sqrt(minDist) + Math.sqrt(secondMinDist) + 0.0001);
  const w2 = 1.0 - w1;

  const temp = s1.temp * w1 + s2.temp * w2;
  return Math.min(45.0, Math.max(19.0, Number(temp.toFixed(1))));
}

/**
 * Returns thermal classification metadata based on temperature
 */
export function getThermalClassification(temp) {
  if (temp === null || temp === undefined) {
    return {
      category: 'Sin Datos Térmicos',
      description: 'Zona de base o faldón sin cobertura satelital.',
      badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
      colorHex: '#64748b',
    };
  }

  if (temp >= 40.0) {
    return {
      category: 'Isla de Calor Crítica',
      description: 'Acumulación térmica extrema. Cubiertas metálicas, asfalto y naves industriales.',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
      colorHex: '#ef4444',
    };
  } else if (temp >= 35.0) {
    return {
      category: 'Isla de Calor Severa',
      description: 'Elevada retención de calor. Tejido urbano continuo y alta densidad construida.',
      badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      colorHex: '#fb923c',
    };
  } else if (temp >= 30.0) {
    return {
      category: 'Zona Urbana Moderada',
      description: 'Temperatura media urbana. Tejido residencial consolidado.',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      colorHex: '#facc15',
    };
  } else if (temp >= 25.0) {
    return {
      category: 'Microclima Templado',
      description: 'Mitigación térmica efectiva por áreas verdes, parques y menor densidad.',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      colorHex: '#34d399',
    };
  } else {
    return {
      category: 'Microclima Fresco',
      description: 'Zona de amortiguamiento térmico. Cuerpos de agua, vegetación riparia o bosque.',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      colorHex: '#38bdf8',
    };
  }
}

/**
 * Extracts precise thermal texture UV coordinates from intersection
 */
function getThermalUV(intersection) {
  const obj = intersection.object;
  const geom = obj?.geometry;
  if (!geom) return intersection.uv;

  // On MDE terrain, the thermal Landsat texture is mapped to uv1 / uv2 (TEXCOORD_1)
  // On buildings, it is mapped to uv (TEXCOORD_0)
  const isBuilding =
    obj.name?.toLowerCase().includes('edificio') ||
    obj.parent?.name?.toLowerCase().includes('edificio');

  const targetAttr = isBuilding
    ? geom.attributes.uv
    : (geom.attributes.uv1 || geom.attributes.uv2 || geom.attributes.uv);

  if (intersection.face && targetAttr) {
    const a = intersection.face.a;
    const b = intersection.face.b;
    const c = intersection.face.c;

    const pos = geom.attributes.position;
    if (pos) {
      const pA = new THREE.Vector3().fromBufferAttribute(pos, a);
      const pB = new THREE.Vector3().fromBufferAttribute(pos, b);
      const pC = new THREE.Vector3().fromBufferAttribute(pos, c);

      // Local intersection point
      const localPoint = intersection.point.clone();
      obj.worldToLocal(localPoint);

      const uvA = new THREE.Vector2().fromBufferAttribute(targetAttr, a);
      const uvB = new THREE.Vector2().fromBufferAttribute(targetAttr, b);
      const uvC = new THREE.Vector2().fromBufferAttribute(targetAttr, c);

      const targetUV = new THREE.Vector2();
      THREE.Triangle.getInterpolation(localPoint, pA, pB, pC, uvA, uvB, uvC, targetUV);
      return targetUV;
    }
  }

  return intersection.uv;
}

/**
 * Samples temperature from Raycast intersection
 */
export function sampleThermalIntersection(intersection) {
  if (!intersection || !intersection.object) return null;

  const obj = intersection.object;
  const isBuilding =
    obj.name?.toLowerCase().includes('edificio') ||
    obj.parent?.name?.toLowerCase().includes('edificio');

  const point = intersection.point;
  const uv = getThermalUV(intersection);

  let sampledTemp = 31.5; // fallback
  let sampledColor = '#facc15';

  const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
  const map = mat?.map;

  if (map && map.image && uv) {
    try {
      const ctx = getCanvasContext(map.image);
      const imgW = map.image.width || 1024;
      const imgH = map.image.height || 1024;

      // Wrap UV coordinates to [0, 1]
      const uNorm = ((uv.x % 1) + 1) % 1;
      const vNorm = ((uv.y % 1) + 1) % 1;

      const px = Math.min(imgW - 1, Math.max(0, Math.floor(uNorm * imgW)));
      // In GLTF textures, flipY=false, so v=0 is the top (Y=0) of the canvas
      const py = Math.min(imgH - 1, Math.max(0, Math.floor(vNorm * imgH)));

      // Sample a 3x3 patch centered at (px, py) for smooth, noise-free reading
      let bestR = 0, bestG = 0, bestB = 0;
      let maxTemp = -Infinity;
      let validCount = 0;
      let totalTemp = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const sx = Math.min(imgW - 1, Math.max(0, px + dx));
          const sy = Math.min(imgH - 1, Math.max(0, py + dy));
          const pData = ctx.getImageData(sx, sy, 1, 1).data;
          const r = pData[0], g = pData[1], b = pData[2];
          const brightness = r + g + b;

          if (brightness > 20) {
            const t = rgbToTemperature(r, g, b);
            if (t !== null) {
              totalTemp += t;
              validCount++;
              if (t > maxTemp) {
                maxTemp = t;
                bestR = r;
                bestG = g;
                bestB = b;
              }
            }
          }
        }
      }

      if (validCount > 0) {
        // Use center / dominant pixel
        sampledTemp = Number((totalTemp / validCount).toFixed(1));
        sampledColor = `rgb(${bestR}, ${bestG}, ${bestB})`;
      }
    } catch (err) {
      console.warn('Error reading pixel from thermal texture:', err);
    }
  }

  // Calculate altitude in msnm (Morelia baseline 1,880m to 2,150m)
  const estimatedAltitude = Math.round(1890 + Math.max(0, (point.y + 15) * 5.5));
  const classification = getThermalClassification(sampledTemp);

  return {
    point: [point.x, point.y, point.z],
    normal: intersection.normal ? [intersection.normal.x, intersection.normal.y, intersection.normal.z] : [0, 1, 0],
    temperature: sampledTemp,
    colorHex: sampledColor,
    objectType: isBuilding ? 'Edificación 3D' : 'Terreno Topográfico (MDE)',
    isBuilding,
    altitudeMsnm: estimatedAltitude,
    classification,
  };
}
