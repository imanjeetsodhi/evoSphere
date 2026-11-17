import { World } from '../../types/world';
import { runSimulationTick, TickResult } from './SimulationTick';

export class SimulationEngine {
  /**
   * Performs a single step/tick of the ecosystem simulation.
   * Modifies environment variables, organism counts, dynamics, and generates log events.
   */
  static tick(world: World): TickResult {
    return runSimulationTick(world);
  }
}
