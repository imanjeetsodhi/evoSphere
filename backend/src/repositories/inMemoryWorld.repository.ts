import { IWorldRepository } from './world.repository.js';
import { World } from '../types/index.js';

export class InMemoryWorldRepository implements IWorldRepository {
  private worlds: Map<string, World> = new Map();

  constructor() {
    // Seed default Genesis Valley metadata structure
    const genesisValley: World = {
      id: 'genesis_valley',
      name: 'Genesis Valley',
      dimensions: {
        width: 100,
        depth: 100,
      },
      environment: {
        temperature: 24,
        sunlight: 80,
        waterLevel: 70,
        timeOfDay: 8.0,
        day: 1,
      },
      organisms: [], // Frontend will initialize the initial population
      simulation: {
        isRunning: false,
        speed: 1.0,
        currentTick: 0,
      },
      createdAt: new Date().toISOString(),
    };
    this.worlds.set(genesisValley.id, genesisValley);
  }

  async findAll(): Promise<World[]> {
    return Array.from(this.worlds.values());
  }

  async findById(id: string): Promise<World | null> {
    return this.worlds.get(id) || null;
  }

  async create(world: World): Promise<World> {
    this.worlds.set(world.id, world);
    return world;
  }
}
export const inMemoryWorldRepository = new InMemoryWorldRepository();
