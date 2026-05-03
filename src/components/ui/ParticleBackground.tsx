'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSwarm({ count = 1500 }) {
  const points = useRef<THREE.Points>(null);

  // Generate random positions for particles in a sphere/cloud
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 10 + Math.random() * 15;
      
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x -= delta / 10;
      points.current.rotation.y -= delta / 15;
      // Subtle sine wave movement
      points.current.position.y = Math.sin(state.clock.elapsedTime / 2) * 0.5;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00ffff"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-50 md:opacity-100 transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }} dpr={[1, 2]}>
        <ParticleSwarm count={2000} />
      </Canvas>
      {/* Fallback gradient for very low end devices or simple mobile fallback can be done via css behind canvas */}
    </div>
  );
}
