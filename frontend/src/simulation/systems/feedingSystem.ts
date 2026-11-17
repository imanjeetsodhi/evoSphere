import { Organism, Rabbit, Fox } from '../../types/organism';
import { SimulationEvent } from '../../types/events';
import { SPECIES_CONFIG } from '../../config/simulationConfig';
import { getDistanceSq } from '../utils/vector';

export const resolveFeeding = (
  organisms: Organism[],
  day: number,
  tick: number
): {
  organisms: Organism[];
  events: SimulationEvent[];
  predationsCount: number;
  feedingsCount: number;
} => {
  const rabbitConfig = SPECIES_CONFIG.rabbit;
  const foxConfig = SPECIES_CONFIG.fox;

  const events: SimulationEvent[] = [];
  let predationsCount = 0;
  let feedingsCount = 0;

  // Clone organisms to modify safely
  const updatedOrganisms = [...organisms];

  // 1. Foxes feeding on Rabbits
  const foxes = updatedOrganisms.filter((o) => o.species === 'fox' && o.alive) as Fox[];
  const rabbits = updatedOrganisms.filter((o) => o.species === 'rabbit' && o.alive) as Rabbit[];

  for (const fox of foxes) {
    // Find closest rabbit
    let closestRabbit: Rabbit | null = null;
    let minD2 = Infinity;

    for (const rabbit of rabbits) {
      if (!rabbit.alive) continue;
      const d2 = getDistanceSq(fox.position, rabbit.position);
      if (d2 < minD2) {
        minD2 = d2;
        closestRabbit = rabbit;
      }
    }

    // Check if within eating range
    if (closestRabbit && minD2 <= foxConfig.eatingRange * foxConfig.eatingRange) {
      // Consume rabbit
      const preyIndex = updatedOrganisms.findIndex((o) => o.id === closestRabbit!.id);
      if (preyIndex !== -1 && updatedOrganisms[preyIndex].alive) {
        updatedOrganisms[preyIndex] = {
          ...updatedOrganisms[preyIndex],
          alive: false,
        };
        
        // Find fox in updated list to modify energy
        const predatorIndex = updatedOrganisms.findIndex((o) => o.id === fox.id);
        if (predatorIndex !== -1) {
          const currentEnergy = updatedOrganisms[predatorIndex].energy;
          updatedOrganisms[predatorIndex] = {
            ...updatedOrganisms[predatorIndex],
            energy: Math.min(foxConfig.maxEnergy, currentEnergy + foxConfig.energyFromEatingRabbit),
          };
        }

        predationsCount++;
        events.push({
          id: `predation_${tick}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'PREDATION',
          timestamp: tick,
          day,
          message: `Fox ate Rabbit (${closestRabbit.gender === 'male' ? '♂' : '♀'})`,
          organismId: fox.id,
          species: 'fox',
        });
      }
    }
  }

  // Refresh rabbits list for rabbit feeding
  const activeRabbits = updatedOrganisms.filter((o) => o.species === 'rabbit' && o.alive) as Rabbit[];
  const plants = updatedOrganisms.filter((o) => o.species === 'plant' && o.alive);

  for (const rabbit of activeRabbits) {
    // Find closest plant
    let closestPlant: Organism | null = null;
    let minD2 = Infinity;

    for (const plant of plants) {
      if (!plant.alive) continue;
      const d2 = getDistanceSq(rabbit.position, plant.position);
      if (d2 < minD2) {
        minD2 = d2;
        closestPlant = plant;
      }
    }

    if (closestPlant && minD2 <= rabbitConfig.eatingRange * rabbitConfig.eatingRange) {
      // Consume plant
      const plantIndex = updatedOrganisms.findIndex((o) => o.id === closestPlant!.id);
      if (plantIndex !== -1 && updatedOrganisms[plantIndex].alive) {
        updatedOrganisms[plantIndex] = {
          ...updatedOrganisms[plantIndex],
          alive: false,
        };

        // Update rabbit energy
        const eaterIndex = updatedOrganisms.findIndex((o) => o.id === rabbit.id);
        if (eaterIndex !== -1) {
          const currentEnergy = updatedOrganisms[eaterIndex].energy;
          updatedOrganisms[eaterIndex] = {
            ...updatedOrganisms[eaterIndex],
            energy: Math.min(rabbitConfig.maxEnergy, currentEnergy + rabbitConfig.energyFromEatingPlant),
          };
        }

        feedingsCount++;
        events.push({
          id: `feeding_${tick}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'FEEDING',
          timestamp: tick,
          day,
          message: `Rabbit ate a plant`,
          organismId: rabbit.id,
          species: 'rabbit',
        });
      }
    }
  }

  return {
    organisms: updatedOrganisms,
    events,
    predationsCount,
    feedingsCount,
  };
};
