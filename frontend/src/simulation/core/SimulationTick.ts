import { World } from '../../types/world';
import { SimulationEvent } from '../../types/events';
import { updateEnvironment } from '../systems/environmentSystem';
import { updateOrganisms } from '../systems/organismSystem';
import { updateMovement } from '../systems/movementSystem';
import { updateEnergy } from '../systems/energySystem';
import { resolveFeeding } from '../systems/feedingSystem';
import { resolveReproduction } from '../systems/reproductionSystem';
import { resolveDeaths } from '../systems/deathSystem';
import { updateRabbitBehavior } from '../behaviors/rabbitBehavior';
import { updateFoxBehavior } from '../behaviors/foxBehavior';
import { Rabbit, Fox } from '../../types/organism';

export interface TickResult {
  world: World;
  events: SimulationEvent[];
  statsChange: {
    births: number;
    deaths: number;
    predations: number;
    starvations: number;
  };
}

export const runSimulationTick = (world: World): TickResult => {
  const currentTick = world.simulation.currentTick + 1;
  const day = world.environment.day;

  // 1. Update AI behaviors (adjust velocities and states)
  const behaviorOrganisms = world.organisms.map((org) => {
    if (!org.alive) return org;
    if (org.species === 'rabbit') {
      const { velocity, state, targetId } = updateRabbitBehavior(
        org as Rabbit,
        world.organisms
      );
      return { ...org, velocity, state, targetId } as Rabbit;
    } else if (org.species === 'fox') {
      const { velocity, state, targetId } = updateFoxBehavior(
        org as Fox,
        world.organisms
      );
      return { ...org, velocity, state, targetId } as Fox;
    }
    return org;
  });

  // 2. Resolve movements
  const movedOrganisms = updateMovement(behaviorOrganisms);

  // 3. Update environment (sunlight, temperature, time)
  const nextEnv = updateEnvironment(world.environment);

  // 4. Update organisms (aging, plant growth from environment)
  const agedOrganisms = updateOrganisms(movedOrganisms, nextEnv);

  // 5. Apply metabolic energy decay
  const energyDecayedOrganisms = updateEnergy(agedOrganisms);

  // 6. Resolve feeding interactions (eating collisions)
  const feedingResult = resolveFeeding(energyDecayedOrganisms, day, currentTick);

  // 7. Resolve reproduction
  const reproductionResult = resolveReproduction(
    feedingResult.organisms,
    day,
    currentTick
  );

  // 8. Resolve deaths (sweeps starvation and old age)
  const deathResult = resolveDeaths(
    reproductionResult.organisms,
    day,
    currentTick
  );

  // Compile events
  const allTickEvents: SimulationEvent[] = [
    ...feedingResult.events,
    ...reproductionResult.events,
    ...deathResult.events,
  ];

  // Increment total stats changes
  const statsChange = {
    births: reproductionResult.birthsCount,
    deaths: deathResult.deathsCount + deathResult.starvationsCount + feedingResult.predationsCount,
    predations: feedingResult.predationsCount,
    starvations: deathResult.starvationsCount,
  };

  const updatedWorld: World = {
    ...world,
    environment: nextEnv,
    organisms: deathResult.organisms,
    simulation: {
      ...world.simulation,
      currentTick,
    },
  };

  return {
    world: updatedWorld,
    events: allTickEvents,
    statsChange,
  };
};
