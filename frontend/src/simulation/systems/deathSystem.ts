import { Organism } from '../../types/organism';
import { SimulationEvent } from '../../types/events';

export const resolveDeaths = (
  organisms: Organism[],
  day: number,
  tick: number
): {
  organisms: Organism[];
  events: SimulationEvent[];
  deathsCount: number;
  starvationsCount: number;
} => {
  const events: SimulationEvent[] = [];
  let deathsCount = 0;
  let starvationsCount = 0;

  // Split into active and dead
  const survivingOrganisms: Organism[] = [];

  for (const organism of organisms) {
    if (!organism.alive) {
      // Already marked dead (e.g. eaten)
      continue;
    }

    const isStarved = organism.species !== 'plant' && organism.energy <= 0;
    const isOldAge = organism.age >= organism.maxAge;

    if (isStarved) {
      starvationsCount++;
      events.push({
        id: `death_starve_${tick}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'STARVATION',
        timestamp: tick,
        day,
        message: `${organism.species.charAt(0).toUpperCase() + organism.species.slice(1)} starved to death`,
        organismId: organism.id,
        species: organism.species,
      });
      // Do not add to surviving
    } else if (isOldAge) {
      deathsCount++;
      events.push({
        id: `death_age_${tick}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'DEATH',
        timestamp: tick,
        day,
        message: `${organism.species.charAt(0).toUpperCase() + organism.species.slice(1)} died of old age`,
        organismId: organism.id,
        species: organism.species,
      });
      // Do not add to surviving
    } else {
      survivingOrganisms.push(organism);
    }
  }

  return {
    organisms: survivingOrganisms,
    events,
    deathsCount,
    starvationsCount,
  };
};
