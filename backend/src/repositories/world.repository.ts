import { World } from '../types/index.js';

export interface IWorldRepository {
  findAll(): Promise<World[]>;
  findById(id: string): Promise<World | null>;
  create(world: World): Promise<World>;
}
