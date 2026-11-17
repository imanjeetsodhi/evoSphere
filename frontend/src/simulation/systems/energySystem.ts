import { Organism } from '../../types/organism';
import { SPECIES_CONFIG } from '../../config/simulationConfig';

export const updateEnergy = (organisms: Organism[]): Organism[] => {
  const rabbitConfig = SPECIES_CONFIG.rabbit;
  const foxConfig = SPECIES_CONFIG.fox;

  return organisms.map((organism) => {
    if (!organism.alive || organism.species === 'plant') {
      return organism;
    }

    let energyLoss = 0;
    if (organism.species === 'rabbit') {
      energyLoss = rabbitConfig.energyLossPerTick;
    } else if (organism.species === 'fox') {
      energyLoss = foxConfig.energyLossPerTick;
    }

    const nextEnergy = Math.max(0, organism.energy - energyLoss);
    const isStarved = nextEnergy <= 0;

    return {
      ...organism,
      energy: nextEnergy,
      alive: !isStarved,
    };
  });
};
