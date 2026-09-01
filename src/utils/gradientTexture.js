import * as THREE from 'three';

/**
 * Creates a high-contrast, multi-stop thermal gradient texture (Turbo / Spectral Colormap)
 * calibrated with real GeoTIFF LST data (18°C to 45.3°C).
 */
export function createHighContrastThermalTexture() {
  const width = 1024;
  const height = 1;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, width, 0);

  // 10 distinct, highly differentiated color stops
  // Based on Morelia GeoTIFF analysis (17.9°C to 45.3°C)
  gradient.addColorStop(0.00, '#0a0a2e'); // ~18°C - Azul Noche Profundo (Cuerpos de agua/sombra)
  gradient.addColorStop(0.10, '#0055d4'); // ~21°C - Azul Real Eléctrico (Bosque denso / Atécuaro)
  gradient.addColorStop(0.22, '#00d2be'); // ~24°C - Turquesa / Cian Brillante (Vegetación riparia)
  gradient.addColorStop(0.35, '#22c55e'); // ~27°C - Verde Esmeralda (Parques y zonas periurbanas)
  gradient.addColorStop(0.48, '#a3e635'); // ~30°C - Verde Lima / Chartreuse (Media urbana residencial)
  gradient.addColorStop(0.60, '#facc15'); // ~33°C - Amarillo Dorado Intenso (Tejido urbano denso)
  gradient.addColorStop(0.72, '#fb923c'); // ~36°C - Naranja Fuego (Corredores viales principales)
  gradient.addColorStop(0.84, '#ef4444'); // ~39°C - Rojo Térmico Vivo (Isla de calor crítica)
  gradient.addColorStop(0.94, '#d946ef'); // ~42°C - Magenta / Fucsia Neón (Cubiertas y naves industriales)
  gradient.addColorStop(1.00, '#ffffff'); // ~45.3°C - Blanco Incandescente (Punto crítico máximo)

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

/**
 * Creates a 2D height + thermal spatial gradient shader material for buildings
 */
export function createBuildingGradientMaterial(wireframe = false) {
  const gradientTexture = createHighContrastThermalTexture();

  // Custom PBR standard material that maps the thermal gradient across building coordinates
  const mat = new THREE.MeshStandardMaterial({
    map: gradientTexture,
    roughness: 0.35,
    metalness: 0.1,
    wireframe: wireframe,
    side: THREE.DoubleSide,
  });

  return { mat, gradientTexture };
}
