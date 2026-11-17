import React from 'react';
import * as THREE from 'three';
import { Organism, Plant, Rabbit, Fox } from '../../types/organism';
import { PlantRenderer } from './PlantRenderer';
import { RabbitRenderer } from './RabbitRenderer';
import { FoxRenderer } from './FoxRenderer';
import { useSimulationStore } from '../../store/simulationStore';

interface OrganismRendererProps {
  organism: Organism;
}

export const OrganismRenderer: React.FC<OrganismRendererProps> = ({ organism }) => {
  const selectedOrganismId = useSimulationStore((state) => state.selectedOrganismId);
  const selectOrganism = useSimulationStore((state) => state.selectOrganism);

  if (!organism.alive) return null;

  const isSelected = selectedOrganismId === organism.id;

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    selectOrganism(organism.id);
  };

  const renderModel = () => {
    switch (organism.species) {
      case 'plant':
        return <PlantRenderer plant={organism as Plant} />;
      case 'rabbit':
        return <RabbitRenderer rabbit={organism as Rabbit} />;
      case 'fox':
        return <FoxRenderer fox={organism as Fox} />;
      default:
        return null;
    }
  };

  return (
    <group onClick={handleClick}>
      {renderModel()}

      {/* Holographic Selection Reticle & Uplink Beacon */}
      {isSelected && (
        <group position={[organism.position.x, 0.05, organism.position.z]}>
          {/* Ground Neon Halo */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.45, 32]} />
            <meshBasicMaterial
              color="#06b6d4"
              side={THREE.DoubleSide}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Inner Accent Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6, 0.7, 32]} />
            <meshBasicMaterial
              color="#10b981"
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* Vertical Tactical Marker Pointer */}
          <mesh position={[0, 2.5, 0]}>
            <coneGeometry args={[0.3, 0.6, 8]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        </group>
      )}
    </group>
  );
};
