import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_CONFIG } from '../../config/simulationConfig';

interface AtmosphereProps {
  timeOfDay: number;
  sunlight: number;
}

export const Atmosphere: React.FC<AtmosphereProps> = ({ timeOfDay, sunlight }) => {
  const { width, depth } = WORLD_CONFIG;
  const centerX = width / 2;
  const centerZ = depth / 2;

  const sunMeshRef = useRef<THREE.Mesh>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);

  // Celestial orbit calculations
  const sunAngle = ((timeOfDay - 6.0) / 12.0) * Math.PI;
  const isNight = timeOfDay < 6.0 || timeOfDay > 18.0;

  // Sun position
  const sunRadius = 65;
  const sunX = centerX + Math.cos(sunAngle - Math.PI / 2) * sunRadius;
  const sunY = Math.max(-10, Math.sin(sunAngle) * 55 + 5);
  const sunZ = centerZ + Math.sin(sunAngle - Math.PI / 2) * 15;

  // Moon position (opposite to sun)
  const moonAngle = sunAngle + Math.PI;
  const moonX = centerX + Math.cos(moonAngle - Math.PI / 2) * sunRadius;
  const moonY = Math.max(-10, Math.sin(moonAngle) * 55 + 5);
  const moonZ = centerZ + Math.sin(moonAngle - Math.PI / 2) * 15;

  // Dynamic light colors
  const { lightColor, skyColor, ambientIntensity, dirIntensity } = useMemo(() => {
    if (isNight) {
      return {
        lightColor: '#60a5fa', // Soft moonlit blue
        skyColor: '#030712',
        ambientIntensity: 0.15,
        dirIntensity: 0.35,
      };
    } else if (timeOfDay < 8.0 || timeOfDay > 16.5) {
      // Golden dawn / dusk
      return {
        lightColor: '#fb923c', // Warm golden orange
        skyColor: '#1e1b4b',
        ambientIntensity: 0.4,
        dirIntensity: 1.1,
      };
    } else {
      // High noon
      return {
        lightColor: '#fffbeb',
        skyColor: '#0c4a6e',
        ambientIntensity: 0.55 + (sunlight / 100) * 0.3,
        dirIntensity: 1.4,
      };
    }
  }, [timeOfDay, sunlight, isNight]);

  // Starfield positions generated deterministically
  const starPositions = useMemo(() => {
    const coords: number[] = [];
    for (let i = 0; i < 400; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 90;
      coords.push(
        centerX + r * Math.sin(phi) * Math.cos(theta),
        Math.abs(r * Math.cos(phi)) + 15, // Only in the upper hemisphere
        centerZ + r * Math.sin(phi) * Math.sin(theta)
      );
    }
    return new Float32Array(coords);
  }, [centerX, centerZ]);

  return (
    <group>
      {/* Dynamic Atmospheric Fog */}
      <fog attach="fog" args={[skyColor, 40, 150]} />

      {/* Ambient Fill Light */}
      <ambientLight color={lightColor} intensity={ambientIntensity} />

      {/* Main Celestial Directional Light (Sun or Moon) */}
      <directionalLight
        position={isNight ? [moonX, Math.max(15, moonY), moonZ] : [sunX, Math.max(10, sunY), sunZ]}
        intensity={dirIntensity}
        color={lightColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={160}
        shadow-camera-left={-width * 0.7}
        shadow-camera-right={width * 0.7}
        shadow-camera-top={depth * 0.7}
        shadow-camera-bottom={-depth * 0.7}
        shadow-bias={-0.0005}
      />

      {/* Visible Glowing Sun Sphere in the sky */}
      {!isNight && sunY > 0 && (
        <mesh ref={sunMeshRef} position={[sunX, sunY, sunZ]}>
          <sphereGeometry args={[3.2, 16, 16]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      )}

      {/* Visible Moon Sphere in the sky */}
      {isNight && moonY > 0 && (
        <mesh ref={moonMeshRef} position={[moonX, moonY, moonZ]}>
          <sphereGeometry args={[2.5, 16, 16]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>
      )}

      {/* Night Sky Starfield Particles */}
      {isNight && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[starPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.65}
            color="#ffffff"
            transparent
            opacity={0.85}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
};
