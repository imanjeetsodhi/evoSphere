import { Environment } from './environment';
import { Organism } from './organism';
import { SimulationState } from './simulation';

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
export interface PopulationHistoryEntry {
  tick: number;
  day: number;
  plants: number;
  rabbits: number;
  foxes: number;
}
