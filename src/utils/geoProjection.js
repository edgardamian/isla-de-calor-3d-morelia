/**
 * Utility for Georeferencing & Projections
 * Transforms WGS84 Geographic Coordinates (EPSG:4326) into UTM Zone 14N (EPSG:32614)
 * and maps them into the 3D GLTF Scene coordinate system of Morelia.
 */

// Model calibration center coordinates in UTM Zone 14N
export const UTM_CENTER_X = 268020;
export const UTM_CENTER_Y = 2179125;

// Baseline elevation of Morelia valley floor in glTF units
export const BASELINE_ELEVATION_Y = 1925;

/**
 * Converts WGS84 [lon, lat] in decimal degrees to UTM Zone 14N [easting, northing] in meters.
 * Accurate Snyder/Karney Transverse Mercator formulation.
 */
export function wgs84ToUtm14(lon, lat) {
  const a = 6378137.0; // WGS84 semi-major axis
  const f = 1 / 298.257223563; // Flattening
  const e = Math.sqrt(2 * f - f * f);
  const e2 = e * e;
  const e_prime2 = e2 / (1 - e2);
  const k0 = 0.9996;
  const lon0 = (-99.0 * Math.PI) / 180.0; // Central meridian for UTM Zone 14N (-99° W)

  const phi = (lat * Math.PI) / 180.0;
  const lam = (lon * Math.PI) / 180.0;

  const N = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
  const T = Math.tan(phi) ** 2;
  const C = e_prime2 * Math.cos(phi) ** 2;
  const A = (lam - lon0) * Math.cos(phi);

  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * phi -
      ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) *
        Math.sin(2 * phi) +
      ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * phi) -
      ((35 * e2 ** 3) / 3072) * Math.sin(6 * phi));

  const x =
    k0 *
      N *
      (A +
        ((1 - T + C) * A ** 3) / 6 +
        ((5 - 18 * T + T ** 2 + 72 * C - 58 * e_prime2) * A ** 5) / 120) +
    500000.0;

  const y =
    k0 *
    (M +
      N *
        Math.tan(phi) *
        (A ** 2 / 2 +
          ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24 +
          ((61 - 58 * T + T ** 2 + 600 * C - 330 * e_prime2) * A ** 6) / 720));

  return [x, y];
}

/**
 * Maps WGS84 [lon, lat] directly into the local 3D GLTF scene space [x, z].
 * In standard 3D/glTF from GIS:
 * +X is East, -Z is North.
 */
export function wgs84To3DLocal(lon, lat) {
  const [utmX, utmY] = wgs84ToUtm14(lon, lat);
  const x = utmX - UTM_CENTER_X;
  const z = -(utmY - UTM_CENTER_Y);
  return [x, z];
}

/**
 * Calculates centroid and 3D perimeter points of a polygon ring.
 */
export function processPolygonGeometry(ringCoordinates) {
  if (!ringCoordinates || ringCoordinates.length === 0) {
    return null;
  }

  let sumLon = 0;
  let sumLat = 0;
  const count = ringCoordinates.length;
  const ring3D = [];

  for (let i = 0; i < count; i++) {
    const [lon, lat] = ringCoordinates[i];
    sumLon += lon;
    sumLat += lat;
    const [x3d, z3d] = wgs84To3DLocal(lon, lat);
    ring3D.push([x3d, z3d]);
  }

  const centerLon = sumLon / count;
  const centerLat = sumLat / count;
  const [centerX, centerZ] = wgs84To3DLocal(centerLon, centerLat);

  // Compute bounding radius from centroid to furthest perimeter vertex
  let maxDist = 0;
  for (let i = 0; i < count; i++) {
    const dx = ring3D[i][0] - centerX;
    const dz = ring3D[i][1] - centerZ;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > maxDist) maxDist = dist;
  }
  const radius = Math.max(60, maxDist * 0.95);

  return {
    centerLon,
    centerLat,
    centroid3D: [centerX, centerZ],
    radius,
    ring3D,
  };
}
