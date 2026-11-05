// Waves preset from the supplied 21st.dev shader, adapted to a static page.
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
uniform float u_time;
uniform vec3 u_ink, u_graphite, u_orange;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  p = mat2(0.81, 0.59, -0.59, 0.81) * (p * 2.0) + vec2(0.11, -0.19);
  p += 0.116 * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  p += 0.042 * (vec2(fbm(p * 1.536 + 13.0), fbm(p * 1.536 + vec2(5.2, 1.3))) - 0.5);

  // Keep the original wave plus noise field, tilted toward the artwork.
  float wave = 0.72 - uv.y * 0.7 + (uv.x - 0.5) * 0.42
    + sin(uv.x * 7.86 + u_time * 0.8) * 0.08
    + (fbm(p * 2.0 + u_time * 0.1) - 0.5) * 0.324;
  vec3 col = mix(u_ink, u_graphite, smoothstep(0.0, 0.48, wave));
  col = mix(col, mix(u_ink, u_orange, 0.37), smoothstep(0.25, 0.70, wave));
  col = mix(col, u_orange, smoothstep(0.62, 1.0, wave));
  float vd = length(uv - 0.5) * 1.4142;
  col *= 1.0 - 0.21 * smoothstep(0.35, 1.0, vd);
  col += (grainHash(gl_FragCoord.xy) - 0.5) * 0.035;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function mount(canvas) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
  if (!gl) return;

  function compile(type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  }

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
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

  const buffer = gl.createBuffer();
  if (!buffer) {
    gl.deleteProgram(program);
    return;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'u_resolution');
  const time = gl.getUniformLocation(program, 'u_time');
  const theme = getComputedStyle(canvas);
  for (const [uniform, property] of [['u_ink', '--ink'], ['u_graphite', '--graphite'], ['u_orange', '--orange']]) {
    const color = theme.getPropertyValue(property).trim().slice(1);
    const channels = [0, 2, 4].map(index => parseInt(color.slice(index, index + 2), 16) / 255);
    gl.uniform3fv(gl.getUniformLocation(program, uniform), channels);
  }

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let inView = true;
  let previous = null;
  let elapsed = 0;
  let disposed = false;

  function update() {
    if (disposed || !inView || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = null;
    } else if (!frame) {
      frame = requestAnimationFrame(draw);
    }
  }

  function draw(now) {
    frame = 0;
    if (!motion.matches && previous !== null && now - previous < 1000 / 32) {
      update();
      return;
    }
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    const scale = Math.min(devicePixelRatio, 1.5, Math.sqrt(800000 / (w * h)));
    const width = Math.max(1, Math.round(w * scale));
    const height = Math.max(1, Math.round(h * scale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    if (!motion.matches && previous !== null) elapsed += Math.min(now - previous, 80);
    previous = motion.matches ? null : now;
    gl.uniform2f(resolution, width, height);
    gl.uniform1f(time, motion.matches ? 0 : -elapsed * 0.00055);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.classList.add('is-rendering');
    if (!motion.matches) update();
  }

  const resize = new ResizeObserver(update);
  resize.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  });
  intersection.observe(canvas);
  document.addEventListener('visibilitychange', update);
  motion.addEventListener('change', update);
  canvas.addEventListener('webglcontextlost', () => {
    disposed = true;
    update();
    canvas.classList.remove('is-rendering');
    resize.disconnect();
    intersection.disconnect();
    document.removeEventListener('visibilitychange', update);
    motion.removeEventListener('change', update);
  }, { once: true });
  update();
}

const canvas = document.querySelector('#hero-waves');
if (canvas && 'ResizeObserver' in window && 'IntersectionObserver' in window) mount(canvas);
