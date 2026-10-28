'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Text } from '@/components/ui/Text';
import styles from './ModelCanvas.module.css';

/** A generic laptop drawn as thin lines. It is a placeholder shape, not a model of a real asset. */
function buildLaptop(): THREE.Group {
  const group = new THREE.Group();
  const addBox = (w: number, h: number, d: number, place: (m: THREE.LineSegments) => void) => {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geometry));
    geometry.dispose();
    place(lines);
    group.add(lines);
  };
  addBox(3.2, 0.12, 2.2, () => {});
  addBox(3.2, 2.0, 0.08, (m) => {
    m.position.set(0, 1.0, -1.05);
    m.rotation.x = -0.2;
  });
  addBox(2.4, 0.01, 1.0, (m) => m.position.set(0, 0.07, 0.35));
  return group;
}

export default function ModelCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setUnsupported(true);
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(4.6, 3.2, 5.6);

    const laptop = buildLaptop();
    scene.add(laptop);
    laptop.position.y = -0.6;

    const material = new THREE.LineBasicMaterial();
    laptop.children.forEach((c) => ((c as THREE.LineSegments).material = material));
    const applyColour = () => {
      material.color.set(getComputedStyle(document.documentElement).getPropertyValue('--color-ink-muted').trim() || '#666666');
      render();
    };

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Wheel zoom is off on purpose: it would capture page scrolling over the card.
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !reduceMotion.matches;
    controls.autoRotate = !reduceMotion.matches;
    controls.autoRotateSpeed = 0.8;

    function render() {
      renderer.render(scene, camera);
    }

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    // With reduced motion nothing animates: draw only when the user drags the model.
    controls.addEventListener('change', render);
    let frame = 0;
    const tick = () => {
      controls.update();
      render();
      frame = requestAnimationFrame(tick);
    };
    if (!reduceMotion.matches) frame = requestAnimationFrame(tick);

    scheme.addEventListener('change', applyColour);
    applyColour();
    resize();

    return () => {
      cancelAnimationFrame(frame);
      scheme.removeEventListener('change', applyColour);
      observer.disconnect();
      controls.dispose();
      laptop.children.forEach((c) => (c as THREE.LineSegments).geometry.dispose());
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (unsupported) {
    return (
      <div className={styles.fallback}>
        <Text tone="muted" size="sm">3D preview needs WebGL, which is not available in this browser.</Text>
      </div>
    );
  }
  return <div ref={mountRef} className={styles.canvas} role="img" aria-label="Rotating line drawing of a generic laptop" />;
}
