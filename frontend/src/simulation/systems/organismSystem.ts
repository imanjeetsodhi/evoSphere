import { Organism, Plant } from '../../types/organism';
import { Environment } from '../../types/environment';
import { SPECIES_CONFIG } from '../../config/simulationConfig';

export const updateOrganisms = (
  organisms: Organism[],
  environment: Environment
): Organism[] => {
  const plantConfig = SPECIES_CONFIG.plant;

  return organisms.map((organism) => {
    if (!organism.alive) {
      return organism;
    }

    // 1. Age
    const nextAge = organism.age + 1;
    const isTooOld = nextAge >= organism.maxAge;

    // 2. Cooldown decay
    const nextCooldown = Math.max(0, organism.reproductionCooldown - 1);

    if (organism.species === 'plant') {
      const plant = organism as Plant;

      // Growth rate based on sunlight and water availability
      const sunFactor = environment.sunlight / 100;
      const waterFactor = environment.waterLevel / 100;
      const environmentGrowth = plantConfig.growthRate * sunFactor * waterFactor;

      const nextEnergy = Math.min(
        plant.maxEnergy,
        plant.energy + environmentGrowth
      );
      const growthStage = nextEnergy / plant.maxEnergy;

      return {
        ...plant,
        age: nextAge,
        energy: nextEnergy,
        growthStage,
        reproductionCooldown: nextCooldown,
        alive: !isTooOld,
      };
    } else {
      // For mobile organisms, just age and decrement cooldown
      return {
        ...organism,
        age: nextAge,
        reproductionCooldown: nextCooldown,
        alive: !isTooOld,
      };
    }
  });
};
