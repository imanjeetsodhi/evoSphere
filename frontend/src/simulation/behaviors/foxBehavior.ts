import { Fox, Organism, Position3D, Rabbit } from '../../types/organism';
import { SPECIES_CONFIG } from '../../config/simulationConfig';
import {
  getDistance,
  normalizeVector,
  addVectors,
  scaleVector,
  subVectors,
} from '../utils/vector';

export const updateFoxBehavior = (
  fox: Fox,
  allOrganisms: Organism[]
): { velocity: Position3D; state: Fox['state']; targetId?: string } => {
  const config = SPECIES_CONFIG.fox;
  const position = fox.position;
  let targetVel = { ...fox.velocity };
  let state: Fox['state'] = 'wandering';
  let targetId: string | undefined = undefined;

  // 1. Hungry -> Seek Rabbits
  const isHungry = fox.energy < config.maxEnergy * 0.85;
  if (isHungry) {
    const rabbits = allOrganisms.filter(
      (o) => o.species === 'rabbit' && o.alive
    ) as Rabbit[];

    let closestRabbit: Rabbit | null = null;
    let minRabbitDist = Infinity;

    for (const rabbit of rabbits) {
      const dist = getDistance(position, rabbit.position);
      if (dist < fox.visionRange && dist < minRabbitDist) {
        minRabbitDist = dist;
        closestRabbit = rabbit;
      }
    }

    if (closestRabbit) {
      const toRabbit = subVectors(closestRabbit.position, position);
      targetVel = scaleVector(normalizeVector(toRabbit), config.movementSpeed);
      return { velocity: targetVel, state: 'hunting', targetId: closestRabbit.id };
    }
  }

  // 2. Reproduce -> Seek Mate
  const isReadyToMating =
    fox.energy >= config.reproductionThreshold &&
    fox.reproductionCooldown <= 0 &&
    fox.age > 80;

  if (isReadyToMating) {
    const potentialMates = allOrganisms.filter(
      (o) =>
        o.species === 'fox' &&
        o.alive &&
        o.id !== fox.id &&
        (o as Fox).gender !== fox.gender &&
        o.energy >= config.reproductionThreshold &&
        o.reproductionCooldown <= 0 &&
        o.age > 80
    );

    let closestMate: Organism | null = null;
    let minMateDist = Infinity;

    for (const mate of potentialMates) {
      const dist = getDistance(position, mate.position);
      if (dist < fox.visionRange && dist < minMateDist) {
        minMateDist = dist;
        closestMate = mate;
      }
    }

    if (closestMate) {
      const toMate = subVectors(closestMate.position, position);
      targetVel = scaleVector(normalizeVector(toMate), config.movementSpeed);
      return { velocity: targetVel, state: 'seeking_mate', targetId: closestMate.id };
    }
  }

  // 3. Wander
  const wanderForce = {
    x: (Math.random() - 0.5) * 0.4,
    y: 0,
    z: (Math.random() - 0.5) * 0.4,
  };
  const newVel = addVectors(fox.velocity, wanderForce);
  targetVel = scaleVector(normalizeVector(newVel), config.movementSpeed * 0.5);

  return { velocity: targetVel, state: 'wandering' };
};
