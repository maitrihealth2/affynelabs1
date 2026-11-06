import React, { useEffect, useRef, useState } from 'react';

/**
 * <ClothText />
 * Giant footer wordmark filled with a silk-like cloth that ripples,
 * folds and shifts colour around the cursor. Zero dependencies (raw WebGL).
 */

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){
  vUv = vec2(p.x * 0.5 + 0.5, 1.0 - (p.y * 0.5 + 0.5));
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vUv;
uniform sampler2D uMask;
uniform float uTime, uAspect, uHover, uFold;
uniform vec2 uMouse, uVel;
uniform vec3 uC0, uC1, uC2, uHot;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

vec2 toMouse(vec2 uv){ return vec2((uv.x - uMouse.x) * uAspect, uv.y - uMouse.y); }

float heightAt(vec2 uv){
  vec2 q = vec2(uv.x * uAspect, uv.y);
  float t = uTime * 0.5;

  // Rich organic cloth waves and folds
  float h = sin(q.x * 2.8 + t + noise(q * 1.8 + t * 0.6) * 2.4) * 0.45;
  h += sin(q.x * 5.5 - q.y * 3.5 - t * 1.2) * 0.25;
  h += noise(q * 3.5 + vec2(t * 0.4, -t * 0.4)) * 0.35;

  // Interactive touch / cursor ripples
  vec2 d = toMouse(uv);
  float r = length(d);
  float f = exp(-r * r * 1.8) * uHover;
  h += f * (sin(r * 15.0 - uTime * 3.5) * 0.4 + 0.9);
  h += dot(normalize(d + 1e-4), uVel) * f * 1.6;
  return h;
}

void main(){
  float a = texture2D(uMask, vUv).a;
  if (a < 0.003) { gl_FragColor = vec4(0.0); return; }

  float e = 0.0035;
  float h  = heightAt(vUv);
  float hx = heightAt(vUv + vec2(e, 0.0)) - h;
  float hy = heightAt(vUv + vec2(0.0, e)) - h;

  // Aspect-normalized normal for consistent folding depth across screen sizes
  vec3 n = normalize(vec3(-hx / e * uFold * clamp(uAspect * 0.16, 0.8, 1.4), -hy / e * uFold, 1.0));

  vec3 L = normalize(vec3(-0.35, 0.65, 0.75));
  float diff = dot(n, L) * 0.5 + 0.5;
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 20.0);

  // Silk gradient blend across the fold heights
  float m = smoothstep(-0.7, 1.2, h);
  vec3 col = mix(uC0, uC1, smoothstep(0.0, 0.5, m));
  col = mix(col, uC2, smoothstep(0.5, 1.0, m));

  // Ambient traveling shimmer: smooth flowing silk sheen along the letters
  float shimmer = sin(vUv.x * 4.0 - uTime * 1.2 + h * 2.0) * 0.5 + 0.5;
  shimmer = pow(shimmer, 3.5);
  col = mix(col, uHot, shimmer * 0.28);

  // Touch / hover glow
  vec2 d = toMouse(vUv);
  float f = exp(-dot(d, d) * 1.8) * uHover;
  col = mix(col, uHot, clamp(f * 1.3, 0.0, 1.0) * (0.55 + 0.45 * sin(h * 3.0 + uTime * 2.0)));

  col *= 0.74 + 0.42 * diff;
  col += spec * 0.32;
  gl_FragColor = vec4(col * a, a);
}`;

const FONT_URL = "https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@100..900&display=swap";
let fontPromise: Promise<void> | undefined;

function loadGoogleSans(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (!fontPromise) {
    fontPromise = new Promise((res) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FONT_URL;
      l.onload = l.onerror = () => res();
      document.head.appendChild(l);
    });
  }
  return fontPromise;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function buildMask(
  text: string,
  family: string,
  weight: number | string,
  cssW: number,
  dpr: number,
  mScale = 0.94,
  dScale = 0.92
) {
  const c = document.createElement("canvas");
  const probe = c.getContext("2d");
  if (!probe) return { mask: c, cssH: 100 };
  
  probe.font = `${weight} 100px ${family}`;
  const m = probe.measureText(text);
  const w100 = m.width || 1;
  const asc = m.actualBoundingBoxAscent || 75;   // measured, so ascenders/descenders fit
  const desc = m.actualBoundingBoxDescent || 22;

  // Responsive scale:
  // Mobile (< 640px): strictly capped so wordmark never clips horizontally on phones
  // Desktop (>= 1024px): balanced scale (~0.92)
  // Tablet (640px - 1023px): balanced scale (~0.90)
  let scale = 1.0;
  if (cssW < 640) {
    scale = Math.min(mScale, 0.94);
  } else if (cssW >= 1024) {
    scale = Math.min(dScale, 0.92);
  } else {
    scale = 0.90;
  }

  // Safe maximum target width that guarantees clean horizontal margins
  const targetW = Math.min(cssW * 0.94, cssW * scale);
  const fs = (targetW * 100) / w100;
  const k = fs / 100;
  const padTop = Math.max(4, Math.ceil(fs * 0.06));
  const padBottom = Math.max(4, Math.ceil(fs * 0.05));
  const cssH = Math.ceil((asc + desc) * k + padTop + padBottom);

  c.width = Math.round(cssW * dpr);
  c.height = Math.round(cssH * dpr);
  const ctx = c.getContext("2d");
  if (!ctx) return { mask: c, cssH };
  
  ctx.scale(dpr, dpr);
  ctx.font = `${weight} ${fs}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, cssW / 2, padTop + asc * k);
  return { mask: c, cssH };
}

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type);
  if (!s) throw new Error("Could not create shader");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "Shader compile error");
  return s;
}

export interface ClothTextProps {
  text?: string;
  colors?: string[];
  hotColor?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  fold?: number;
  className?: string;
  style?: React.CSSProperties;
  mobileScale?: number;
  desktopScale?: number;
}

export default function ClothText({
  text = "affynelabs",
  colors = ["#071933", "#174B91", "#4A8BE2"], // shadow, mid, highlight
  hotColor = "#3B82F6",                       // colour the cloth turns near the cursor
  fontFamily = "'Google Sans Flex', 'Google Sans', 'Product Sans', sans-serif",
  fontWeight = 800,
  fold = 0.1,                                 // depth of the folds (0.05 – 0.2)
  className,
  style,
  mobileScale = 0.94,
  desktopScale = 0.92,
}: ClothTextProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);
  const label = text.toLowerCase();
  const colorKey = colors.join(",") + hotColor;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) { setFallback(true); return; }

    let prog: WebGLProgram;
    try {
      const p = gl.createProgram();
      if (!p) throw new Error("Could not create program");
      prog = p;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link failed");
    } catch (err) {
      console.error("ClothText shader error:", err);
      setFallback(true);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u = {
      mask: U("uMask"), time: U("uTime"), aspect: U("uAspect"), hover: U("uHover"),
      fold: U("uFold"), mouse: U("uMouse"), vel: U("uVel"),
      c0: U("uC0"), c1: U("uC1"), c2: U("uC2"), hot: U("uHot"),
    };
    gl.uniform3fv(u.c0, hexToRgb(colors[0]));
    gl.uniform3fv(u.c1, hexToRgb(colors[1] ?? colors[0]));
    gl.uniform3fv(u.c2, hexToRgb(colors[2] ?? colors[1] ?? colors[0]));
    gl.uniform3fv(u.hot, hexToRgb(hotColor));
    gl.uniform1f(u.fold, fold);
    gl.uniform1i(u.mask, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = {
      w: 0,
      h: 0,
      tx: 0.5,
      ty: 0.5,
      mx: 0.5,
      my: 0.5,
      vx: 0,
      vy: 0,
      hover: 0,
      target: 0,
      visible: true,
      lastInteraction: 0,
    };
    let raf = 0, alive = true;
    const t0 = performance.now();

    const draw = (now: number) => {
      gl.uniform1f(u.time, reduced ? 2.0 : (now - t0) / 1000);
      gl.uniform1f(u.hover, st.hover);
      gl.uniform2f(u.mouse, st.mx, st.my);
      gl.uniform2f(u.vel, st.vx, st.vy);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const loop = (now: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (!st.visible) return;

      const idleDuration = now - st.lastInteraction;
      // Ambient wave & idle shimmer sweep (especially prominent on mobile when untouched)
      if (st.target === 0 && idleDuration > 600) {
        const t = (now - t0) * 0.001;
        const ambX = 0.5 + 0.36 * Math.sin(t * 0.85);
        const ambY = 0.5 + 0.22 * Math.cos(t * 1.15);
        st.tx += (ambX - st.tx) * 0.06;
        st.ty += (ambY - st.ty) * 0.06;

        const ambHover = 0.45 + 0.25 * Math.sin(t * 1.3);
        st.hover += (ambHover - st.hover) * 0.05;
      } else {
        st.hover += (st.target - st.hover) * 0.08;
      }

      const px = st.mx, py = st.my;
      st.mx += (st.tx - st.mx) * 0.14;
      st.my += (st.ty - st.my) * 0.14;
      const aspect = st.w / (st.h || 1);
      st.vx += ((st.mx - px) * 30 * aspect - st.vx) * 0.2;
      st.vy += ((st.my - py) * 30 - st.vy) * 0.2;

      draw(now);
    };

    const resize = async () => {
      if (!wrap || !canvas) return;
      const cssW = Math.max(1, Math.floor(wrap.clientWidth));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      await loadGoogleSans();
      try { 
        if (typeof document !== 'undefined' && 'fonts' in document) {
          await (document as any).fonts.load(`${fontWeight} 100px ${fontFamily}`); 
        }
      } catch (_) {}
      if (!alive) return;
      const { mask, cssH } = buildMask(label, fontFamily, fontWeight, cssW, dpr, mobileScale, desktopScale);
      st.w = cssW; st.h = cssH;
      canvas.width = mask.width; canvas.height = mask.height;
      canvas.style.width = cssW + "px"; canvas.style.height = cssH + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
      gl.uniform1f(u.aspect, cssW / (cssH || 1));
      draw(performance.now());
    };

    const updatePointer = (clientX: number, clientY: number, isActive: boolean) => {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;
      const near = x > -0.15 && x < 1.15 && y > -0.6 && y < 1.6;
      if (isActive || near) {
        st.tx = Math.max(-0.1, Math.min(1.1, x));
        st.ty = Math.max(-0.2, Math.min(1.2, y));
        st.target = 1;
        st.lastInteraction = performance.now();
      } else {
        st.target = 0;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY, false);
    };

    const onPointerDown = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY, true);
    };

    const onPointerUp = () => {
      st.target = 0;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    };

    const onTouchEnd = () => {
      st.target = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([en]) => { st.visible = en.isIntersecting; });
    io.observe(wrap);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      (document as any).fonts.ready?.then(() => {
        if (alive) resize();
      });
    }

    resize();

    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      wrap.addEventListener("pointerdown", onPointerDown, { passive: true });
      wrap.addEventListener("pointerup", onPointerUp, { passive: true });
      wrap.addEventListener("pointercancel", onPointerUp, { passive: true });

      wrap.addEventListener("touchstart", onTouchStart, { passive: true });
      wrap.addEventListener("touchmove", onTouchMove, { passive: true });
      wrap.addEventListener("touchend", onTouchEnd, { passive: true });
      wrap.addEventListener("touchcancel", onTouchEnd, { passive: true });

      raf = requestAnimationFrame(loop);
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointercancel", onPointerUp);

      wrap.removeEventListener("touchstart", onTouchStart);
      wrap.removeEventListener("touchmove", onTouchMove);
      wrap.removeEventListener("touchend", onTouchEnd);
      wrap.removeEventListener("touchcancel", onTouchEnd);

      ro.disconnect();
      io.disconnect();
    };
  }, [label, colorKey, fontFamily, fontWeight, fold, mobileScale, desktopScale]);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      className={className}
      style={{
        width: "100%",
        lineHeight: 0,
        touchAction: "pan-y",
        ...style,
      }}
    >
      {fallback ? (
        <span
          style={{
            display: "block", textAlign: "center", fontFamily, fontWeight,
            fontSize: "clamp(3rem, 14vw, 14rem)", lineHeight: 1,
            background: `linear-gradient(120deg, ${colors.join(", ")})`,
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          }}
        >
          {label}
        </span>
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" style={{ display: "block", margin: "0 auto", verticalAlign: "bottom" }} />
      )}
    </div>
  );
}

