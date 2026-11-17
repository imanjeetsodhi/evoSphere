import { Rabbit, Organism, Position3D } from '../../types/organism';
import { SPECIES_CONFIG, WORLD_CONFIG } from '../../config/simulationConfig';
import {
  getDistance,
  normalizeVector,
  addVectors,
  scaleVector,
  subVectors,
} from '../utils/vector';

export const updateRabbitBehavior = (
  rabbit: Rabbit,
  allOrganisms: Organism[]
): { velocity: Position3D; state: Rabbit['state']; targetId?: string } => {
  const config = SPECIES_CONFIG.rabbit;
  const position = rabbit.position;
  let targetVel = { ...rabbit.velocity };
  let state: Rabbit['state'] = 'wandering';
  let targetId: string | undefined = undefined;

  // 1. Flee from Foxes
  const foxes = allOrganisms.filter(
    (o) => o.species === 'fox' && o.alive
  );
  let closestFox: Organism | null = null;
  let minFoxDist = Infinity;

  for (const fox of foxes) {
    const dist = getDistance(position, fox.position);
    if (dist < rabbit.visionRange && dist < minFoxDist) {
      minFoxDist = dist;
      closestFox = fox;
    }
  }

  if (closestFox) {
    // Flee! Run in the opposite direction of the fox
    const fleeDirection = subVectors(position, closestFox.position);
    targetVel = scaleVector(normalizeVector(fleeDirection), config.movementSpeed);
    return { velocity: targetVel, state: 'fleeing', targetId: closestFox.id };
  }

  // 2. Hungry -> Seek Plants
  const isHungry = rabbit.energy < config.maxEnergy * 0.75;
  if (isHungry) {
    const plants = allOrganisms.filter(
      (o) => o.species === 'plant' && o.alive
    );
    let closestPlant: Organism | null = null;
    let minPlantDist = Infinity;

    for (const plant of plants) {
      const dist = getDistance(position, plant.position);
      if (dist < rabbit.visionRange && dist < minPlantDist) {
        minPlantDist = dist;
        closestPlant = plant;
      }
    }

    if (closestPlant) {
      const toPlant = subVectors(closestPlant.position, position);
      targetVel = scaleVector(normalizeVector(toPlant), config.movementSpeed);
      return { velocity: targetVel, state: 'hunting', targetId: closestPlant.id };
    }
  }

  // 3. Reproduce -> Seek Mate
  const isReadyToMating =
    rabbit.energy >= config.reproductionThreshold &&
    rabbit.reproductionCooldown <= 0 &&
    rabbit.age > 50; // mature age

  if (isReadyToMating) {
    const potentialMates = allOrganisms.filter(
      (o) =>
        o.species === 'rabbit' &&
        o.alive &&
        o.id !== rabbit.id &&
        (o as Rabbit).gender !== rabbit.gender &&
        o.energy >= config.reproductionThreshold &&
        o.reproductionCooldown <= 0 &&
        o.age > 50
    );

    let closestMate: Organism | null = null;
    let minMateDist = Infinity;

    for (const mate of potentialMates) {
      const dist = getDistance(position, mate.position);
      if (dist < rabbit.visionRange && dist < minMateDist) {
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

  // 4. Wander
  // Introduce a slight random steering force to keep movement interesting
  const wanderForce = {
    x: (Math.random() - 0.5) * 0.5,
    y: 0,
    z: (Math.random() - 0.5) * 0.5,
  };
  const newVel = addVectors(rabbit.velocity, wanderForce);
  targetVel = scaleVector(normalizeVector(newVel), config.movementSpeed * 0.6); // wander slower

  return { velocity: targetVel, state: 'wandering' };
};
