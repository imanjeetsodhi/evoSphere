import React from 'react';
import { Plant } from '../../types/organism';

interface PlantRendererProps {
  plant: Plant;
}

export const PlantRenderer: React.FC<PlantRendererProps> = ({ plant }) => {
  // Scale reflects growth stage (energy)
  const leafScale = 0.4 + plant.growthStage * 0.8;

  return (
    <group position={[plant.position.x, 0, plant.position.z]}>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.1, 0.4, 4]} />
        <meshStandardMaterial color="#4d2c18" roughness={0.9} />
      </mesh>
      
      {/* Foliage (Clustered Leaves) */}
      <mesh position={[0, 0.5, 0]} scale={[leafScale, leafScale, leafScale]} castShadow>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#2e8b57" roughness={0.8} flatShading />
      </mesh>

      {/* Flower Bud (Only on high energy, indicating reproduction readiness) */}
      {plant.energy > 40 && (
        <mesh position={[0, 0.5 + leafScale * 0.4, 0]} scale={[0.15, 0.15, 0.15]} castShadow>
          <sphereGeometry args={[0.8, 4, 4]} />
          <meshStandardMaterial color="#e68fac" roughness={0.5} flatShading />
        </mesh>
      )}
    </group>
  );
};
