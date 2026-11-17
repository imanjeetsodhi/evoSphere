import { Organism } from '../../types/organism';
import { WORLD_CONFIG } from '../../config/simulationConfig';
import { clampVector } from '../utils/vector';

export const updateMovement = (organisms: Organism[]): Organism[] => {
  const { width, depth } = WORLD_CONFIG;

  return organisms.map((organism) => {
    if (!organism.alive || organism.species === 'plant') {
      return organism;
    }

    // Apply velocity
    let newX = organism.position.x + organism.velocity.x;
    let newZ = organism.position.z + organism.velocity.z;

    let velX = organism.velocity.x;
    let velZ = organism.velocity.z;

    // Bounce off boundary
    const margin = 2;
    if (newX <= margin) {
      newX = margin;
      velX = -velX;
    } else if (newX >= width - margin) {
      newX = width - margin;
      velX = -velX;
    }

    if (newZ <= margin) {
      newZ = margin;
      velZ = -velZ;
    } else if (newZ >= depth - margin) {
      newZ = depth - margin;
      velZ = -velZ;
    }

    return {
      ...organism,
      position: { x: newX, y: 0, z: newZ },
      velocity: { x: velX, y: 0, z: velZ },
    };
  });
};
