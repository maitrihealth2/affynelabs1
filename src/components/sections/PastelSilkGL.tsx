import React, { useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ *
 *  PastelSilkGL – your real image, distorted live in a WebGL shader.
 *  The cursor drags/pushes the image like fabric; a wave simulation
 *  carries the motion outward, then springs ease everything back.
 *
 *  Usage:  <PastelSilkGL src="/assets/mythri_pastel_art.jpg" />
 * ------------------------------------------------------------------ */

// ---- tunables --------------------------------------------------------
const GW = 96, GH = 54;   // simulation grid resolution
const MAXD = 0.06;        // max displacement (fraction of screen)
const RADIUS = 0.2;       // cursor influence radius (in screen-height units)
const DRAG = 0.55;        // how strongly cursor speed drags the image
const PUSH = 0.0018;      // gentle outward push while hovering
const WAVE = 0.28;        // how fast ripples travel (keep < 0.45)
const SPRING = 0.012;     // pull back to rest (lower = slower, lazier return)
const DAMP = 0.965;       // lower = settles faster, higher = wobbles longer
const AMBIENT = 1;        // idle drift strength (0 = off)

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImg;
uniform sampler2D uDisp;
uniform vec2 uRes;
uniform vec2 uImgSize;
uniform float uTime;
uniform float uAmb;
const float MAXD = ${MAXD.toFixed(4)};

vec2 getD(vec2 uv){ return (texture2D(uDisp, uv).rg - 0.5) * 2.0 * MAXD; }

vec3 sampleImg(vec2 uv){
  float ra = uRes.x / uRes.y, ia = uImgSize.x / uImgSize.y;
  vec2 s = ra > ia ? vec2(1.0, ia / ra) : vec2(ra / ia, 1.0);   // "cover" fit
  vec2 p = (uv - 0.5) * s + 0.5;
  p = 1.0 - abs(1.0 - mod(p, 2.0));                              // mirror edges
  return texture2D(uImg, p).rgb;
}

void main(){
  vec2 uv = vUv;
  vec2 d = getD(uv);

  // slow ambient drift so the scene breathes when idle
  vec2 amb = uAmb * vec2(
    sin(uv.y * 5.0 + uTime * 0.40) + 0.6 * sin(uv.y * 11.0 - uTime * 0.27),
    cos(uv.x * 4.0 + uTime * 0.33) + 0.6 * cos(uv.x * 10.0 + uTime * 0.21)
  ) * 0.0022;

  vec2 p = uv - d - amb;

  // faint chromatic split where the image is being stretched (glassy edges)
  vec3 col;
  col.r = sampleImg(p + d * 0.35).r;
  col.g = sampleImg(p).g;
  col.b = sampleImg(p - d * 0.35).b;

  // fake silk lighting from the displacement field: stretched areas catch
  // light, compressed areas fall into soft shade
  float e = 1.0 / 96.0;
  float gx = getD(uv + vec2(e, 0.0)).x - getD(uv - vec2(e, 0.0)).x;
  float gy = getD(uv + vec2(0.0, e)).y - getD(uv - vec2(0.0, e)).y;
  float dg = getD(uv + vec2(e, e)).x - getD(uv - vec2(e, e)).x;
  col += (gx + gy) * 4.0 + dg * 2.0;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

interface PastelSilkGLProps {
  src?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function PastelSilkGL({
  src = '/assets/mythri_pastel_art.jpg',
  className = '',
  style = {},
}: PastelSilkGLProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };

    const vertShader = compile(gl.VERTEX_SHADER, VERT);
    const fragShader = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;

    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U('uRes');
    const uImgSize = U('uImgSize');
    const uTime = U('uTime');
    const uAmb = U('uAmb');
    gl.uniform1i(U('uImg'), 0);
    gl.uniform1i(U('uDisp'), 1);

    const setupTex = (unit: number) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };
    const imgTex = setupTex(0);
    const dispTex = setupTex(1);

    // ---- simulation state (displacement + velocity per grid cell) ----
    const N = GW * GH;
    const dx = new Float32Array(N), dy = new Float32Array(N);
    const vx = new Float32Array(N), vy = new Float32Array(N);
    const data = new Uint8Array(N * 4);
    for (let i = 0; i < N; i++) {
      data[i * 4] = 128;
      data[i * 4 + 1] = 128;
      data[i * 4 + 3] = 255;
    }

    const mouse = { x: 0, y: 0, px: null as number | null, py: null as number | null, vx: 0, vy: 0, active: false };
    let w = 1, h = 1, raf = 0, ready = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      if (!wrap || !canvas) return;
      const b = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(b.width, 1);
      h = Math.max(b.height, 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const onMove = (e: PointerEvent) => {
      if (!wrap) return;
      const b = wrap.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width;
      const y = 1 - (e.clientY - b.top) / b.height; // y-up, matches the texture
      if (mouse.px !== null && mouse.py !== null) {
        mouse.vx = Math.max(-0.05, Math.min(0.05, x - mouse.px));
        mouse.vy = Math.max(-0.05, Math.min(0.05, y - mouse.py));
      }
      mouse.x = mouse.px = x;
      mouse.y = mouse.py = y;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.px = mouse.py = null;
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerdown', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') onLeave();
    };
    wrap.addEventListener('pointerup', onPointerUp);

    const step = () => {
      const aspect = w / h, R2 = RADIUS * RADIUS;
      for (let j = 0; j < GH; j++) {
        for (let i = 0; i < GW; i++) {
          const k = j * GW + i;
          const l = i > 0 ? k - 1 : k, r = i < GW - 1 ? k + 1 : k;
          const dn = j > 0 ? k - GW : k, up = j < GH - 1 ? k + GW : k;
          // wave coupling + spring back to rest
          vx[k] += ((dx[l] + dx[r] + dx[dn] + dx[up]) * 0.25 - dx[k]) * WAVE - dx[k] * SPRING;
          vy[k] += ((dy[l] + dy[r] + dy[dn] + dy[up]) * 0.25 - dy[k]) * WAVE - dy[k] * SPRING;
          // cursor
          if (mouse.active) {
            const ex = ((i + 0.5) / GW - mouse.x) * aspect;
            const ey = (j + 0.5) / GH - mouse.y;
            const d2 = ex * ex + ey * ey;
            if (d2 < R2) {
              let f = 1 - d2 / R2;
              f *= f;
              const dist = Math.sqrt(d2) + 1e-4;
              vx[k] += mouse.vx * f * DRAG + (ex / dist) * f * PUSH / aspect;
              vy[k] += mouse.vy * f * DRAG + (ey / dist) * f * PUSH;
            }
          }
        }
      }
      for (let k = 0; k < N; k++) {
        vx[k] *= DAMP;
        vy[k] *= DAMP;
        dx[k] = Math.max(-MAXD, Math.min(MAXD, dx[k] + vx[k]));
        dy[k] = Math.max(-MAXD, Math.min(MAXD, dy[k] + vy[k]));
        data[k * 4] = 128 + (dx[k] / MAXD) * 127;
        data[k * 4 + 1] = 128 + (dy[k] / MAXD) * 127;
      }
      mouse.vx *= 0.8;
      mouse.vy *= 0.8;
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!ready) return;
      step();
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, dispTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GW, GH, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform1f(uAmb, reduced ? 0 : AMBIENT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imgTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.uniform2f(uImgSize, img.naturalWidth, img.naturalHeight);
      ready = true;
    };
    img.src = src;
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerdown', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('pointerup', onPointerUp);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [src]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        touchAction: 'none',
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

