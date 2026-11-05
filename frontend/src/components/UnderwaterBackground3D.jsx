import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * High-Performance 3D Underwater Background
 * Optimized for butter-smooth 60+ FPS scrolling without CPU vertex buffer bottlenecks.
 */
export default function UnderwaterBackground3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020a13, 0.035);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.5,
      60
    );
    camera.position.set(0, 3, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Turned off for max scroll performance
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1.0); // Crucial for 60fps on high-DPI laptops
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x0a2540, 1.8);
    scene.add(ambientLight);

    const directionalWaterLight = new THREE.DirectionalLight(0x00f2fe, 1.5);
    directionalWaterLight.position.set(5, 12, 6);
    scene.add(directionalWaterLight);

    // --- 1. 3D Seabed Floor (Static High-Performance Geometry) ---
    const terrainGeo = new THREE.PlaneGeometry(50, 45, 32, 32);
    terrainGeo.rotateX(-Math.PI / 2.2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const elevation =
        Math.sin(u * 0.25) * Math.cos(v * 0.25) * 1.3 +
        Math.sin(u * 0.6 + v * 0.4) * 0.4;
      pos.setZ(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x051d33,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });
    const seabedMesh = new THREE.Mesh(terrainGeo, terrainMat);
    seabedMesh.position.set(0, -5, -4);
    scene.add(seabedMesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const wireMesh = new THREE.Mesh(terrainGeo, wireMat);
    wireMesh.position.copy(seabedMesh.position);
    wireMesh.position.y += 0.02;
    scene.add(wireMesh);

    // --- 2. Marine Particulate / Marine Snow (Optimized to 220 particles) ---
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleSway = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 30;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      particleSpeeds[i] = 0.005 + Math.random() * 0.008;
      particleSway[i] = Math.random() * Math.PI * 2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Simple canvas texture for circular glow
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(0, 242, 254, 1)');
    grad.addColorStop(0.5, 'rgba(0, 229, 188, 0.4)');
    grad.addColorStop(1, 'rgba(0, 242, 254, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 3. Rising Micro-Bubbles (Optimized to 20 bubbles) ---
    const bubbleCount = 20;
    const bubbleGeo = new THREE.SphereGeometry(0.08, 6, 6);
    const bubbleMat = new THREE.MeshBasicMaterial({
      color: 0x88f4ff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const bubbleGroup = new THREE.Group();
    const bubbleData = [];

    for (let i = 0; i < bubbleCount; i++) {
      const bMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
      const startX = (Math.random() - 0.5) * 22;
      const startY = -6 + Math.random() * 12;
      const startZ = -4 + (Math.random() - 0.5) * 14;
      const scale = 0.5 + Math.random();
      bMesh.scale.set(scale, scale, scale);
      bMesh.position.set(startX, startY, startZ);
      bubbleGroup.add(bMesh);

      bubbleData.push({
        mesh: bMesh,
        speed: 0.025 + Math.random() * 0.03,
        swaySpeed: 1 + Math.random() * 1.5,
        swayOffset: Math.random() * Math.PI * 2,
        initialX: startX,
      });
    }
    scene.add(bubbleGroup);

    // --- 4. Light Rays (Static Cone Meshes) ---
    const rayGeo = new THREE.ConeGeometry(7, 24, 12, 1, true);
    rayGeo.rotateX(Math.PI);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const rayMesh1 = new THREE.Mesh(rayGeo, rayMat);
    rayMesh1.position.set(-4, 9, -2);
    rayMesh1.rotation.z = 0.25;
    scene.add(rayMesh1);

    // Mouse movement smoothing
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 1.2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Optimized Animation Loop (Zero CPU vertex reallocation) ---
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      camera.position.x = mouseX;
      camera.position.y = 3 - mouseY;
      camera.lookAt(0, 0, 0);

      // GPU Transform-Only Seabed Undulation (No CPU vertex array manipulation!)
      seabedMesh.position.y = -5 + Math.sin(elapsedTime * 0.35) * 0.12;
      seabedMesh.rotation.z = Math.sin(elapsedTime * 0.2) * 0.015;
      wireMesh.position.copy(seabedMesh.position);
      wireMesh.position.y += 0.02;
      wireMesh.rotation.copy(seabedMesh.rotation);

      // Micro-Bubbles Animation
      for (let i = 0; i < bubbleCount; i++) {
        const b = bubbleData[i];
        b.mesh.position.y += b.speed;
        b.mesh.position.x = b.initialX + Math.sin(elapsedTime * b.swaySpeed + b.swayOffset) * 0.25;
        if (b.mesh.position.y > 9) {
          b.mesh.position.y = -6;
        }
      }

      // Animate Particles with minimal overhead
      const pPositions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3 + 1] -= particleSpeeds[i];
        if (pPositions[i * 3 + 1] < -8) {
          pPositions[i * 3 + 1] = 8;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      wireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      bubbleGeo.dispose();
      bubbleMat.dispose();
      rayGeo.dispose();
      rayMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 25%, #05182f 0%, #030d1a 65%, #01060d 100%)',
        willChange: 'transform',
      }}
    />
  );
}
