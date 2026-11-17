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
  growthStage: number; // 0 to 1
  growthRate: number;
}

export interface Rabbit extends BaseOrganism {
  species: 'rabbit';
  gender: 'male' | 'female';
  visionRange: number;
  speed: number;
  targetId?: string; // Target plant or mate or flee-destination
  state: 'wandering' | 'hunting' | 'fleeing' | 'seeking_mate';
}

export interface Fox extends BaseOrganism {
  species: 'fox';
  gender: 'male' | 'female';
  visionRange: number;
  speed: number;
  targetId?: string; // Target rabbit or mate
  state: 'wandering' | 'hunting' | 'seeking_mate';
}

export type Organism = Plant | Rabbit | Fox;
