import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface HeroSculptureSceneProps {
  scrollProgress: number; // 0 to 1 across whole page
  isPortalActive: boolean;
  onSceneReady?: () => void;
}

// Module-level reusable math objects
const _pointerTarget = new THREE.Vector2(0, 0);
const _pointerCurrent = new THREE.Vector2(0, 0);

export const HeroSculptureScene: React.FC<HeroSculptureSceneProps> = ({
  scrollProgress,
  isPortalActive,
  onSceneReady,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL check
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene setup with soft sky-blue fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf0f6fc, 0.04);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 5.6);

    // 2. Renderer configuration
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Soft, natural daylight lighting rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    keyLight.position.set(3.5, 4.5, 4);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdcebfa, 0.7);
    fillLight.position.set(-3.5, -1, -2);
    scene.add(fillLight);

    const softRimLight = new THREE.DirectionalLight(0x174b91, 0.9);
    softRimLight.position.set(0, -3.5, 3);
    scene.add(softRimLight);

    // 5. Carefully Art-Directed 3D Subject: "The Form of Understanding"
    // Replaced the mechanical knot with an organic, calm, human-centered sculpture
    // inspired by peaceful Japanese/Scandinavian minimalist aesthetics.
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.set(0, 0, 0);

    // Part 1: Primary Organic Core (Translucent Sea-Glass / Soft Opal Pebble)
    const coreGeometry = new THREE.SphereGeometry(0.85, 64, 64);
    // Deform geometry slightly into an organic, pebble-like natural droplet shape
    const pos = coreGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const factor = 1 + 0.08 * Math.sin(2.5 * y) + 0.05 * Math.cos(3 * x);
      pos.setXYZ(i, x * factor, y * (1 + 0.12 * Math.sin(x * 2)), z * factor);
    }
    coreGeometry.computeVertexNormals();

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xebf5fe,
      roughness: 0.12,
      metalness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.82,
      thickness: 1.4,
      ior: 1.48,
      transparent: true,
      opacity: isSoftwareGl ? 0.45 : 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      attenuationColor: new THREE.Color(0xdcebfa),
      attenuationDistance: 2.0,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreMesh.castShadow = !isSoftwareGl;
    sculptureGroup.add(coreMesh);

    // Part 2: Inner Luminous Nucleus (Gentle warm blue inner heart)
    const innerNucleusGeo = new THREE.SphereGeometry(0.42, 36, 36);
    const innerNucleusMat = new THREE.MeshStandardMaterial({
      color: 0x174b91,
      emissive: 0x102e57,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.3,
    });
    const innerNucleusMesh = new THREE.Mesh(innerNucleusGeo, innerNucleusMat);
    sculptureGroup.add(innerNucleusMesh);

    // Part 3: The Embracing Ribbon (Soft brushed satin silver-white curved form)
    // A single, elegant sweeping curve that wraps like protective cupped hands
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, -0.6, 0.4),
      new THREE.Vector3(-0.9, 0.8, -0.3),
      new THREE.Vector3(0.4, 1.2, 0.2),
      new THREE.Vector3(1.3, 0.1, -0.4),
      new THREE.Vector3(0.8, -1.0, 0.3),
      new THREE.Vector3(-0.6, -1.1, -0.2),
    ], true);

    const ribbonGeo = new THREE.TubeGeometry(curve, 96, 0.09, 20, true);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xf7f9fc,
      roughness: 0.24,
      metalness: 0.88,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.castShadow = !isSoftwareGl;
    ribbonMesh.receiveShadow = !isSoftwareGl;
    sculptureGroup.add(ribbonMesh);

    // Part 4: Floating Ripple Arc (Secondary peaceful horizon ring)
    const arcGeo = new THREE.TorusGeometry(1.75, 0.025, 16, 100, Math.PI * 1.5);
    const arcMat = new THREE.MeshStandardMaterial({
      color: 0xaebbc9,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7,
    });
    const arcMesh = new THREE.Mesh(arcGeo, arcMat);
    arcMesh.rotation.x = Math.PI / 2.3;
    arcMesh.rotation.y = -Math.PI / 6;
    sculptureGroup.add(arcMesh);

    // Part 5: Soft ground radial contact shadow plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(16, 46, 87, 0.22)');
    grad.addColorStop(0.5, 'rgba(23, 75, 145, 0.06)');
    grad.addColorStop(1, 'rgba(240, 246, 252, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const groundShadowGeo = new THREE.PlaneGeometry(4.4, 4.4);
    const groundShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    });
    const groundShadow = new THREE.Mesh(groundShadowGeo, groundShadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -1.65;
    sculptureGroup.add(groundShadow);

    scene.add(sculptureGroup);

    // Pointer response
    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      _pointerTarget.set(normX * 0.35, normY * 0.25);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    onSceneReady?.();

    // Render loop with peaceful, breathing motion
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Smooth pointer response damping
      _pointerCurrent.x = THREE.MathUtils.damp(_pointerCurrent.x, _pointerTarget.x, 3.0, delta);
      _pointerCurrent.y = THREE.MathUtils.damp(_pointerCurrent.y, _pointerTarget.y, 3.0, delta);

      // Gentle organic breathing animation (calm and peaceful)
      const breath = 1 + Math.sin(elapsed * 0.8) * 0.04;
      coreMesh.scale.set(breath, breath * 1.02, breath);
      innerNucleusMesh.scale.set(breath * 0.95, breath * 0.95, breath * 0.95);

      // Slow, meditative rotation
      ribbonMesh.rotation.y = elapsed * 0.12;
      ribbonMesh.rotation.z = Math.sin(elapsed * 0.15) * 0.1;
      arcMesh.rotation.z = -elapsed * 0.06;
      coreMesh.rotation.y = elapsed * 0.08;

      // Scroll choreography: continuously present, growing gently with page scroll
      const currentScroll = scrollRef.current;
      const scrollGrow = 1 + currentScroll * 0.38;
      sculptureGroup.scale.set(scrollGrow, scrollGrow, scrollGrow);

      // Natural tilt with pointer + smooth scroll rotation
      sculptureGroup.rotation.y = _pointerCurrent.x * 0.45 + currentScroll * Math.PI * 0.55;
      sculptureGroup.rotation.x = -_pointerCurrent.y * 0.3 + Math.sin(currentScroll * Math.PI) * 0.1;

      // Camera smoothly tracks to keep the organic sculpture centered in the background
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.1 - currentScroll * 0.25, 2.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.6 - currentScroll * 0.2, 2.5, delta);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Cleanup
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      coreGeometry.dispose();
      coreMaterial.dispose();
      innerNucleusGeo.dispose();
      innerNucleusMat.dispose();
      ribbonGeo.dispose();
      ribbonMat.dispose();
      arcGeo.dispose();
      arcMat.dispose();
      groundShadowGeo.dispose();
      shadowTex.dispose();
      groundShadowMat.dispose();

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
        isPortalActive ? 'opacity-80' : 'opacity-100'
      }`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
