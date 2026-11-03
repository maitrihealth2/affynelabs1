"use client";
/**
 * PortfolioCat v2 — a procedurally modelled, rigged 3D cat that lives on your website.
 *
 * What changed in v2
 *  - SLIM, CAT-SHAPED BODY: the round "ball" torso is gone. The body is now one lofted mesh
 *    (deep chest → tucked waist → rounded haunches → neck), plus thigh and shoulder muscle.
 *  - REAL FUR: shell-fur rendering. Every furry part is drawn as a stack of offset shells with
 *    per-strand cut-outs, so you get a fuzzy silhouette, individual hairs, an undercoat that is
 *    darker than the tips, and the tabby stripes painted through all layers.
 *  - REAL WALKING: the hop-hop movement is replaced by an inverse-kinematics walk cycle.
 *    Two-bone legs (shoulder/hip → elbow/hock → paw), diagonal "lateral sequence" footfalls,
 *    planted paws that don't slide, body bob + sway, tail carried low, head held steady.
 *    It speeds up into a trot when chasing the cursor. It still LEAPS (with a crouch wind-up)
 *    when the target is on a different level, e.g. a heading higher up the page.
 *  - Sits upright like a real cat (front legs straight, haunches down, tail on the floor).
 *
 * Kept from v1
 *  - Tabby palette in the shader, whiskers, pink-lined ears, slit-pupil eyes that follow the cursor,
 *    blinking, toe beans + claws, skinned 8-bone tail, round glasses (click the cat),
 *    perching on headings, playing with cards/buttons/images, pouncing on the cursor,
 *    prefers-reduced-motion.
 *
 * Install: npm i three      Use: <PortfolioCat />  (once, anywhere)
 * Props:   furLayers (default 11) – lower it (6-8) for weaker GPUs, raise it (14-16) for denser fur.
 */
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";

/* ------------------------------------------------------------------ website palette */
const P = {
  fur: "#BBC3F4", // secondary accent
  stripe: "#5EA0ED", // primary accent
  light: "#F5F6FF", // alternate section background
  white: "#FFFFFF", // main background
  pink: "#F2D8EF", // gradient end
  lavender: "#D7C8F3", // gradient start
  ink: "#142746", // main typography
  steel: "#4A79A9", // secondary typography
  line: "#DCE3F5", // dividers
};

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// camera framing: feet sit FEET*size above the bottom of the canvas
const VIEW_W = 2.7;
const FEET = 0.04;

/* ------------------------------------------------------------------ skeleton dimensions */
const LA = 0.26; // upper leg (shoulder→elbow / hip→knee)
const LB = 0.27; // lower leg (elbow→paw / knee→hock)
const ANK = 0.1; // height of the ankle above the floor when the paw is flat
const HIP_Y = -0.2; // leg root, relative to the body pivot
const FRONT_Z = 0.3;
const REAR_Z = -0.38;
const REST_Y = 0.77; // body pivot height when standing

/* ------------------------------------------------------------------ fur shaders */
// tabby pattern painted in the fur shader (object-space, so it never slides or leaves gaps).
// `vObj` is the position in body space divided by uR, so the same stripes flow across body parts.
const FUR_GLSL = {
  plain: "",
  body: `
    vec3 fo = vObj;
    float bs = sin(fo.z*15.0 + sin(fo.y*5.0 + fo.x*3.0)*1.1);
    float bb = smoothstep(0.35, 0.72, bs);
    float bm = smoothstep(-0.2, 0.3, fo.y) * (1.0 - smoothstep(0.95, 1.1, fo.z));
    float sp = (1.0 - smoothstep(0.0, 0.13, abs(fo.x))) * smoothstep(0.35, 0.5, fo.y);
    diffuseColor.rgb = mix(diffuseColor.rgb, uStripe, max(bb*bm, sp)*0.9);
    float bl = max(1.0 - smoothstep(-0.5, -0.2, fo.y),
                   smoothstep(0.7, 0.95, fo.z) * (1.0 - smoothstep(-0.1, 0.5, fo.y)));
    diffuseColor.rgb = mix(diffuseColor.rgb, uLight, bl);
  `,
  head: `
    vec3 fo = vObj;
    float hs = smoothstep(0.86, 0.97, cos(fo.x*11.0));
    float hm = smoothstep(0.2, 0.6, fo.y) * smoothstep(0.0, 0.4, fo.z) * (1.0 - smoothstep(0.78, 0.97, fo.y));
    float cs = smoothstep(0.84, 0.96, sin(fo.y*15.0 + 1.0));
    float cm = smoothstep(0.5, 0.8, abs(fo.x)) * smoothstep(-0.55, -0.3, fo.y)
             * (1.0 - smoothstep(0.05, 0.3, fo.y)) * smoothstep(-0.2, 0.15, fo.z);
    diffuseColor.rgb = mix(diffuseColor.rgb, uStripe, max(hs*hm, cs*cm)*0.9);
    float hl = smoothstep(0.62, 0.88, fo.z) * (1.0 - smoothstep(-0.3, 0.0, fo.y));
    hl = max(hl, 1.0 - smoothstep(-0.8, -0.55, fo.y));
    diffuseColor.rgb = mix(diffuseColor.rgb, uLight, hl);
  `,
  legU: `
    vec3 fo = vObj;
    float lr = smoothstep(0.8, 0.95, sin(fo.y*16.0 + fo.x*6.0));
    diffuseColor.rgb = mix(diffuseColor.rgb, uStripe, lr*0.8);
  `,
  legL: `
    vec3 fo = vObj;
    float lr = smoothstep(0.8, 0.95, sin(fo.y*16.0)) * smoothstep(-0.1, 0.5, fo.y);
    diffuseColor.rgb = mix(diffuseColor.rgb, uStripe, lr*0.8);
    diffuseColor.rgb = mix(diffuseColor.rgb, uLight, 1.0 - smoothstep(-0.8, -0.35, fo.y));
  `,
  tail: `
    vec3 fo = vObj;
    float tr = smoothstep(0.15, 0.55, sin(fo.y*26.0)) * (1.0 - smoothstep(0.8, 0.86, fo.y));
    diffuseColor.rgb = mix(diffuseColor.rgb, uStripe, tr*0.85);
    diffuseColor.rgb = mix(diffuseColor.rgb, uLight, smoothstep(0.84, 0.9, fo.y));
  `,
};

// per-part fur length masks (vertex shader): short fur around the eyes and nose
const FUR_LEN = {
  head: "lenK = 1.0 - 0.8 * smoothstep(0.66, 0.84, vObj.z);",
};

/* ------------------------------------------------------------------ lofted body */
// smooth scalar interpolation through evenly spaced keys (uniform Catmull-Rom)
const crSpline = (arr, s) => {
  const n = arr.length - 1;
  const f = clamp(s, 0, 1) * n;
  const i = Math.min(Math.floor(f), n - 1);
  const t = f - i;
  const p0 = arr[Math.max(i - 1, 0)];
  const p1 = arr[i];
  const p2 = arr[i + 1];
  const p3 = arr[Math.min(i + 2, n)];
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)
  );
};

// One mesh for rump → haunches → tucked waist → deep chest → neck.
// Cross-sections are ellipses along z; both ends are closed with rounded caps.
function makeTorsoGeo() {
  const NR = 56; // rings along the body
  const NA = 36; // vertices around each ring
  const Z0 = -0.6;
  const Z1 = 0.56;
  //            rump  haunch  hips   loin   waist  ribs   chest  shoulder neck
  const HW = [0.1, 0.25, 0.255, 0.235, 0.22, 0.235, 0.245, 0.2, 0.15]; // half width
  const HH = [0.14, 0.27, 0.28, 0.26, 0.235, 0.26, 0.285, 0.25, 0.2]; // half height
  const CY = [0.02, 0.02, 0.02, 0.035, 0.045, 0.03, 0.0, 0.06, 0.2]; // centre height
  const cap = (s) => {
    const a = clamp(s / 0.15, 0, 1);
    const b = clamp((1 - s) / 0.15, 0, 1);
    return Math.sqrt(1 - (1 - a) * (1 - a)) * Math.sqrt(1 - (1 - b) * (1 - b));
  };
  const pos = new Float32Array((NR + 1) * NA * 3);
  for (let i = 0; i <= NR; i++) {
    const s = i / NR;
    const z = lerp(Z0, Z1, s);
    const e = cap(s);
    const hw = crSpline(HW, s) * e;
    const hh = crSpline(HH, s) * e;
    const cy = crSpline(CY, s);
    for (let j = 0; j < NA; j++) {
      const a = (j / NA) * Math.PI * 2;
      const k = (i * NA + j) * 3;
      pos[k] = Math.cos(a) * hw;
      pos[k + 1] = cy + Math.sin(a) * hh;
      pos[k + 2] = z;
    }
  }
  const idx = [];
  for (let i = 0; i < NR; i++) {
    for (let j = 0; j < NA; j++) {
      const a = i * NA + j;
      const b = (i + 1) * NA + j;
      const c = (i + 1) * NA + ((j + 1) % NA);
      const d = i * NA + ((j + 1) % NA);
      idx.push(a, d, c, a, c, b);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export default function PortfolioCat({
  size = 210,
  perchSelector = "h1, h2, h3, [data-pet-perch]",
  toySelector = "[data-pet-toy], img, button, .card",
  enableToys = true,
  startGlasses = false,
  zIndex = 9999,
  furLayers = 11,
}) {
  const hostRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const host = hostRef.current;
    if (!host) return;

    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SHELLS = clamp(Math.round(furLayers), 4, 20);
    const LEGN = Math.max(4, Math.round(SHELLS * 0.65));
    const SMALLN = Math.max(3, Math.round(SHELLS * 0.45));
    const UNIT = VIEW_W / size; // world units per CSS pixel

    /* ------------------------------------------------------------------ renderer */
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch (e) {
      return; // no WebGL → silently skip the cat
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const half = VIEW_W / 2;
    const cam = new THREE.OrthographicCamera(-half, half, 1.65, -1.05, 0.1, 50);
    cam.position.set(0, 2.34, 7.88);
    cam.lookAt(0, 0.95, 0);

    // soft studio lighting: sky/ground bounce, key (casts self-shadows), cool fill, pink rim
    scene.add(new THREE.HemisphereLight(0xffffff, new THREE.Color(P.lavender), 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(-2.5, 4.5, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -1.9;
    key.shadow.camera.right = 1.9;
    key.shadow.camera.top = 2.6;
    key.shadow.camera.bottom = -1;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 3;
    scene.add(key);
    const fill = new THREE.DirectionalLight(new THREE.Color(P.fur), 0.7);
    fill.position.set(4, 1.5, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(new THREE.Color(P.pink), 1.0);
    rim.position.set(0, 3, -5);
    scene.add(rim);

    /* ------------------------------------------------------------------ materials */
    const geos = [];
    const mats = [];
    const texs = [];
    const G = (g) => (geos.push(g), g);
    const Mt = (m) => (mats.push(m), m);

    const colStripe = new THREE.Color(P.stripe);
    const colLight = new THREE.Color(P.light);

    /**
     * Shell fur. Draws `geo` n times: shell 0 is the skin/undercoat, shells 1..n-1 are pushed out
     * along the normals and keep only the pixels that belong to a "hair" (a 3-D hashed lattice
     * sampled at the un-displaced surface position, so every hair lines up from root to tip).
     * Hairs get thinner and sparser towards the tip. Returns a Group (so it can be moved/scaled).
     */
    const furMesh = (geo, mode, o = {}) => {
      const {
        R = 1,
        base = P.fur,
        len = 0.04,
        dens = 55,
        n = SHELLS,
        skinned = false,
        pos,
        scl,
      } = o;
      G(geo);
      const grp = new THREE.Group();
      const meshes = [];
      for (let i = 0; i < n; i++) {
        const shell = i === 0 ? 0 : i / n;
        const m =
          i === 0
            ? new THREE.MeshPhysicalMaterial({
                color: base,
                roughness: 0.9,
                metalness: 0,
                sheen: 1,
                sheenColor: new THREE.Color(P.light),
                sheenRoughness: 0.55,
              })
            : new THREE.MeshStandardMaterial({ color: base, roughness: 1, metalness: 0 });
        m.onBeforeCompile = (sh) => {
          sh.uniforms.uStripe = { value: colStripe };
          sh.uniforms.uLight = { value: colLight };
          sh.uniforms.uR = { value: R };
          sh.uniforms.uScl = { value: scl ? scl.clone() : new THREE.Vector3(1, 1, 1) };
          sh.uniforms.uOff = { value: pos ? pos.clone() : new THREE.Vector3(0, 0, 0) };
          sh.uniforms.uShell = { value: shell };
          sh.uniforms.uLen = { value: len };
          sh.uniforms.uDens = { value: dens };
          sh.vertexShader = sh.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vObj;
varying vec3 vBase;
varying float vShell;
uniform float uR;
uniform vec3 uScl;
uniform vec3 uOff;
uniform float uShell;
uniform float uLen;`
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
vObj = (position * uScl + uOff) / uR;
vBase = position;
vShell = uShell;
float lenK = 1.0;
${FUR_LEN[mode] || ""}
transformed += normal * (uShell * uLen * lenK);`
            );
          sh.fragmentShader = sh.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vObj;
varying vec3 vBase;
varying float vShell;
uniform vec3 uStripe;
uniform vec3 uLight;
uniform float uDens;
float h13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}`
            )
            .replace(
              "#include <color_fragment>",
              `#include <color_fragment>
float sr = 0.5;
if (vShell > 0.001) {
  vec3 q = vBase * uDens;
  sr = h13(floor(q));
  float hgt = 0.4 + 0.6 * sr;
  float k = vShell / hgt;
  float dd = length(fract(q) - 0.5);
  if (k > 1.0 || dd > 0.5 * (1.0 - 0.75 * k)) discard;
}
${FUR_GLSL[mode]}
diffuseColor.rgb *= mix(0.55, 1.0, vShell) * (0.9 + 0.2 * sr);
diffuseColor.rgb += uLight * 0.1 * vShell;`
            );
        };
        m.customProgramCacheKey = () => "cat-fur2-" + mode + (i === 0 ? "-base" : "-shell");
        Mt(m);
        const mesh = skinned ? new THREE.SkinnedMesh(geo, m) : new THREE.Mesh(geo, m);
        mesh.frustumCulled = false;
        mesh.castShadow = i === 0;
        mesh.receiveShadow = true;
        mesh.userData.fur = true;
        grp.add(mesh);
        meshes.push(mesh);
      }
      grp.userData.meshes = meshes;
      return grp;
    };

    const std = (c, rough = 0.6, metal = 0) =>
      Mt(new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: metal }));
    const softFur = (c) =>
      Mt(
        new THREE.MeshPhysicalMaterial({
          color: c,
          roughness: 0.9,
          metalness: 0,
          sheen: 1,
          sheenColor: new THREE.Color(P.light),
          sheenRoughness: 0.55,
        })
      );

    const pinkDeep = new THREE.Color(P.lavender).lerp(new THREE.Color(P.pink), 0.5).multiplyScalar(0.88);
    const M = {
      plain: softFur(P.fur), // eyelids, ear backs, cheek tufts
      light: softFur(P.light),
      earIn: std(P.pink, 0.7),
      pad: std(pinkDeep, 0.5),
      nose: std(pinkDeep, 0.3),
      dark: std(P.ink, 0.35),
      eyeball: std(P.light, 0.25),
      claw: std(P.line, 0.3),
      frame: std(P.ink, 0.3, 0.25),
      whisker: Mt(new THREE.MeshBasicMaterial({ color: P.steel })),
      glint: Mt(new THREE.MeshBasicMaterial({ color: 0xffffff })),
      lens: Mt(
        new THREE.MeshPhysicalMaterial({
          color: P.fur,
          roughness: 0.05,
          transparent: true,
          opacity: 0.16,
          depthWrite: false,
          clearcoat: 1,
        })
      ),
      lensShine: Mt(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false })),
      shadow: Mt(new THREE.MeshBasicMaterial({ color: P.ink, transparent: true, opacity: 0.16, depthWrite: false })),
    };

    // iris texture: painted once. top of the canvas = centre of the iris, bottom = outer ring
    const irisTex = (() => {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const x = c.getContext("2d");
      const g = x.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, P.fur);
      g.addColorStop(0.3, P.stripe);
      g.addColorStop(0.78, P.steel);
      g.addColorStop(0.93, P.ink);
      g.addColorStop(1, P.ink);
      x.fillStyle = g;
      x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 140; i++) {
        x.strokeStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.18)" : "rgba(20,39,70,0.22)";
        x.lineWidth = rand(1, 2.5);
        const px = rand(0, 256);
        x.beginPath();
        x.moveTo(px, rand(10, 60));
        x.lineTo(px + rand(-3, 3), rand(150, 215));
        x.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      texs.push(t);
      return t;
    })();
    const irisMat = Mt(new THREE.MeshBasicMaterial({ map: irisTex }));

    const mesh = (geo, mat) => new THREE.Mesh(G(geo), mat);
    // cylinder between two points (used for glasses arms, whisker roots…)
    const between = (a, b, r, mat) => {
      const va = new THREE.Vector3(...a);
      const vb = new THREE.Vector3(...b);
      const len = va.distanceTo(vb);
      const m = mesh(new THREE.CylinderGeometry(r, r, len, 10), mat);
      m.position.copy(va).add(vb).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
      return m;
    };

    /* ------------------------------------------------------------------ the rig */
    const root = new THREE.Group(); // facing (yaw)
    root.name = "root";
    scene.add(root);

    const shadow = mesh(new THREE.CircleGeometry(0.55, 32), M.shadow);
    shadow.position.set(0, 0.04, -0.3);
    shadow.renderOrder = -1;
    scene.add(shadow);

    const rig = new THREE.Group(); // body pivot: tilt, jump, sit
    rig.name = "spine";
    rig.position.set(0, REST_Y, 0.22); // z offset keeps head + tail centred in the canvas when side-on
    root.add(rig);

    // torso: lofted body + thigh and shoulder muscle (all share the same stripe field)
    const torso = new THREE.Group();
    rig.add(torso);
    torso.add(furMesh(makeTorsoGeo(), "body", { R: 0.5, len: 0.05, dens: 50 }));
    [-1, 1].forEach((s) => {
      const thighPos = new THREE.Vector3(s * 0.2, -0.04, -0.37);
      const thighScl = new THREE.Vector3(0.85, 1.2, 1.2);
      const thigh = furMesh(new THREE.SphereGeometry(0.16, 28, 20), "body", {
        R: 0.5,
        len: 0.045,
        dens: 50,
        n: Math.max(4, SHELLS - 3),
        pos: thighPos,
        scl: thighScl,
      });
      thigh.position.copy(thighPos);
      thigh.scale.copy(thighScl);
      torso.add(thigh);

      const shPos = new THREE.Vector3(s * 0.2, -0.06, 0.3);
      const shScl = new THREE.Vector3(0.78, 1.25, 1.1);
      const shoulder = furMesh(new THREE.SphereGeometry(0.125, 24, 18), "body", {
        R: 0.5,
        len: 0.04,
        dens: 50,
        n: Math.max(4, SHELLS - 4),
        pos: shPos,
        scl: shScl,
      });
      shoulder.position.copy(shPos);
      shoulder.scale.copy(shScl);
      torso.add(shoulder);
    });

    // head
    const head = new THREE.Group();
    head.name = "head";
    head.position.set(0, 0.32, 0.66);
    head.scale.setScalar(0.82);
    rig.add(head);
    const skull = furMesh(new THREE.SphereGeometry(0.46, 48, 32), "head", { R: 0.46, len: 0.034, dens: 52 });
    skull.scale.set(1.12, 0.95, 1);
    head.add(skull);

    // cheek ruff (fur tufts that fan out from the cheeks)
    [-1, 1].forEach((s) => {
      [
        [-0.1, 0.1],
        [-0.16, -0.12],
        [-0.22, -0.34],
      ].forEach(([y, rz], i) => {
        const tuft = mesh(new THREE.ConeGeometry(0.07 - i * 0.008, 0.2 - i * 0.015, 14), M.plain);
        tuft.position.set(s * 0.45, y - 0.02, 0.12 - i * 0.03);
        tuft.rotation.z = s * (-1.55 - i * 0.28 + rz * 0.3);
        tuft.rotation.y = s * -0.25;
        head.add(tuft);
      });
    });

    // ears: rounded extruded triangles with pink inside and tiny fur tufts
    const earShape = (w, h) => {
      const sh = new THREE.Shape();
      sh.moveTo(-w, 0);
      sh.quadraticCurveTo(-w * 0.9, h * 0.55, -w * 0.1, h);
      sh.quadraticCurveTo(0, h * 1.03, w * 0.1, h);
      sh.quadraticCurveTo(w * 0.9, h * 0.55, w, 0);
      sh.quadraticCurveTo(0, -h * 0.12, -w, 0);
      return sh;
    };
    const makeEar = (side) => {
      const g = new THREE.Group();
      g.position.set(side * 0.3, 0.3, 0.02);
      const og = new THREE.ExtrudeGeometry(earShape(0.17, 0.36), {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 4,
        curveSegments: 16,
      });
      og.translate(0, 0, -0.025);
      const outer = mesh(og, M.plain);
      const ig = new THREE.ExtrudeGeometry(earShape(0.105, 0.245), {
        depth: 0.012,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 3,
        curveSegments: 12,
      });
      const inner = mesh(ig, M.earIn);
      inner.position.set(0, 0.035, 0.05);
      g.add(outer, inner);
      for (let i = -1; i <= 1; i++) {
        const t = mesh(new THREE.ConeGeometry(0.012, 0.09, 6), M.light);
        t.position.set(i * 0.04, 0.085, 0.075);
        t.rotation.z = -i * 0.35;
        g.add(t);
      }
      head.add(g);
      return g;
    };
    const earL = makeEar(-1);
    const earR = makeEar(1);

    // eyes
    const lids = [];
    const looks = [];
    const pupils = [];
    [-1, 1].forEach((side) => {
      const eye = new THREE.Group();
      eye.position.set(side * 0.2, 0.05, 0.385);
      eye.rotation.z = side * 0.14; // outer corners a little higher → almond cat eyes
      const ball = mesh(new THREE.SphereGeometry(0.105, 32, 24), M.eyeball);
      ball.scale.set(1, 1.05, 0.75);
      const look = new THREE.Group(); // eyeball rotation (gaze)
      const iris = mesh(new THREE.SphereGeometry(0.1065, 32, 16, 0, Math.PI * 2, 0, 0.9), irisMat);
      iris.rotation.x = Math.PI / 2;
      const pupil = mesh(new THREE.SphereGeometry(0.1075, 24, 12, 0, Math.PI * 2, 0, 0.68), M.dark);
      pupil.rotation.x = Math.PI / 2;
      pupil.scale.set(0.32, 1, 1.12);
      look.add(iris, pupil);
      ball.add(look);
      // glints stay fixed, like real reflections
      const g1 = mesh(new THREE.SphereGeometry(0.02, 12, 10), M.glint);
      g1.position.set(-0.028, 0.042, 0.452);
      g1.scale.z = 0.4;
      const g2 = mesh(new THREE.SphereGeometry(0.01, 10, 8), M.glint);
      g2.position.set(0.03, -0.03, 0.452);
      g2.scale.z = 0.4;
      // eyelid: top dome that sweeps over the eye (θ -1.45 = hidden, +1.45 = shut)
      const lidPivot = new THREE.Group();
      const lid = mesh(new THREE.SphereGeometry(0.113, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), M.plain);
      lid.scale.set(1, 1.05, 0.75);
      lidPivot.add(lid);
      lidPivot.rotation.x = -1.1;
      eye.add(ball, g1, g2, lidPivot);
      head.add(eye);
      lids.push(lidPivot);
      looks.push(look);
      pupils.push(pupil);
    });

    // muzzle: whisker pads, chin, nose, mouth
    [-1, 1].forEach((s) => {
      const pad = furMesh(new THREE.SphereGeometry(0.085, 24, 18), "plain", {
        base: P.light,
        len: 0.012,
        dens: 90,
        n: SMALLN,
      });
      pad.position.set(s * 0.09, -0.115, 0.4);
      pad.scale.set(1.1, 0.8, 0.9);
      head.add(pad);
    });
    const chin = furMesh(new THREE.SphereGeometry(0.06, 20, 14), "plain", {
      base: P.light,
      len: 0.012,
      dens: 90,
      n: SMALLN,
    });
    chin.position.set(0, -0.2, 0.34);
    chin.scale.set(1.1, 0.8, 1);
    head.add(chin);
    const nose = mesh(new THREE.SphereGeometry(0.038, 20, 14), M.nose);
    nose.position.set(0, -0.065, 0.462);
    nose.scale.set(1.25, 0.8, 0.75);
    head.add(nose);
    const philtrum = between([0, -0.085, 0.462], [0, -0.12, 0.466], 0.005, M.dark);
    head.add(philtrum);
    const mouthParts = [];
    [-1, 1].forEach((s) => {
      const arc = mesh(new THREE.TorusGeometry(0.032, 0.006, 8, 20, Math.PI), M.dark);
      arc.rotation.z = Math.PI;
      arc.position.set(s * 0.032, -0.118, 0.466);
      head.add(arc);
      mouthParts.push(arc);
    });

    // whiskers (6 on the muzzle, 2 above each eye)
    const whiskers = [];
    const whisk = (px, py, pz, side, rz, ry, len) => {
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(side * len * 0.5, 0.012, 0.012),
        new THREE.Vector3(side * len, -0.012, -0.002),
      ]);
      g.add(mesh(new THREE.TubeGeometry(curve, 14, 0.0032, 5, false), M.whisker));
      g.rotation.z = rz;
      g.rotation.y = ry;
      head.add(g);
      whiskers.push({ g, rz, ry, side });
    };
    [-1, 1].forEach((s) => {
      whisk(s * 0.12, -0.09, 0.41, s, s * 0.22, s * -0.12, 0.3);
      whisk(s * 0.13, -0.115, 0.41, s, s * 0.0, s * -0.12, 0.32);
      whisk(s * 0.12, -0.14, 0.4, s, s * -0.22, s * -0.12, 0.28);
      whisk(s * 0.2, 0.18, 0.4, s, s * 0.45, s * -0.1, 0.16);
      whisk(s * 0.17, 0.17, 0.4, s, s * 0.8, s * -0.1, 0.14);
    });

    // glasses (child of the head so they follow every head movement)
    const glasses = new THREE.Group();
    glasses.name = "glasses";
    glasses.visible = false;
    head.add(glasses);
    const GZ = 0.545;
    [-1, 1].forEach((s) => {
      const ring = mesh(new THREE.TorusGeometry(0.135, 0.018, 16, 56), M.frame);
      ring.position.set(s * 0.2, 0.06, GZ);
      const lens = mesh(new THREE.CircleGeometry(0.135, 40), M.lens);
      lens.position.set(s * 0.2, 0.06, GZ);
      const shine1 = mesh(new THREE.PlaneGeometry(0.018, 0.1), M.lensShine);
      shine1.position.set(s * 0.2 - 0.04, 0.075, GZ + 0.001);
      shine1.rotation.z = 0.5;
      const shine2 = mesh(new THREE.PlaneGeometry(0.01, 0.045), M.lensShine);
      shine2.position.set(s * 0.2 - 0.075, 0.035, GZ + 0.001);
      shine2.rotation.z = 0.5;
      const hinge = mesh(new THREE.SphereGeometry(0.022, 12, 10), M.frame);
      hinge.position.set(s * 0.335, 0.075, GZ - 0.005);
      const temple = between([s * 0.34, 0.075, GZ - 0.01], [s * 0.41, 0.065, 0.24], 0.011, M.frame);
      glasses.add(ring, lens, shine1, shine2, hinge, temple);
    });
    const bridge = between([-0.078, 0.095, GZ], [0.078, 0.095, GZ], 0.012, M.frame);
    glasses.add(bridge);

    // legs: two-bone chains (hip → knee → ankle), posed every frame by inverse kinematics.
    // rotation.x swings a bone in the cat's side plane (negative = forward).
    const legs = [];
    const clawSets = [];
    const makeLeg = (side, front, offW, offT) => {
      const hip = new THREE.Group();
      const rU = front ? 0.065 : 0.088;
      const rL = front ? 0.046 : 0.044;
      const upper = furMesh(new THREE.CapsuleGeometry(rU, LA - 2 * rU, 8, 16), "legU", {
        R: 0.13,
        len: 0.026,
        dens: 75,
        n: LEGN,
      });
      upper.position.y = -LA / 2;
      if (!front) upper.scale.set(1, 1, 1.22);
      hip.add(upper);

      const knee = new THREE.Group();
      knee.position.y = -LA;
      const kball = furMesh(new THREE.SphereGeometry(rU * 0.92, 16, 12), "plain", {
        base: P.fur,
        len: 0.02,
        dens: 75,
        n: SMALLN,
      });
      const lower = furMesh(new THREE.CapsuleGeometry(rL, LB - 2 * rL, 8, 16), "legL", {
        R: 0.135,
        len: 0.022,
        dens: 80,
        n: LEGN,
      });
      lower.position.y = -LB / 2;
      knee.add(kball, lower);
      hip.add(knee);

      const ankle = new THREE.Group();
      ankle.position.y = -LB;
      knee.add(ankle);
      const pawScale = front ? 1 : 1.08;
      const paw = furMesh(new THREE.SphereGeometry(0.078 * pawScale, 20, 14), "plain", {
        base: P.light,
        len: 0.014,
        dens: 90,
        n: SMALLN,
      });
      paw.position.set(0, -0.05, 0.05);
      paw.scale.set(1, 0.6, 1.4);
      ankle.add(paw);
      // toe beans on the sole
      const mainPad = mesh(new THREE.SphereGeometry(0.045, 16, 12), M.pad);
      mainPad.position.set(0, -0.089, 0.03);
      mainPad.scale.set(1.2, 0.5, 1.0);
      ankle.add(mainPad);
      [
        [-0.062, 0.062],
        [-0.022, 0.092],
        [0.022, 0.092],
        [0.062, 0.062],
      ].forEach(([tx, tz]) => {
        const toe = mesh(new THREE.SphereGeometry(0.019, 12, 10), M.pad);
        toe.position.set(tx * pawScale * 0.9, -0.084, 0.05 + tz * pawScale);
        toe.scale.set(1, 0.6, 1.1);
        ankle.add(toe);
      });
      // retractable claws
      const claws = new THREE.Group();
      claws.position.set(0, -0.07, 0.145 * pawScale);
      for (let i = -1; i <= 1; i++) {
        const c = mesh(new THREE.ConeGeometry(0.011, 0.07, 8), M.claw);
        c.position.set(i * 0.035, 0, 0);
        c.rotation.x = 1.35;
        claws.add(c);
      }
      claws.scale.setScalar(0.001);
      ankle.add(claws);
      clawSets.push(claws);

      const L = {
        hip,
        knee,
        ankle,
        front,
        side,
        x: side * (front ? 0.19 : 0.2),
        z: front ? FRONT_Z : REAR_Z,
        z0: front ? 0.02 : 0.0, // where the paw rests relative to the hip
        bend: front ? 1 : -1, // front: elbow points back · rear: knee points forward
        offW, // footfall phase, walk (lateral sequence)
        offT, // footfall phase, trot (diagonal pairs)
      };
      hip.position.set(L.x, HIP_Y, L.z);
      rig.add(hip);
      legs.push(L);
      return L;
    };
    // order matters (claw sets 0/1 are the front paws): FL, FR, RL, RR
    makeLeg(-1, true, 0.75, 1.0);
    makeLeg(1, true, 0.25, 0.5);
    makeLeg(-1, false, 0.5, 0.5);
    makeLeg(1, false, 0.0, 0.0);

    // tail: ONE skinned mesh (drawn as fur shells) on an 8-bone chain → smooth bending, no gaps
    const TL = 0.95;
    const TB = 8;
    const TS = TL / (TB - 1);
    const tailBase = new THREE.Group();
    tailBase.name = "tailBase";
    tailBase.position.set(0, 0.02, -0.55);
    tailBase.rotation.x = -1.0;
    rig.add(tailBase);
    const tg = new THREE.CylinderGeometry(0.05, 0.085, TL, 18, 32, true);
    tg.translate(0, TL / 2, 0);
    {
      const pos = tg.attributes.position;
      const nor = tg.attributes.normal;
      const si = [];
      const sw = [];
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        const y = pos.getY(i);
        let z = pos.getZ(i);
        const t = y / TL;
        let ny = 0.12;
        if (t > 0.9) {
          const k = (t - 0.9) / 0.1;
          const s = Math.sqrt(Math.max(0, 1 - k * k));
          x *= s;
          z *= s;
          ny = k * 0.9;
        }
        pos.setXYZ(i, x, y, z);
        v.set(x, 0, z);
        const rl = v.length() || 1;
        v.set(x / rl, ny, z / rl).normalize();
        nor.setXYZ(i, v.x, v.y, v.z);
        const f = y / TS;
        const i0 = Math.min(Math.floor(f), TB - 2);
        const w = clamp(f - i0, 0, 1);
        si.push(i0, i0 + 1, 0, 0);
        sw.push(1 - w, w, 0, 0);
      }
      tg.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(si, 4));
      tg.setAttribute("skinWeight", new THREE.Float32BufferAttribute(sw, 4));
    }
    const tailBones = [];
    for (let i = 0; i < TB; i++) {
      const b = new THREE.Bone();
      b.position.y = i === 0 ? 0 : TS;
      if (i > 0) tailBones[i - 1].add(b);
      tailBones.push(b);
    }
    const tailFur = furMesh(tg, "tail", { R: 1, len: 0.045, dens: 52, skinned: true });
    const tailShells = tailFur.userData.meshes;
    tailShells[0].add(tailBones[0]);
    tailBase.add(tailFur);

    // shadows on everything solid (fur shells only receive – the skin layer casts for them)
    scene.traverse((o) => {
      if (
        o.isMesh &&
        !o.userData.fur &&
        o !== shadow &&
        ![M.whisker, M.lens, M.lensShine, M.glint, irisMat].includes(o.material)
      ) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    // bind the skeleton once the whole hierarchy has its world matrices
    scene.updateMatrixWorld(true);
    const tailSkeleton = new THREE.Skeleton(tailBones);
    tailShells.forEach((m) => m.bind(tailSkeleton));

    /* ------------------------------------------------------------------ state */
    const range = document.createRange();
    const mouse = { x: 0, y: 0, t: -99, inside: false };
    let time = 0;

    const S = {
      x: window.scrollX + window.innerWidth * 0.85,
      y: window.scrollY + window.innerHeight - 30,
      state: "sit", // sit | move | act
      act: null,
      actT: 0,
      timer: reduce ? 0.1 : 0.8,
      goal: null,
      attach: null,
      hop: null,
      pause: 0,
      jump: 0,
      land: 0,
      sit: 0,
      yawT: 0,
      lx: 0,
      ly: 0,
      glassesOn: startGlasses,
      gT: startGlasses ? 1 : 0,
      pawL: 0,
      pawR: 0,
      pawLT: 0,
      pawRT: 0,
      swat: 0,
      claw: 0,
      happy: 0,
      pup: 0.32,
      blinkT: 2,
      blink: 1,
      earTw: 0,
      earT: 4,
      chaseCd: 5,
      chaseT: 0,
      pending: null,
      dressDone: false,
      wiggles: 0,
      lastPerch: null,
      // locomotion
      spd: 0, // eased walking speed (px/s)
      vNow: 0, // speed actually travelled this frame (px/s)
      gait: 0, // 0 = standing, 1 = fully walking
      trot: 0, // 0 = walk, 1 = trot
      phase: 0, // gait cycle 0..1, advances with distance travelled
      winding: false, // crouching before a leap
      windup: 0,
      crouch: 0,
    };

    /* ------------------------------------------------------------------ page helpers */
    const visibleEls = (selector) => {
      let list = [];
      try {
        list = Array.from(document.querySelectorAll(selector));
      } catch (e) {
        return [];
      }
      return list.filter((el) => {
        if (host.contains(el)) return false;
        if (el.closest("[data-pet-ignore]")) return false;
        const r = el.getBoundingClientRect();
        return r.width > 24 && r.height > 12 && r.top >= 130 && r.top <= window.innerHeight - 30;
      });
    };

    // where (in document coordinates) the cat should stand for a goal tied to an element
    const resolve = (g) => {
      const r = g.el.getBoundingClientRect();
      let left = r.left;
      let right = r.right;
      let top = r.top;
      if (g.kind === "perch") {
        try {
          range.selectNodeContents(g.el);
          const tr = range.getBoundingClientRect();
          if (tr.width > 0) {
            left = Math.max(left, tr.left);
            right = Math.min(right, tr.right);
            top = tr.top + tr.height * 0.18;
          }
        } catch (e) {}
      }
      const fx = clamp(g.fx, 0.12, 0.88);
      return {
        x: clamp(left + (right - left) * fx, 40, window.innerWidth - 40) + window.scrollX,
        y: top + window.scrollY + 2,
      };
    };

    const wiggle = (el) => {
      if (reduce || el.__petBusy || !el.animate) return;
      el.__petBusy = true;
      try {
        const a = el.animate(
          [
            { transform: "translateY(0) rotate(0deg)" },
            { transform: "translateY(-10px) rotate(-3deg)", offset: 0.25 },
            { transform: "translateY(0) rotate(3deg)", offset: 0.5 },
            { transform: "translateY(-4px) rotate(-2deg)", offset: 0.75 },
            { transform: "translateY(0) rotate(0deg)" },
          ],
          { duration: 750, easing: "ease-out", composite: "add" }
        );
        a.onfinish = a.oncancel = () => {
          el.__petBusy = false;
        };
      } catch (e) {
        el.__petBusy = false;
      }
    };

    /* ------------------------------------------------------------------ decisions */
    const goPerch = () => {
      const list = visibleEls(perchSelector).filter((el) => el !== S.lastPerch);
      const all = list.length ? list : visibleEls(perchSelector);
      if (!all.length) return goWander();
      const el = all[Math.floor(Math.random() * all.length)];
      S.lastPerch = el;
      S.goal = { kind: "perch", el, fx: rand(0.12, 0.88) };
      S.attach = null;
      S.state = "move";
    };
    const goToy = () => {
      const list = visibleEls(toySelector);
      if (!list.length) return goPerch();
      S.goal = { kind: "toy", el: list[Math.floor(Math.random() * list.length)], fx: rand(0.2, 0.8) };
      S.attach = null;
      S.state = "move";
    };
    // a stroll along the page: mostly sideways, so it is a proper walk rather than a leap
    const goWander = () => {
      const sxp = window.scrollX;
      const W = window.innerWidth;
      const dirn = Math.random() < 0.5 ? -1 : 1;
      let x = S.x + dirn * rand(160, 460);
      if (x < sxp + 80 || x > sxp + W - 80) x = S.x - dirn * rand(160, 460);
      x = clamp(x, sxp + 80, sxp + Math.max(120, W - 80));
      const y = clamp(
        S.y + rand(-50, 50),
        window.scrollY + 170,
        window.scrollY + Math.max(200, window.innerHeight - 40)
      );
      S.goal = { kind: "wander", x, y };
      S.attach = null;
      S.state = "move";
    };
    const startAct = (name) => {
      S.state = "act";
      S.act = name;
      S.actT = 0;
      S.dressDone = false;
      S.wiggles = 0;
    };
    const sitDown = (t) => {
      S.state = "sit";
      S.act = null;
      S.timer = t;
      S.pawLT = 0;
      S.pawRT = 0;
    };
    const decide = () => {
      if (reduce) return (S.timer = 9999);
      const r = Math.random();
      if (r < 0.34) return goPerch();
      if (r < 0.54 && enableToys && visibleEls(toySelector).length) return goToy();
      if (r < 0.74) return startAct("dress");
      if (r < 0.9) return goWander();
      S.timer = rand(2, 4);
    };

    /* ------------------------------------------------------------------ locomotion */
    // leaps (between levels, pouncing): a parabola with a crouch before and a squash after
    const advanceHop = (dt) => {
      const h = S.hop;
      h.t += dt / h.dur;
      const u = Math.min(h.t, 1);
      S.x = h.fx + (h.tx - h.fx) * u;
      S.y = h.fy + (h.ty - h.fy) * u;
      S.jump = 4 * h.h * u * (1 - u);
      if (h.t >= 1) {
        S.hop = null;
        S.jump = 0;
        S.land = 1;
        S.pause = 0.05 + Math.random() * 0.1;
        return true;
      }
      return false;
    };

    // returns true when the cat has arrived
    const moveToward = (dt, tx, ty, fast) => {
      if (S.hop) {
        advanceHop(dt);
        return false;
      }
      const dx = tx - S.x;
      const dy = ty - S.y;
      const d = Math.hypot(dx, dy);
      if (d < 5) {
        S.winding = false;
        return true;
      }
      if (S.pause > 0) {
        S.pause -= dt;
        return false;
      }

      // different level → walk up to it, crouch, then spring
      const needLeap = Math.abs(dy) > (fast ? 160 : 70);
      if (needLeap && (Math.abs(dx) <= 85 || S.y - window.scrollY < 40)) {
        if (!S.winding) {
          S.winding = true;
          S.windup = 0.2;
        }
        S.windup -= dt;
        if (S.windup > 0) return false;
        S.winding = false;
        S.hop = {
          t: 0,
          dur: 0.5 + d / 1100,
          fx: S.x,
          fy: S.y,
          tx,
          ty,
          h: 0.4 + d / 500 + Math.max(0, -dy) / 260,
        };
        if (Math.abs(dx) > 6) S.yawT = Math.sign(dx) * 1.2;
        return false;
      }
      S.winding = false;

      // walk (or trot when chasing)
      let gx = tx;
      let gy = ty;
      if (needLeap) {
        gx = tx - Math.sign(dx) * 70;
        gy = S.y;
      }
      const gdx = gx - S.x;
      const gdy = gy - S.y;
      const gd = Math.hypot(gdx, gdy);
      const vT = Math.min(fast ? 215 : 96, 26 + gd * 2.4);
      S.spd += (vT - S.spd) * Math.min(1, dt * 5);
      const step = Math.min(gd, S.spd * dt);
      S.x += (gdx / gd) * step;
      S.y += (gdy / gd) * step;
      S.vNow = step / dt;
      if (Math.abs(gdx) > 6) S.yawT = Math.sign(gdx) * 1.2;
      return false;
    };

    /* ------------------------------------------------------------------ update (logic) */
    const update = (dt) => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      const now = performance.now() / 1000;
      const mdx = mouse.x + sx;
      const mdy = mouse.y + sy;

      S.vNow = 0;
      if (S.state !== "move" || S.hop) S.spd *= Math.exp(-dt * 10);
      if (S.state !== "move") S.winding = false;

      // fell far out of view (user scrolled away) → drop back in from above
      const vy = S.y - sy;
      if (!reduce && (vy < -window.innerHeight * 0.6 || vy > window.innerHeight * 1.6)) {
        S.hop = null;
        S.jump = 0;
        S.x = sx + rand(100, Math.max(140, window.innerWidth - 100));
        S.y = sy - 120;
        goPerch();
      }

      // click-triggered action
      if (S.pending && !S.hop && S.state !== "act") {
        S.pending = null;
        startAct("dress");
      }

      // cursor chase trigger
      if (
        !reduce &&
        S.state === "sit" &&
        S.chaseCd <= 0 &&
        mouse.inside &&
        now - mouse.t < 0.35 &&
        mouse.y > 100 &&
        Math.random() < dt * 0.6
      ) {
        S.goal = { kind: "chase" };
        S.chaseT = rand(5, 8);
        S.attach = null;
        S.state = "move";
      }
      S.chaseCd -= dt;

      switch (S.state) {
        case "sit": {
          S.timer -= dt;
          if (S.attach) followAttach();
          const v = S.y - sy;
          if (!reduce && (v < 80 || v > window.innerHeight + 30)) return goPerch();
          if (S.timer <= 0) decide();
          break;
        }
        case "move": {
          const g = S.goal;
          let t;
          if (g.kind === "chase") {
            S.chaseT -= dt;
            if (!mouse.inside || S.chaseT <= 0) {
              S.chaseCd = rand(6, 12);
              return sitDown(rand(1.5, 3));
            }
            t = { x: mdx, y: mdy + 42 };
            const d = Math.hypot(t.x - S.x, t.y - S.y);
            if (d < 90 && !S.hop) {
              S.winding = false;
              S.hop = { t: 0, dur: 0.5, fx: S.x, fy: S.y, tx: t.x, ty: t.y, h: 0.95 };
              S.yawT = Math.sign(t.x - S.x || 1) * 1.0;
              startAct("pounce");
              break;
            }
          } else if (g.el) {
            if (!g.el.isConnected) return sitDown(1);
            t = resolve(g);
            const ty = t.y - sy;
            if (ty < 70 || ty > window.innerHeight + 20) return goPerch();
          } else {
            t = g;
          }
          const arrived = moveToward(dt, t.x, t.y, g.kind === "chase");
          if (arrived) {
            if (g.kind === "perch") {
              S.attach = g;
              sitDown(rand(4, 9));
            } else if (g.kind === "toy") {
              S.attach = g;
              startAct("bat");
            } else if (g.kind === "chase") {
              S.chaseCd = rand(8, 14);
              S.happy = 1.5;
              sitDown(2);
            } else {
              sitDown(rand(2, 4));
            }
          }
          break;
        }
        case "act": {
          S.actT += dt;
          if (S.hop) advanceHop(dt);
          else if (S.attach) followAttach();
          const t = S.actT;
          if (S.act === "dress") {
            S.pawRT = t > 0.2 && t < 1.5 ? 1 : 0;
            S.swat = 0.1;
            if (!S.dressDone && t > 0.8) {
              S.glassesOn = !S.glassesOn;
              S.dressDone = true;
              S.happy = 1.2;
            }
            if (t > 1.9) sitDown(rand(3, 6));
          } else if (S.act === "bat") {
            S.pawRT = t > 0.3 && t < 2.0 ? 1 : 0;
            S.swat = 1;
            if (S.wiggles === 0 && t > 0.7) {
              S.wiggles = 1;
              S.attach && wiggle(S.attach.el);
            }
            if (S.wiggles === 1 && t > 1.4) {
              S.wiggles = 2;
              S.attach && wiggle(S.attach.el);
            }
            if (t > 2.4) sitDown(rand(2, 5));
          } else if (S.act === "pounce") {
            S.pawRT = S.pawLT = 1;
            S.swat = 0.8;
            if (!S.hop && t > 1.2) {
              S.chaseCd = rand(10, 20);
              S.happy = 1.6;
              sitDown(2.5);
            }
          }
          break;
        }
      }

      // look at cursor
      const hx = S.x - sx;
      const hy = S.y - sy - size * 0.5;
      const tx = mouse.inside && !reduce ? clamp((mouse.x - hx) / 260, -1, 1) : 0;
      const ty = mouse.inside && !reduce ? clamp((mouse.y - hy) / 260, -1, 1) : 0;
      S.lx += (tx - S.lx) * Math.min(1, dt * 8);
      S.ly += (ty - S.ly) * Math.min(1, dt * 8);
    };

    function followAttach() {
      if (!S.attach.el.isConnected) {
        S.attach = null;
        return;
      }
      const p = resolve(S.attach);
      S.x = lerp(S.x, p.x, 0.2);
      S.y = lerp(S.y, p.y, 0.2);
    }

    /* ------------------------------------------------------------------ leg inverse kinematics */
    // Places the paw at (zt, yt) relative to the hip, in the cat's side plane (z forward, y up).
    // Returns the summed bone angle so the paw can be kept flat on the floor.
    const solveLeg = (L, zt, yt) => {
      const maxR = LA + LB - 0.004;
      const minR = Math.abs(LA - LB) + 0.03;
      const ang = Math.atan2(zt, -yt); // direction to the target, measured from straight down
      const d = clamp(Math.hypot(zt, yt), minR, maxR);
      const zf = Math.sin(ang) * d;
      const yf = -Math.cos(ang) * d;
      const al = Math.acos(clamp((LA * LA + d * d - LB * LB) / (2 * LA * d), -1, 1));
      const th1 = -ang + L.bend * al; // upper bone
      const kz = -Math.sin(th1) * LA;
      const ky = -Math.cos(th1) * LA;
      const th2 = Math.atan2(-(zf - kz), -(yf - ky)) - th1; // lower bone, relative to the upper
      L.hip.rotation.x = th1;
      L.knee.rotation.x = th2;
      return th1 + th2;
    };

    /* ------------------------------------------------------------------ pose (animation) */
    const pose = (dt) => {
      const hop = S.hop;
      const u = hop ? clamp(hop.t, 0, 1) : 0;
      const air = hop ? Math.sin(Math.PI * u) : 0;
      const sitting =
        !hop && (S.state === "sit" || (S.state === "act" && (S.act === "dress" || S.act === "bat")));
      S.sit += ((sitting ? 1 : 0) - S.sit) * Math.min(1, dt * 6);
      S.land *= Math.exp(-dt * 9);
      S.crouch += ((S.winding ? 1 : 0) - S.crouch) * Math.min(1, dt * 14);
      S.happy = Math.max(0, S.happy - dt);
      const hp = clamp(S.happy, 0, 1);

      // gait: the cycle advances with the distance travelled, so paws never skate
      const moving = !hop && S.vNow > 6;
      S.gait += ((moving ? 1 : 0) - S.gait) * Math.min(1, dt * 7);
      S.trot += ((!hop && S.vNow > 150 ? 1 : 0) - S.trot) * Math.min(1, dt * 4);
      const duty = lerp(0.62, 0.5, S.trot); // fraction of the cycle a paw spends on the floor
      const stride = lerp(0.4, 0.56, S.trot);
      if (moving) S.phase = (S.phase + (S.vNow * dt * UNIT) / (stride / duty)) % 1;
      const gw = S.gait;
      const ph = S.phase * Math.PI * 2;

      // facing: side-on while walking, turns to the viewer when it sits
      if (!hop && (S.state === "sit" || S.state === "act")) S.yawT = S.lx * 0.45;
      root.rotation.y += (S.yawT - root.rotation.y) * Math.min(1, dt * (moving ? 7 : 9));

      // body: breathing, landing squash, walk bob + sway, sit, crouch, leap arc
      const breath = Math.sin(time * 2.2) * 0.012;
      const sq = S.land * 0.12 + S.crouch * 0.07;
      const st = air * 0.05;
      torso.scale.set(1 + sq * 0.5 - st * 0.3, 1 - sq + st + breath, 1 + sq * 0.25);
      torso.rotation.y = Math.sin(ph) * 0.05 * gw;
      const bounce = !hop && S.happy > 0 ? Math.abs(Math.sin(time * 10)) * 0.05 * hp : 0;
      const bob = Math.cos(ph * 2) * 0.012 * gw;
      rig.position.y = REST_Y - 0.21 * S.sit - 0.13 * S.crouch - 0.1 * S.land + S.jump + bounce + bob;
      rig.rotation.x =
        -0.7 * S.sit + 0.12 * S.crouch + (u - 0.5) * 0.7 * air + Math.sin(ph * 2) * 0.015 * gw;
      rig.rotation.z = Math.sin(ph) * 0.03 * gw;
      const rt = rig.rotation.x;

      // legs
      S.pawL += (S.pawLT - S.pawL) * Math.min(1, dt * 12);
      S.pawR += (S.pawRT - S.pawR) * Math.min(1, dt * 12);
      const swing = Math.sin(time * 16) * S.swat;
      const lift0 = 0.075 + 0.03 * S.trot;
      const cA = Math.cos(-rt);
      const sA = Math.sin(-rt);
      legs.forEach((L) => {
        // where this paw is in its cycle
        const p = (S.phase + lerp(L.offW, L.offT, S.trot)) % 1;
        let fz;
        let lift = 0;
        if (p < duty) {
          fz = stride * (0.5 - p / duty); // stance: slides backwards under the body
        } else {
          const k = (p - duty) / (1 - duty); // swing: lifts, reaches forward, sets down
          fz = stride * (-0.5 + k * k * (3 - 2 * k));
          lift = Math.sin(Math.PI * k) * lift0;
        }
        fz *= gw;
        lift *= gw;

        // a raised front paw also lifts at the shoulder so it can reach up to the face
        const pw = L.front ? (L.side < 0 ? S.pawL : S.pawR) : 0;
        const hy = HIP_Y + 0.2 * pw;
        const hz = L.z + 0.08 * pw;
        L.hip.position.set(L.x, hy, hz);

        // target in a floor-aligned frame: the paw stays planted however the body tilts
        const hipWorldY = rig.position.y + hy * Math.cos(rt) - hz * Math.sin(rt);
        let tz = L.z0 + fz;
        let ty = ANK - hipWorldY + lift;
        tz = lerp(tz, L.front ? 0.03 : 0.1, S.sit); // sitting: front legs straight, hind legs folded
        if (air > 0.001) {
          tz = lerp(tz, L.front ? 0.2 : -0.24, air); // front tucked, hind trailing
          ty = lerp(ty, L.front ? -0.3 : -0.36, air);
        }
        if (pw > 0.001) {
          tz = lerp(tz, 0.34 + 0.06 * swing, pw);
          ty = lerp(ty, 0.2 + 0.05 * swing, pw);
        }
        // …then into the body's tilted frame
        const zr = ty * sA + tz * cA;
        const yr = ty * cA - tz * sA;
        const sum = solveLeg(L, zr, yr);
        const swingTilt = lift > 0 ? (lift / lift0) * 0.5 : 0;
        L.ankle.rotation.x = -(sum + rt) + swingTilt - 1.0 * pw + 0.5 * air;
      });

      // claws slide out while swatting / pouncing
      const clawT = (S.pawR > 0.5 || S.pawL > 0.5) && S.swat > 0.5 ? 1 : 0.001;
      S.claw += (clawT - S.claw) * Math.min(1, dt * 14);
      clawSets[0].scale.setScalar(Math.max(0.001, S.pawL > 0.5 ? S.claw : 0.001));
      clawSets[1].scale.setScalar(Math.max(0.001, S.pawR > 0.5 ? S.claw : 0.001));

      // head: follows the cursor when still, looks where it is going when walking
      const lk = 1 - 0.65 * gw;
      head.rotation.y = clamp(S.lx * 0.7 * lk - root.rotation.y * 0.4 * (1 - gw), -0.9, 0.9);
      head.rotation.x = S.ly * 0.4 * lk - rig.rotation.x * 0.8 + 0.06 * gw;
      head.rotation.z = S.happy > 0 ? Math.sin(time * 6) * 0.08 * hp : Math.sin(ph) * 0.02 * gw;

      // eyes: gaze, dilating slit pupils, blinking + happy squint
      looks.forEach((l) => {
        l.rotation.y = S.lx * 0.32;
        l.rotation.x = S.ly * 0.26;
      });
      const excited =
        S.state === "act" && S.act === "pounce" ? 1 : S.state === "move" && S.goal && S.goal.kind === "chase" ? 0.7 : 0;
      const pupT = 0.3 + 0.45 * excited + 0.12 * hp;
      S.pup += (pupT - S.pup) * Math.min(1, dt * 8);
      pupils.forEach((p) => p.scale.set(S.pup, 1, 1.12));
      S.blinkT -= dt;
      if (S.blinkT <= 0) {
        S.blink = 0;
        S.blinkT = rand(2, 5);
      }
      if (S.blink < 1) S.blink = Math.min(1, S.blink + dt / 0.2);
      const restLid = lerp(-1.1, -0.35, hp);
      const lidA = lerp(restLid, 1.45, Math.pow(Math.sin(Math.PI * S.blink), 1.5));
      lids.forEach((l) => (l.rotation.x = lidA));

      // whiskers sweep back in the air and twitch at rest
      whiskers.forEach((w, i) => {
        w.g.rotation.y = w.ry + w.side * (air * 0.35) + Math.sin(time * 1.7 + i) * 0.03;
        w.g.rotation.z = w.rz + Math.sin(time * 2.1 + i * 1.3) * 0.02;
      });
      mouthParts.forEach((m) => (m.position.y = -0.118 - 0.012 * hp));

      // ears
      S.earT -= dt;
      if (S.earT <= 0) {
        S.earTw = 1;
        S.earT = rand(3, 7);
      }
      S.earTw = Math.max(0, S.earTw - dt * 3);
      earL.rotation.z = 0.28 + air * 0.28 + S.earTw * Math.sin(time * 40) * 0.22;
      earR.rotation.z = -0.28 - air * 0.28;
      earL.rotation.x = earR.rotation.x = 0.12 - air * 0.25;

      // tail: held low and swaying while walking, flat on the floor when sitting, up when happy
      const tailWorld = lerp(lerp(-0.95, -1.3, gw), -1.62, S.sit) + 0.5 * hp;
      tailBase.rotation.x = tailWorld - rt;
      tailBase.rotation.z = Math.sin(time * 1.3) * 0.1 + Math.sin(ph) * 0.06 * gw;
      tailBones.forEach((b, i) => {
        if (i === 0) return;
        b.rotation.z = Math.sin(time * (2.6 + hp * 6.5) - i * 0.6) * (0.14 + 0.11 * hp);
        b.rotation.x = 0.1;
      });

      // glasses on/off
      const gTarget = S.glassesOn ? 1 : 0;
      S.gT += clamp(gTarget - S.gT, -dt * 2.2, dt * 2.2);
      const g = S.gT;
      glasses.visible = g > 0.01;
      glasses.scale.setScalar(Math.max(easeOutBack(clamp(g, 0, 1)), 0.001));
      glasses.position.y = (1 - g) * 0.55;
      glasses.rotation.z = (1 - g) * 0.9 * (S.glassesOn ? 1 : -1);

      // contact shadow (follows the body, which is offset along its own axis)
      const sy = Math.abs(Math.sin(root.rotation.y));
      shadow.position.x = Math.sin(root.rotation.y) * 0.22;
      shadow.scale.set((lerp(0.85, 1.55, sy) * 1) / (1 + S.jump * 0.5), 0.3 / (1 + S.jump * 0.5), 1);
      M.shadow.opacity = 0.16 / (1 + S.jump * 0.8);
    };

    /* ------------------------------------------------------------------ events */
    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") {
        mouse.inside = false;
        return;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.t = performance.now() / 1000;
      mouse.inside = true;
    };
    const onOut = (e) => {
      if (!e.relatedTarget) mouse.inside = false;
    };
    const onDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const cx = S.x - window.scrollX;
      const cy = S.y - window.scrollY - size * 0.22;
      if (Math.hypot(e.clientX - cx, e.clientY - cy) < size * 0.28) {
        S.pending = "dress";
        S.happy = 1.5;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("mouseout", onOut);

    /* ------------------------------------------------------------------ loop */
    let raf;
    let last = performance.now();
    const loop = (ts) => {
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      time += dt;
      update(dt);
      pose(dt);
      host.style.transform = `translate3d(${S.x - window.scrollX - size / 2}px, ${
        S.y - window.scrollY - size * (1 - FEET)
      }px, 0)`;
      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* ------------------------------------------------------------------ cleanup */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("mouseout", onOut);
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      texs.forEach((t) => t.dispose());
      tailSkeleton.dispose();
      irisTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [mounted, size, perchSelector, toySelector, enableToys, startGlasses, furLayers]);

  if (!mounted) return null;
  return createPortal(
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: size,
        height: size,
        pointerEvents: "none",
        zIndex,
        willChange: "transform",
      }}
    />,
    document.body
  );
}
