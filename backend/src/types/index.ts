export type SpeciesType = 'plant' | 'rabbit' | 'fox';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface BaseOrganism {
  id: string;
  species: SpeciesType;
  position: Position3D;
  velocity: Position3D;
  energy: number;
  maxEnergy: number;
  health: number;
  age: number;
  maxAge: number;
  alive: boolean;
  reproductionCooldown: number;
  generation: number;
}

export interface Plant extends BaseOrganism {
  species: 'plant';
  growthStage: number;
  growthRate: number;
}

export interface Rabbit extends BaseOrganism {
  species: 'rabbit';
  gender: 'male' | 'female';
  visionRange: number;
  speed: number;
  targetId?: string;
  state: 'wandering' | 'hunting' | 'fleeing' | 'seeking_mate';
}

export interface Fox extends BaseOrganism {
  species: 'fox';
  gender: 'male' | 'female';
  visionRange: number;
  speed: number;
  targetId?: string;
  state: 'wandering' | 'hunting' | 'seeking_mate';
}

export type Organism = Plant | Rabbit | Fox;

export interface Environment {
  temperature: number;
  sunlight: number;
  waterLevel: number;
  timeOfDay: number;
  day: number;
}

export interface SimulationState {
  isRunning: boolean;
  speed: number;
  currentTick: number;
}

export interface World {
  id: string;
  name: string;
  dimensions: {
    width: number;
    depth: number;
  };
  environment: Environment;
  organisms: Organism[];
  simulation: SimulationState;
  createdAt: string;
}
