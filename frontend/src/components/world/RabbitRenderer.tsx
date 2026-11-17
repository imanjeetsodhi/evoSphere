import React, { useRef } from 'react';
import { Rabbit } from '../../types/organism';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RabbitRendererProps {
  rabbit: Rabbit;
}

export const RabbitRenderer: React.FC<RabbitRendererProps> = ({ rabbit }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Compute rotation angle based on velocity vector
  const angle = Math.atan2(rabbit.velocity.x, rabbit.velocity.z);

  // Dynamic scaling based on age (baby vs adult)
  const isBaby = rabbit.age < 50;
  const scale = isBaby ? 0.5 : 0.8 + (rabbit.energy / rabbit.maxEnergy) * 0.2;

  // Let's add a slight jumping/bouncing animation when moving using useFrame
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Bouncing effect based on movement speed
    const isWandering = rabbit.state === 'wandering';
    const speedMultiplier = rabbit.state === 'fleeing' ? 12 : isWandering ? 6 : 8;
    const time = state.clock.getElapsedTime();
    
    // Only bounce if actually moving
    const speed = Math.sqrt(rabbit.velocity.x ** 2 + rabbit.velocity.z ** 2);
    if (speed > 0.05) {
      groupRef.current.position.y = Math.abs(Math.sin(time * speedMultiplier)) * 0.25;
    } else {
      groupRef.current.position.y = 0;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[rabbit.position.x, 0, rabbit.position.z]}
      rotation={[0, angle, 0]}
      scale={[scale, scale, scale]}
    >
      {/* Main Body */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.4, 0.7]} />
        <meshStandardMaterial
          color={rabbit.gender === 'male' ? '#eaeaea' : '#dcdcdc'} // Light gray vs pale gray
          roughness={0.8}
          flatShading
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.45, 0.35]} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial
          color={rabbit.gender === 'male' ? '#eaeaea' : '#dcdcdc'}
          roughness={0.8}
          flatShading
        />
      </mesh>

      {/* Ears */}
      {/* Left Ear */}
      <mesh position={[-0.1, 0.7, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.05]} />
        <meshStandardMaterial color="#ffc0cb" roughness={0.9} flatShading />
      </mesh>
      {/* Right Ear */}
      <mesh position={[0.1, 0.7, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.05]} />
        <meshStandardMaterial color="#ffc0cb" roughness={0.9} flatShading />
      </mesh>

      {/* Small Tail */}
      <mesh position={[0, 0.3, -0.38]} castShadow>
        <sphereGeometry args={[0.12, 4, 4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* Fleeing Warning Halo (Visual debug cue when fleeing) */}
      {rabbit.state === 'fleeing' && (
        <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.55, 8]} />
          <meshBasicMaterial color="#ff3333" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Mating/Seeking indicator */}
      {rabbit.state === 'seeking_mate' && (
        <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 8]} />
          <meshBasicMaterial color="#ff69b4" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};
