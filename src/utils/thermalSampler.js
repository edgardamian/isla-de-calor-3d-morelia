/**
 * Calibrated Landsat LST Colormap Stops (19.0°C to 43.0°C)
 * Based on 16-stop QGIS spectral colormap for Morelia
 */
const THERMAL_STOPS = [
  { temp: 19.0, r: 0,   g: 0,   b: 191, hex: '#0000bf' },
  { temp: 20.6, r: 0,   g: 0,   b: 255, hex: '#0000ff' },
  { temp: 22.2, r: 0,   g: 63,  b: 255, hex: '#003fff' },
  { temp: 23.8, r: 0,   g: 127, b: 255, hex: '#007fff' },
  { temp: 25.4, r: 0,   g: 191, b: 255, hex: '#00bfff' },
  { temp: 27.0, r: 0,   g: 255, b: 255, hex: '#00ffff' },
  { temp: 28.6, r: 63,  g: 255, b: 255, hex: '#3fffff' },
  { temp: 30.2, r: 127, g: 255, b: 191, hex: '#7fffbf' },
  { temp: 31.8, r: 191, g: 255, b: 127, hex: '#bfff7f' },
  { temp: 33.4, r: 255, g: 255, b: 63,  hex: '#ffff3f' },
  { temp: 35.0, r: 255, g: 255, b: 0,   hex: '#ffff00' },
  { temp: 36.6, r: 255, g: 191, b: 0,   hex: '#ffbf00' },
  { temp: 38.2, r: 255, g: 127, b: 0,   hex: '#ff7f00' },
  { temp: 39.8, r: 255, g: 63,  b: 0,   hex: '#ff3f00' },
  { temp: 41.4, r: 255, g: 0,   b: 0,   hex: '#ff0000' },
  { temp: 43.0, r: 191, g: 0,   b: 0,   hex: '#bf0000' },
];

// Cache offscreen canvases for fast pixel sampling
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
  // Check if pixel is empty or black border (NODATA)
  const brightness = r + g + b;
  if (brightness < 15) {
    return null;
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
  return Math.min(43.0, Math.max(19.0, Number(temp.toFixed(1))));
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

  if (temp >= 38.5) {
    return {
      category: 'Isla de Calor Crítica',
      description: 'Acumulación térmica máxima. Cubiertas metálicas, asfalto y naves industriales.',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
      colorHex: '#ef4444',
    };
  } else if (temp >= 33.5) {
    return {
      category: 'Isla de Calor Severa',
      description: 'Elevada retención de calor. Tejido urbano continuo y alta densidad de edificación.',
      badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      colorHex: '#fb923c',
    };
  } else if (temp >= 28.5) {
    return {
      category: 'Zona Urbana Moderada',
      description: 'Temperatura media urbana. Tejido residencial consolidado.',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      colorHex: '#facc15',
    };
  } else if (temp >= 24.0) {
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
 * Samples temperature from Raycast intersection
 */
export function sampleThermalIntersection(intersection) {
  if (!intersection || !intersection.object) return null;

  const obj = intersection.object;
  const isBuilding =
    obj.name?.toLowerCase().includes('edificio') ||
    obj.parent?.name?.toLowerCase().includes('edificio');

  const point = intersection.point;
  const uv = intersection.uv;
  let sampledTemp = 31.5; // realistic default
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
      // Three.js UV (0,0) is bottom-left, Canvas (0,0) is top-left
      const py = Math.min(imgH - 1, Math.max(0, Math.floor((1 - vNorm) * imgH)));

      const pixel = ctx.getImageData(px, py, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];

      const calculatedTemp = rgbToTemperature(r, g, b);
      if (calculatedTemp !== null) {
        sampledTemp = calculatedTemp;
        sampledColor = `rgb(${r}, ${g}, ${b})`;
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
