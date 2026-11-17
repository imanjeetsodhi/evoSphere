export interface Environment {
  temperature: number; // in °C
  sunlight: number;    // 0 to 100%
  waterLevel: number;  // 0 to 100%
  timeOfDay: number;   // 0.0 to 24.0 representing hours
  day: number;
}
