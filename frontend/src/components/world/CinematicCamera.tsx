import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';
import { WORLD_CONFIG } from '../../config/simulationConfig';

export const CinematicCamera: React.FC = () => {
  const { camera } = useThree();
  const cameraMode = useSimulationStore((state) => state.cameraMode);
  const selectedOrganismId = useSimulationStore((state) => state.selectedOrganismId);
  const world = useSimulationStore((state) => state.world);

  const controlsRef = useRef<any>(null);

  const centerX = WORLD_CONFIG.width / 2;
  const centerZ = WORLD_CONFIG.depth / 2;

  useFrame((_, delta) => {
    // 1. Follow camera tracking selected organism
    if (cameraMode === 'follow' && selectedOrganismId && world) {
      const selectedOrg = world.organisms.find(
        (o) => o.id === selectedOrganismId && o.alive
      );

      if (selectedOrg) {
        const orgPos = new THREE.Vector3(
          selectedOrg.position.x,
          selectedOrg.position.y,
          selectedOrg.position.z
        );

        // Calculate offset behind creature
        const speed = Math.sqrt(selectedOrg.velocity.x ** 2 + selectedOrg.velocity.z ** 2);
        const dirX = speed > 0.01 ? selectedOrg.velocity.x / speed : 0;
        const dirZ = speed > 0.01 ? selectedOrg.velocity.z / speed : 1;

        const targetCamPos = new THREE.Vector3(
          orgPos.x - dirX * 9,
          orgPos.y + 6,
          orgPos.z - dirZ * 9
        );

        camera.position.lerp(targetCamPos, delta * 4);
        camera.lookAt(orgPos.x, orgPos.y + 0.8, orgPos.z);

        if (controlsRef.current) {
          controlsRef.current.target.lerp(orgPos, delta * 4);
          controlsRef.current.update();
        }
        return;
      }
    }

    // 2. Top-Down Satellite / Heatmap View
    if (cameraMode === 'topDown') {
      const targetPos = new THREE.Vector3(centerX, 95, centerZ + 0.01);
      camera.position.lerp(targetPos, delta * 3);
      camera.lookAt(centerX, 0, centerZ);

      if (controlsRef.current) {
        controlsRef.current.target.set(centerX, 0, centerZ);
        controlsRef.current.update();
      }
      return;
    }

    // 3. Bird's Eye Isometric View
    if (cameraMode === 'isometric') {
      const targetPos = new THREE.Vector3(centerX + 60, 55, centerZ + 60);
      camera.position.lerp(targetPos, delta * 3);
      camera.lookAt(centerX, 0, centerZ);

      if (controlsRef.current) {
        controlsRef.current.target.set(centerX, 0, centerZ);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[centerX, 0, centerZ]}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={10}
      maxDistance={140}
      enabled={cameraMode === 'orbit'}
    />
  );
};
