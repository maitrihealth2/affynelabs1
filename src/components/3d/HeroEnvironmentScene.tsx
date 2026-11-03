import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroEnvironmentSceneProps {
  scrollProgress: number; // 0 to 1 across hero scroll
  isPortalActive: boolean;
}

/**
 * Atmospheric light particles & volumetric depth for the hero section.
 * Renders delicate, floating sunlit motes with subtle mouse parallax,
 * harmonizing with the contemplative subject photograph.
 */
export const HeroEnvironmentScene: React.FC<HeroEnvironmentSceneProps> = ({
  scrollProgress,
  isPortalActive,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software rendering
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    // 3. Ambient Drifting Light Particles (morning sunlit dust motes)
    const particleCount = isSoftwareGl ? 35 : 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.002,
        y: Math.random() * 0.003 + 0.0008,
        z: (Math.random() - 0.5) * 0.0015,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle sprite
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    pGrad.addColorStop(0.35, 'rgba(215, 235, 252, 0.5)');
    pGrad.addColorStop(1, 'rgba(240, 246, 252, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pTex = new THREE.CanvasTexture(pCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.1,
      map: pTex,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Subtle mouse parallax
    const pointerTarget = { x: 0, y: 0 };
    const pointerCurrent = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerTarget.x = normX * 0.3;
      pointerTarget.y = normY * 0.2;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 5. Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      pointerCurrent.x = THREE.MathUtils.damp(pointerCurrent.x, pointerTarget.x, 2.5, delta);
      pointerCurrent.y = THREE.MathUtils.damp(pointerCurrent.y, pointerTarget.y, 2.5, delta);

      // Animate particles
      const pPositions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3] += particleVelocities[i].x + Math.sin(elapsed * 0.4 + i) * 0.0008;
        pPositions[i * 3 + 1] += particleVelocities[i].y;
        pPositions[i * 3 + 2] += particleVelocities[i].z;

        if (pPositions[i * 3 + 1] > 4.0) {
          pPositions[i * 3 + 1] = -4.0;
        }
        if (Math.abs(pPositions[i * 3]) > 7.0) {
          pPositions[i * 3] *= -0.95;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle camera parallax
      const scroll = Math.min(Math.max(scrollRef.current, 0), 1);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, pointerCurrent.x * 0.4, 3.0, delta);
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        scroll * 0.4 + pointerCurrent.y * 0.25,
        3.0,
        delta
      );
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.0 - scroll * 1.5, 3.0, delta);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      particleGeo.dispose();
      particleMat.dispose();
      pTex.dispose();
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
        isPortalActive ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
};
