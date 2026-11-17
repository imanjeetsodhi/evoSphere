export interface SimulationState {
  isRunning: boolean;
  speed: number;
  currentTick: number;
}

export interface SimulationStats {
  totalOrganisms: number;
  plantCount: number;
  rabbitCount: number;
  foxCount: number;
  births: number;
  deaths: number;
  predations: number;
  starvations: number;
}
