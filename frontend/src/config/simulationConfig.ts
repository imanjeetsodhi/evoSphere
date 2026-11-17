export const WORLD_CONFIG = {
  width: 100,
  depth: 100,
};

export const SPECIES_CONFIG = {
  plant: {
    maxEnergy: 50,
    growthRate: 0.1,                // base energy gained per tick under perfect light/water
    reproductionThreshold: 45,       // can seed new plant when energy is high
    reproductionEnergyCost: 20,
    reproductionCooldown: 60,       // ticks between seeds
    maxAge: 400,
  },
  rabbit: {
    maxEnergy: 100,
    startEnergy: 60,
    movementSpeed: 1.2,
    visionRange: 15,
    reproductionThreshold: 75,
    reproductionEnergyCost: 40,
    reproductionCooldown: 100,
    energyLossPerTick: 0.25,
    maxAge: 600,
    eatingRange: 2.0,
    energyFromEatingPlant: 40,
  },
  fox: {
    maxEnergy: 150,
    startEnergy: 90,
    movementSpeed: 1.8,
    visionRange: 25,
    reproductionThreshold: 110,
    reproductionEnergyCost: 60,
    reproductionCooldown: 150,
    energyLossPerTick: 0.35,
    maxAge: 1000,
    eatingRange: 2.2,
    energyFromEatingRabbit: 80,
  },
};

export const SIMULATION_SPEEDS = [0.5, 1, 2, 5];

export const ENVIRONMENT_CONFIG = {
  timeScale: 0.05,                   // How much timeOfDay advances per tick (0.05 hr = 3 minutes)
  temperatureRange: { min: 10, max: 35 },
  baseSunlight: 80,
  baseWater: 70,
};
