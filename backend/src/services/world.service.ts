import { IWorldRepository } from '../repositories/world.repository.js';
import { World } from '../types/index.js';

export class WorldService {
  private repository: IWorldRepository;

  constructor(repository: IWorldRepository) {
    this.repository = repository;
  }

  async getAllWorlds(): Promise<World[]> {
    return this.repository.findAll();
  }

  async getWorldById(id: string): Promise<World | null> {
    return this.repository.findById(id);
  }

  async createWorld(worldData: World): Promise<World> {
    return this.repository.create(worldData);
  }
}
