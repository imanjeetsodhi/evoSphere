import React, { useRef } from 'react';
import { Fox } from '../../types/organism';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FoxRendererProps {
  fox: Fox;
}

export const FoxRenderer: React.FC<FoxRendererProps> = ({ fox }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Compute rotation angle based on velocity vector
  const angle = Math.atan2(fox.velocity.x, fox.velocity.z);

  // Dynamic scaling based on age (baby vs adult)
  const isBaby = fox.age < 80;
  const scale = isBaby ? 0.6 : 1.0 + (fox.energy / fox.maxEnergy) * 0.2;

  // Let's add a trotting animation when moving
  useFrame((state) => {
    if (!groupRef.current) return;

    const isHunting = fox.state === 'hunting';
    const speedMultiplier = isHunting ? 14 : 7;
    const time = state.clock.getElapsedTime();

    const speed = Math.sqrt(fox.velocity.x ** 2 + fox.velocity.z ** 2);
    if (speed > 0.05) {
      groupRef.current.position.y = Math.abs(Math.sin(time * speedMultiplier)) * 0.15;
      
      // Slight body waddle rotation on movement
      groupRef.current.rotation.z = Math.sin(time * speedMultiplier) * 0.05;
    } else {
      groupRef.current.position.y = 0;
      groupRef.current.rotation.z = 0;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[fox.position.x, 0, fox.position.z]}
      rotation={[0, angle, 0]}
      scale={[scale, scale, scale]}
    >
      {/* Main Body (Orange) */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.45, 1.0]} />
        <meshStandardMaterial color="#d35400" roughness={0.7} flatShading /> {/* Orange-Red */}
      </mesh>

      {/* Underbelly (White) */}
      <mesh position={[0, 0.12, 0.05]} castShadow>
        <boxGeometry args={[0.57, 0.1, 0.7]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} flatShading />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.55, 0.5]} castShadow>
        <boxGeometry args={[0.4, 0.38, 0.4]} />
        <meshStandardMaterial color="#d35400" roughness={0.7} flatShading />
      </mesh>

      {/* Snout/Muzzle */}
      <mesh position={[0, 0.48, 0.72]} castShadow>
        <boxGeometry args={[0.2, 0.18, 0.22]} />
        <meshStandardMaterial color="#e2af81" roughness={0.8} flatShading />
      </mesh>

      {/* Nose Tip */}
      <mesh position={[0, 0.48, 0.84]}>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshStandardMaterial color="#000000" roughness={0.9} />
      </mesh>

      {/* Ears */}
      {/* Left Ear */}
      <mesh position={[-0.15, 0.8, 0.45]} castShadow>
        <boxGeometry args={[0.12, 0.22, 0.06]} />
        <meshStandardMaterial color="#d35400" roughness={0.7} flatShading />
      </mesh>
      {/* Right Ear */}
      <mesh position={[0.15, 0.8, 0.45]} castShadow>
        <boxGeometry args={[0.12, 0.22, 0.06]} />
        <meshStandardMaterial color="#d35400" roughness={0.7} flatShading />
      </mesh>

      {/* Long Tail (Orange base, white tip) */}
      <group position={[0, 0.35, -0.5]} rotation={[-0.4, 0, 0]}>
        {/* Tail Base */}
        <mesh position={[0, -0.15, -0.2]} castShadow>
          <cylinderGeometry args={[0.09, 0.15, 0.5, 4]} />
          <meshStandardMaterial color="#d35400" roughness={0.7} flatShading />
        </mesh>
        {/* Tail Tip */}
        <mesh position={[0, -0.38, -0.3]} castShadow>
          <coneGeometry args={[0.1, 0.25, 4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} flatShading />
        </mesh>
      </group>

      {/* Legs (4 simple blocky legs) */}
      {/* Front Left */}
      <mesh position={[-0.2, 0.08, 0.35]} castShadow>
        <boxGeometry args={[0.12, 0.25, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} /> {/* Black feet */}
      </mesh>
      {/* Front Right */}
      <mesh position={[0.2, 0.08, 0.35]} castShadow>
        <boxGeometry args={[0.12, 0.25, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Back Left */}
      <mesh position={[-0.2, 0.08, -0.35]} castShadow>
        <boxGeometry args={[0.12, 0.25, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Back Right */}
      <mesh position={[0.2, 0.08, -0.35]} castShadow>
        <boxGeometry args={[0.12, 0.25, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Hunting Indicator (Red Warning Circle) */}
      {fox.state === 'hunting' && (
        <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.65, 8]} />
          <meshBasicMaterial color="#ff0000" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};
