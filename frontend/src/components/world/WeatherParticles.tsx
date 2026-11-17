import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_CONFIG } from '../../config/simulationConfig';
import { WeatherType } from '../../store/simulationStore';

interface WeatherParticlesProps {
  weather: WeatherType;
  isNight: boolean;
}

export const WeatherParticles: React.FC<WeatherParticlesProps> = ({ weather, isNight }) => {
  const { width, depth } = WORLD_CONFIG;
  const particleCount = weather === 'monsoon' ? 600 : 180;

  const pointsRef = useRef<THREE.Points>(null);

  // Initialize particle positions and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = Math.random() * width;
      pos[i * 3 + 1] = Math.random() * 25 + 1;
      pos[i * 3 + 2] = Math.random() * depth;

      if (weather === 'monsoon') {
        // Falling rain
        vel[i * 3] = -0.05;
        vel[i * 3 + 1] = -(Math.random() * 0.8 + 0.6);
        vel[i * 3 + 2] = -0.05;
      } else {
        // Floating spores / fireflies
        vel[i * 3] = (Math.random() - 0.5) * 0.04;
        vel[i * 3 + 1] = (Math.random() - 0.5) * 0.03;
        vel[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
      }
    }
    return [pos, vel];
  }, [particleCount, weather, width, depth]);

  // Particle color and size based on weather
  const { color, size } = useMemo(() => {
    if (weather === 'monsoon') {
      return { color: '#60a5fa', size: 0.35 };
    }
    if (weather === 'drought') {
      return { color: '#fb923c', size: 0.25 };
    }
    if (weather === 'superbloom') {
      return { color: '#f472b6', size: 0.45 };
    }
    if (isNight) {
      // Night fireflies
      return { color: '#4ade80', size: 0.4 };
    }
    // Subtle daytime pollen
    return { color: '#fde047', size: 0.2 };
  }, [weather, isNight]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      array[i * 3] += velocities[i * 3];
      array[i * 3 + 1] += velocities[i * 3 + 1];
      array[i * 3 + 2] += velocities[i * 3 + 2];

      // Respawn if out of bounds
      if (array[i * 3 + 1] < 0) {
        array[i * 3 + 1] = 25;
        array[i * 3] = Math.random() * width;
        array[i * 3 + 2] = Math.random() * depth;
      }
      if (array[i * 3] < 0 || array[i * 3] > width) {
        array[i * 3] = Math.random() * width;
      }
      if (array[i * 3 + 2] < 0 || array[i * 3 + 2] > depth) {
        array[i * 3 + 2] = Math.random() * depth;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={weather === 'monsoon' ? 0.75 : 0.85}
        sizeAttenuation
      />
    </points>
  );
};
