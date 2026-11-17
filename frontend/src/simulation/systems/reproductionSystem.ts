import { Organism, Rabbit, Fox, Plant } from '../../types/organism';
import { SimulationEvent } from '../../types/events';
import { SPECIES_CONFIG, WORLD_CONFIG } from '../../config/simulationConfig';
import { getDistanceSq } from '../utils/vector';
import { createPlant, createRabbit, createFox } from '../factory/organismFactory';

export const resolveReproduction = (
  organisms: Organism[],
  day: number,
  tick: number
): {
  organisms: Organism[];
  events: SimulationEvent[];
  birthsCount: number;
} => {
  const plantConfig = SPECIES_CONFIG.plant;
  const rabbitConfig = SPECIES_CONFIG.rabbit;
  const foxConfig = SPECIES_CONFIG.fox;

  const events: SimulationEvent[] = [];
  let birthsCount = 0;

  const updatedOrganisms = [...organisms];
  const newSpawned: Organism[] = [];

  // Track who reproduced this tick to prevent multiple pairings
  const reproducedSet = new Set<string>();

  // 1. Plant Reproduction (Asexual seeding)
  const activePlants = updatedOrganisms.filter(
    (o) => o.species === 'plant' && o.alive
  ) as Plant[];

  for (const plant of activePlants) {
    if (
      plant.energy >= plantConfig.reproductionThreshold &&
      plant.reproductionCooldown <= 0
    ) {
      // Find parent in the updated array
      const parentIdx = updatedOrganisms.findIndex((o) => o.id === plant.id);
      if (parentIdx !== -1) {
        // Spend energy and set cooldown
        updatedOrganisms[parentIdx] = {
          ...updatedOrganisms[parentIdx],
          energy: updatedOrganisms[parentIdx].energy - plantConfig.reproductionEnergyCost,
          reproductionCooldown: plantConfig.reproductionCooldown,
        } as Plant;

        // Spawn new plant in a small radius
        const angle = Math.random() * Math.PI * 2;
        const dist = 5 + Math.random() * 8;
        const spawnX = Math.max(2, Math.min(WORLD_CONFIG.width - 2, plant.position.x + Math.cos(angle) * dist));
        const spawnZ = Math.max(2, Math.min(WORLD_CONFIG.depth - 2, plant.position.z + Math.sin(angle) * dist));

        const babyPlant = createPlant({ x: spawnX, y: 0, z: spawnZ }, plant.generation + 1);
        newSpawned.push(babyPlant);
        birthsCount++;

        events.push({
          id: `birth_plant_${tick}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'PLANT_GROWTH',
          timestamp: tick,
          day,
          message: `Plant seeded a new shoot (Gen ${babyPlant.generation})`,
          organismId: babyPlant.id,
          species: 'plant',
        });
      }
    }
  }

  // Helper for Animal mating
  const mateAnimals = <T extends Rabbit | Fox>(
    species: 'rabbit' | 'fox',
    config: typeof rabbitConfig | typeof foxConfig,
    creator: (pos: { x: number; y: number; z: number }, gender: 'male' | 'female', gen: number) => T
  ) => {
    const animals = updatedOrganisms.filter(
      (o) => o.species === species && o.alive
    ) as T[];

    for (const parentA of animals) {
      if (reproducedSet.has(parentA.id)) continue;
      if (parentA.energy < config.reproductionThreshold || parentA.reproductionCooldown > 0) continue;

      // Look for a suitable mate
      let closestMate: T | null = null;
      let minD2 = Infinity;

      for (const parentB of animals) {
        if (parentB.id === parentA.id) continue;
        if (reproducedSet.has(parentB.id)) continue;
        if (parentB.gender === parentA.gender) continue; // opposite gender
        if (parentB.energy < config.reproductionThreshold || parentB.reproductionCooldown > 0) continue;

        const d2 = getDistanceSq(parentA.position, parentB.position);
        if (d2 < minD2) {
          minD2 = d2;
          closestMate = parentB;
        }
      }

      // If in contact distance (e.g. 2.5)
      const matingDist = 2.5;
      if (closestMate && minD2 <= matingDist * matingDist) {
        reproducedSet.add(parentA.id);
        reproducedSet.add(closestMate.id);

        // Deduct energy & set cooldown on parents
        const idxA = updatedOrganisms.findIndex((o) => o.id === parentA.id);
        const idxB = updatedOrganisms.findIndex((o) => o.id === closestMate!.id);

        if (idxA !== -1 && idxB !== -1) {
          updatedOrganisms[idxA] = {
            ...updatedOrganisms[idxA],
            energy: updatedOrganisms[idxA].energy - config.reproductionEnergyCost,
            reproductionCooldown: config.reproductionCooldown,
          } as T;

          updatedOrganisms[idxB] = {
            ...updatedOrganisms[idxB],
            energy: updatedOrganisms[idxB].energy - config.reproductionEnergyCost,
            reproductionCooldown: config.reproductionCooldown,
          } as T;

          // Spawn baby at average position
          const spawnX = (parentA.position.x + closestMate.position.x) / 2;
          const spawnZ = (parentA.position.z + closestMate.position.z) / 2;
          const babyGender = Math.random() > 0.5 ? 'male' : 'female';
          const maxParentGen = Math.max(parentA.generation, closestMate.generation);

          const baby = creator({ x: spawnX, y: 0, z: spawnZ }, babyGender, maxParentGen + 1);
          newSpawned.push(baby);
          birthsCount++;

          events.push({
            id: `birth_${species}_${tick}_${Math.random().toString(36).substring(2, 6)}`,
            type: 'BIRTH',
            timestamp: tick,
            day,
            message: `New baby ${species} born (${baby.gender === 'male' ? '♂' : '♀'}, Gen ${baby.generation})`,
            organismId: baby.id,
            species,
          });
        }
      }
    }
  };

  // Mating for rabbits and foxes
  mateAnimals<Rabbit>('rabbit', rabbitConfig, createRabbit);
  mateAnimals<Fox>('fox', foxConfig, createFox);

  return {
    organisms: [...updatedOrganisms, ...newSpawned],
    events,
    birthsCount,
  };
};
