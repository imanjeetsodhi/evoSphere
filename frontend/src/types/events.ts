export type EventType =
  | 'BIRTH'
  | 'DEATH'
  | 'FEEDING'
  | 'PREDATION'
  | 'STARVATION'
  | 'PLANT_GROWTH'
  | 'SYSTEM';

export interface SimulationEvent {
  id: string;
  type: EventType;
  timestamp: number; // simulation ticks/time
  day: number;
  message: string;
  organismId?: string;
  species?: 'plant' | 'rabbit' | 'fox';
}
