import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const FooterScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

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

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(5, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x174b91, 1.5);
    dirLight2.position.set(-5, -4, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x60a5fa, 2, 12);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // 4. Moving Elements: Multiple floating 3D geometric & organic shapes
    const elementsGroup = new THREE.Group();
    scene.add(elementsGroup);

    interface FloatingObject {
      mesh: THREE.Mesh | THREE.LineSegments;
      baseX: number;
      baseY: number;
      baseZ: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      orbitRadius: number;
      orbitSpeed: number;
      phase: number;
    }

    const floatingObjects: FloatingObject[] = [];

    // Materials
    const glassSphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.4,
      ior: 1.3,
    });

    const deepBlueMat = new THREE.MeshPhysicalMaterial({
      color: 0x174b91,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2,
      metalness: 0.3,
    });

    const softOpalMat = new THREE.MeshStandardMaterial({
      color: 0xdbeafe,
      transparent: true,
      opacity: 0.75,
      roughness: 0.3,
      metalness: 0.1,
    });

    const wireMat = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.5,
    });

    // Geometries
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const torusGeo = new THREE.TorusGeometry(1, 0.25, 24, 48);
    const icoGeo = new THREE.IcosahedronGeometry(1, 0);
    const octaGeo = new THREE.OctahedronGeometry(1, 0);

    // Create 20 distinct moving 3D objects
    const configs = [
      // Large orbiting shapes
      { geo: sphereGeo, mat: glassSphereMat, scale: 0.65, x: -3.8, y: 1.2, z: -1.5 },
      { geo: sphereGeo, mat: softOpalMat, scale: 0.55, x: 3.6, y: -1.0, z: -1.2 },
      { geo: torusGeo, mat: deepBlueMat, scale: 0.5, x: -2.2, y: -1.4, z: -0.8 },
      { geo: torusGeo, mat: glassSphereMat, scale: 0.6, x: 2.5, y: 1.5, z: -1.0 },
      { geo: icoGeo, mat: deepBlueMat, scale: 0.45, x: -1.2, y: 1.8, z: -1.6 },
      { geo: octaGeo, mat: softOpalMat, scale: 0.5, x: 1.0, y: -1.8, z: -1.4 },
      // Mid-sized floating shapes
      { geo: sphereGeo, mat: deepBlueMat, scale: 0.4, x: -4.5, y: -0.5, z: -2.0 },
      { geo: sphereGeo, mat: glassSphereMat, scale: 0.45, x: 4.2, y: 0.8, z: -1.8 },
      { geo: torusGeo, mat: softOpalMat, scale: 0.35, x: -0.5, y: -2.1, z: -1.5 },
      { geo: icoGeo, mat: glassSphereMat, scale: 0.38, x: 0.2, y: 2.2, z: -1.7 },
      // Small accent satellites
      { geo: sphereGeo, mat: softOpalMat, scale: 0.28, x: -2.8, y: 0.2, z: -0.5 },
      { geo: sphereGeo, mat: glassSphereMat, scale: 0.3, x: 3.1, y: -0.2, z: -0.6 },
      { geo: octaGeo, mat: deepBlueMat, scale: 0.32, x: -1.8, y: -0.9, z: -1.2 },
      { geo: icoGeo, mat: softOpalMat, scale: 0.25, x: 1.8, y: 0.7, z: -0.9 },
      { geo: torusGeo, mat: glassSphereMat, scale: 0.3, x: -3.2, y: -1.6, z: -1.8 },
      { geo: sphereGeo, mat: deepBlueMat, scale: 0.22, x: 3.8, y: 2.0, z: -2.2 },
      { geo: sphereGeo, mat: softOpalMat, scale: 0.25, x: -4.2, y: 2.1, z: -2.0 },
      { geo: octaGeo, mat: glassSphereMat, scale: 0.28, x: 0.0, y: -1.2, z: -1.0 },
    ];

    configs.forEach((cfg, idx) => {
      const mesh = new THREE.Mesh(cfg.geo, cfg.mat);
      mesh.scale.setScalar(cfg.scale);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      elementsGroup.add(mesh);

      // Wireframe overlay for selected geometric shapes
      if (cfg.geo === icoGeo || cfg.geo === octaGeo) {
        const wireGeo = new THREE.WireframeGeometry(cfg.geo);
        const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
        mesh.add(wireMesh);
      }

      floatingObjects.push({
        mesh,
        baseX: cfg.x,
        baseY: cfg.y,
        baseZ: cfg.z,
        speedX: (Math.random() - 0.5) * 0.4 + 0.2,
        speedY: (Math.random() - 0.5) * 0.4 + 0.3,
        speedZ: (Math.random() - 0.5) * 0.3,
        rotSpeedX: (Math.random() - 0.5) * 0.015 + 0.005,
        rotSpeedY: (Math.random() - 0.5) * 0.015 + 0.008,
        orbitRadius: 0.3 + Math.random() * 0.4,
        orbitSpeed: 0.5 + Math.random() * 0.8,
        phase: idx * 0.45,
      });
    });

    // 5. Ambient Floating Light Particles (70 drifting light motes)
    const particleCount = isSoftwareGl ? 30 : 70;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 16;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      pVelocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: Math.random() * 0.002 + 0.001,
        z: (Math.random() - 0.5) * 0.002,
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    // Particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
    pGrad.addColorStop(0.4, 'rgba(23, 75, 145, 0.4)');
    pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pTex = new THREE.CanvasTexture(pCanvas);
    const pMat = new THREE.PointsMaterial({
      size: 0.12,
      map: pTex,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 6. Mouse parallax
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTarget.x = x * 0.6;
      mouseTarget.y = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 7. Resize handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Mouse damping
      mouseCurrent.x = THREE.MathUtils.damp(mouseCurrent.x, mouseTarget.x, 3.0, delta);
      mouseCurrent.y = THREE.MathUtils.damp(mouseCurrent.y, mouseTarget.y, 3.0, delta);

      elementsGroup.position.x = mouseCurrent.x * 0.4;
      elementsGroup.position.y = mouseCurrent.y * 0.3;

      // Animate each floating object in unique orbits & rotations
      for (let i = 0; i < floatingObjects.length; i++) {
        const obj = floatingObjects[i];
        const t = elapsed * obj.orbitSpeed + obj.phase;

        obj.mesh.position.x = obj.baseX + Math.sin(t * obj.speedX) * obj.orbitRadius;
        obj.mesh.position.y = obj.baseY + Math.cos(t * obj.speedY) * (obj.orbitRadius * 0.8);
        obj.mesh.position.z = obj.baseZ + Math.sin(t * 0.5) * 0.3;

        obj.mesh.rotation.x += obj.rotSpeedX;
        obj.mesh.rotation.y += obj.rotSpeedY;
      }

      // Animate drifting particles
      const posArr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += pVelocities[i].x + Math.sin(elapsed * 0.3 + i) * 0.001;
        posArr[i * 3 + 1] += pVelocities[i].y;
        posArr[i * 3 + 2] += pVelocities[i].z;

        if (posArr[i * 3 + 1] > 4.5) {
          posArr[i * 3 + 1] = -4.5;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      sphereGeo.dispose();
      torusGeo.dispose();
      icoGeo.dispose();
      octaGeo.dispose();
      pGeo.dispose();
      pTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

