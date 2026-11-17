import { Plant, Rabbit, Fox, Position3D } from '../../types/organism';
import { SPECIES_CONFIG } from '../../config/simulationConfig';

let idCounter = 0;
export const generateId = (species: string): string => {
  idCounter++;
  return `${species}_${idCounter}_${Math.random().toString(36).substring(2, 6)}`;
};

export const createPlant = (position: Position3D, generation = 1): Plant => {
  const config = SPECIES_CONFIG.plant;
  return {
    id: generateId('plant'),
    species: 'plant',
    position,
    velocity: { x: 0, y: 0, z: 0 },
    energy: config.maxEnergy * 0.2, // Start at 20% size/energy
    maxEnergy: config.maxEnergy,
    health: 100,
    age: 0,
    maxAge: config.maxAge,
    alive: true,
    reproductionCooldown: Math.floor(Math.random() * config.reproductionCooldown),
    generation,
    growthStage: 0.2,
    growthRate: config.growthRate,
  };
};

export const createRabbit = (
  position: Position3D,
  gender: 'male' | 'female' = Math.random() > 0.5 ? 'male' : 'female',
  generation = 1
): Rabbit => {
  const config = SPECIES_CONFIG.rabbit;
  return {
    id: generateId('rabbit'),
    species: 'rabbit',
    position,
    velocity: {
      x: (Math.random() - 0.5) * config.movementSpeed,
      y: 0,
      z: (Math.random() - 0.5) * config.movementSpeed,
    },
    energy: config.startEnergy,
    maxEnergy: config.maxEnergy,
    health: 100,
    age: 0,
    maxAge: config.maxAge,
    alive: true,
    reproductionCooldown: config.reproductionCooldown,
    generation,
    gender,
    visionRange: config.visionRange,
    speed: config.movementSpeed,
    state: 'wandering',
  };
};

export const createFox = (
  position: Position3D,
  gender: 'male' | 'female' = Math.random() > 0.5 ? 'male' : 'female',
  generation = 1
): Fox => {
  const config = SPECIES_CONFIG.fox;
  return {
    id: generateId('fox'),
    species: 'fox',
    position,
    velocity: {
      x: (Math.random() - 0.5) * config.movementSpeed,
      y: 0,
      z: (Math.random() - 0.5) * config.movementSpeed,
    },
    energy: config.startEnergy,
    maxEnergy: config.maxEnergy,
    health: 100,
    age: 0,
    maxAge: config.maxAge,
    alive: true,
    reproductionCooldown: config.reproductionCooldown,
    generation,
    gender,
    visionRange: config.visionRange,
    speed: config.movementSpeed,
    state: 'wandering',
  };
};
