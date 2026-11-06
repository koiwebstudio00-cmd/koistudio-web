// Adapted from the grainy shaders in Kointenido's carousel system.
const vertexSource = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform int u_theme;
uniform float u_haloPhase;

float grain(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

void main() {
  vec2 uv = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) / u_resolution;
  if (u_theme == 0) uv.y += 0.06;
  const float phase = 0.522;
  vec2 p = uv + vec2(0.09 * sin(uv.y * 5.0 + phase), 0.065 * sin(uv.x * 5.0 - phase));
  vec3 color;
  if (u_theme == 1) {
    vec2 drift = vec2(sin(u_haloPhase) * 0.27, (cos(u_haloPhase) - 1.0) * 0.12);
    float radius = length((p - vec2(1.13, 0.10) - drift) / vec2(1.12, 1.05));
    float band = (radius - 0.86) / 0.105;
    vec2 shade = (p - vec2(1.05, 1.07)) / vec2(0.65, 0.47);
    color = mix(vec3(250.0, 102.0, 8.0), vec3(215.0, 69.0, 8.0), exp(-2.0 * dot(shade, shade)));
    color = mix(color, vec3(255.0, 157.0, 40.0), exp(-band * band) * 0.84);
  } else if (u_theme == 2) {
    vec2 peach = (p - vec2(0.90, 0.35)) / vec2(0.70, 0.54);
    vec2 warm = (p - vec2(0.94, 0.91)) / vec2(0.85, 0.66);
    color = mix(vec3(251.0, 249.0, 245.0), vec3(250.0, 152.0, 88.0),
      exp(-2.0 * dot(peach, peach)) * 0.76);
    color = mix(color, vec3(250.0, 173.0, 124.0),
      exp(-2.0 * dot(warm, warm)) * 0.74);
  } else {
    vec2 drift = vec2(sin(u_haloPhase) * 0.11, (cos(u_haloPhase) - 1.0) * 0.055);
    float radius = length((p - vec2(1.10, 0.15) - drift) / vec2(1.04, 0.93));
    float band = (radius - 0.90) / 0.115;
    vec2 glow = (p - vec2(0.98, 0.79) - drift) / 0.65;
    color = mix(vec3(7.0, 9.0, 10.0), vec3(114.0, 43.0, 15.0),
      exp(-2.0 * dot(glow, glow)) * 0.85);
    color = mix(color, vec3(250.0, 93.0, 0.0),
      exp(-band * band) * 0.84 * smoothstep(0.33, 0.85, uv.y));
  }

  vec2 pixel = gl_FragCoord.xy;
  float noise = grain(pixel) + grain(pixel + 113.0) + grain(pixel + 257.0) - 1.5;
  float grainStrength = u_theme == 0 ? 19.0 : 13.0;
  gl_FragColor = vec4(clamp((color + noise * grainStrength) / 255.0, 0.0, 1.0), 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function mount(canvas) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
  if (!gl) return;

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (program && vertex && fragment) {
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
  }
  if (vertex) gl.deleteShader(vertex);
  if (fragment) gl.deleteShader(fragment);
  if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (program) gl.deleteProgram(program);
    return;
  }

  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'u_resolution');
  const haloPhase = gl.getUniformLocation(program, 'u_haloPhase');
  const theme = { dark: 0, orange: 1, light: 2 }[canvas.dataset.shader];
  const duration = theme === 1 ? 4800 : 18000;
  gl.uniform1i(gl.getUniformLocation(program, 'u_theme'), theme);

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let isVisible = false;
  let frame = 0;
  let lastDraw = null;
  let phase = 0;

  function draw() {
    gl.uniform1f(haloPhase, motion.matches ? 0 : phase);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function animate(now) {
    if (lastDraw === null || now - lastDraw >= 32) {
      if (lastDraw !== null) {
        phase = (phase + (now - lastDraw) * (2 * Math.PI / duration)) % (2 * Math.PI);
      }
      lastDraw = now;
      draw();
    }
    frame = requestAnimationFrame(animate);
  }

  function syncAnimation() {
    if (isVisible && !document.hidden && !motion.matches) {
      if (!frame) frame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      lastDraw = null;
    }
  }

  function updateMotion() {
    syncAnimation();
    if (motion.matches) draw();
  }

  const observer = new ResizeObserver(([{ contentRect }]) => {
    const { width, height } = contentRect;
    if (!width || !height) return;
    const scale = Math.min(window.devicePixelRatio || 1, Math.sqrt(2_000_000 / (width * height)));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    draw();
    canvas.classList.add('is-rendered');
  });
  observer.observe(canvas);

  let intersection;
  if (canvas.hasAttribute('data-shader-motion') && 'IntersectionObserver' in window) {
    intersection = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncAnimation();
    });
    intersection.observe(canvas);
    document.addEventListener('visibilitychange', syncAnimation);
    motion.addEventListener('change', updateMotion);
  }

  canvas.addEventListener('webglcontextlost', () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    intersection?.disconnect();
    document.removeEventListener('visibilitychange', syncAnimation);
    motion.removeEventListener('change', updateMotion);
    canvas.classList.remove('is-rendered');
  }, { once: true });
}

if ('ResizeObserver' in window) {
  document.querySelectorAll('canvas[data-shader]').forEach(mount);
}
