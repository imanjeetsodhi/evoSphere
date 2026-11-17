import { World } from '../../types/world';
import { createPlant, createRabbit, createFox } from '../factory/organismFactory';
import { WORLD_CONFIG } from '../../config/simulationConfig';
import { SeededRandom } from '../utils/random';

export const createInitialWorld = (seed = 42): World => {
  const rng = new SeededRandom(seed);
  const width = WORLD_CONFIG.width;
  const depth = WORLD_CONFIG.depth;

  const organisms: any[] = [];

  // Spawn Plants (40 to 60)
  const plantCount = Math.floor(rng.range(45, 55));
  for (let i = 0; i < plantCount; i++) {
    const x = rng.range(5, width - 5);
    const z = rng.range(5, depth - 5);
    organisms.push(createPlant({ x, y: 0, z }));
  }

  // Spawn Rabbits (6 to 10)
  const rabbitCount = Math.floor(rng.range(7, 9));
  for (let i = 0; i < rabbitCount; i++) {
    const x = rng.range(10, width - 10);
    const z = rng.range(10, depth - 10);
    organisms.push(createRabbit({ x, y: 0, z }));
  }

  // Spawn Foxes (2)
  const foxCount = 2;
  for (let i = 0; i < foxCount; i++) {
    const x = rng.range(15, width - 15);
    const z = rng.range(15, depth - 15);
    organisms.push(createFox({ x, y: 0, z }));
  }

  return {
    id: 'genesis_valley',
    name: 'Genesis Valley',
    dimensions: {
      width,
      depth,
    },
    environment: {
      temperature: 24,
      sunlight: 80,
      waterLevel: 70,
      timeOfDay: 8.0, // Start at 8 AM
      day: 1,
    },
    organisms,
    simulation: {
      isRunning: false,
      speed: 1,
      currentTick: 0,
    },
    createdAt: new Date().toISOString(),
  };
};
