import * as THREE from 'three';

/**
 * Creates a custom MeshStandardMaterial with an onBeforeCompile GLSL hook
 * that transforms the satellite thermal texture into an ultra-differentiable 10-color Turbo/Spectral colormap.
 */
export function createThermalGradientMaterial(baseTexture, wireframe = false) {
  const mat = new THREE.MeshStandardMaterial({
    map: baseTexture,
    roughness: 0.35,
    metalness: 0.08,
    wireframe: wireframe,
    side: THREE.DoubleSide,
  });

  mat.userData.isThermalGradient = true;

  mat.onBeforeCompile = (shader) => {
    // Inject the 10-stop scientific thermal colormap GLSL function
    shader.fragmentShader = `
      vec3 getThermalSpectralColor(float t) {
        t = clamp(t, 0.0, 1.0);
        
        // 10 distinct, calibrated color stops (17.9°C to 45.3°C)
        vec3 c0 = vec3(0.039, 0.039, 0.180); // #0a0a2e (~18°C Azul Noche)
        vec3 c1 = vec3(0.000, 0.333, 0.831); // #0055d4 (~21°C Azul Eléctrico)
        vec3 c2 = vec3(0.000, 0.824, 0.745); // #00d2be (~24°C Turquesa / Cian)
        vec3 c3 = vec3(0.133, 0.773, 0.369); // #22c55e (~27°C Verde Esmeralda)
        vec3 c4 = vec3(0.639, 0.902, 0.208); // #a3e635 (~30°C Lima / Chartreuse)
        vec3 c5 = vec3(0.980, 0.800, 0.082); // #facc15 (~33°C Amarillo Solar)
        vec3 c6 = vec3(0.984, 0.573, 0.235); // #fb923c (~36°C Naranja Fuego)
        vec3 c7 = vec3(0.937, 0.267, 0.267); // #ef4444 (~39°C Rojo Térmico Vivo)
        vec3 c8 = vec3(0.851, 0.275, 0.937); // #d946ef (~42°C Magenta Fucsia)
        vec3 c9 = vec3(1.000, 1.000, 1.000); // #ffffff (~45.3°C Blanco Incandescente)
        
        if (t < 0.10) return mix(c0, c1, t / 0.10);
        if (t < 0.22) return mix(c1, c2, (t - 0.10) / 0.12);
        if (t < 0.35) return mix(c2, c3, (t - 0.22) / 0.13);
        if (t < 0.48) return mix(c3, c4, (t - 0.35) / 0.13);
        if (t < 0.60) return mix(c4, c5, (t - 0.48) / 0.12);
        if (t < 0.72) return mix(c5, c6, (t - 0.60) / 0.12);
        if (t < 0.84) return mix(c6, c7, (t - 0.72) / 0.12);
        if (t < 0.94) return mix(c7, c8, (t - 0.84) / 0.10);
        return mix(c8, c9, (t - 0.94) / 0.06);
      }
      ` + shader.fragmentShader;

    // Replace the standard map_fragment sampling with colormap translation
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
      #ifdef USE_MAP
        vec4 sampledTexel = texture2D( map, vMapUv );
        
        // Calculate perceived thermal intensity from satellite image
        // If image is already RGB heat colored or grayscale
        float thermalIntensity = dot(sampledTexel.rgb, vec3(0.299, 0.587, 0.114));
        
        // Apply high-contrast 10-stop spectral gradient
        vec3 thermalRamp = getThermalSpectralColor(thermalIntensity);
        
        // Boost contrast and vibrancy
        diffuseColor.rgb *= thermalRamp * 1.35;
      #endif
      `
    );
  };

  return mat;
}
