import { create } from 'zustand';
import { World, PopulationHistoryEntry } from '../types/world';
import { SimulationEvent } from '../types/events';
import { SimulationStats } from '../types/simulation';
import { Organism, Position3D, SpeciesType } from '../types/organism';
import { createInitialWorld } from '../simulation/data/initialWorld';
import { SimulationEngine } from '../simulation/core/SimulationEngine';
import { SimulationClock } from '../simulation/core/SimulationClock';
import { createPlant, createRabbit, createFox } from '../simulation/factory/organismFactory';
import { soundEngine } from '../lib/soundEngine';

export type CameraMode = 'orbit' | 'follow' | 'topDown' | 'isometric';
export type SpawnTool = 'none' | 'plant' | 'rabbit' | 'fox';
export type WeatherType = 'clear' | 'monsoon' | 'drought' | 'superbloom';
export type BiomeType = 'genesis' | 'desert' | 'rainforest' | 'taiga';

interface SimulationStore {
  world: World | null;
  isRunning: boolean;
  speed: number;
  currentTick: number;
  events: SimulationEvent[];
  statistics: SimulationStats;
  populationHistory: PopulationHistoryEntry[];

  // Luxury Interactive Features
  selectedOrganismId: string | null;
  cameraMode: CameraMode;
  spawnTool: SpawnTool;
  weather: WeatherType;
  biome: BiomeType;
  soundMuted: boolean;
  ambienceActive: boolean;

  // Actions
  initWorld: (seed?: number) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  setSpeed: (speed: number) => void;
  advanceSimulation: () => void;
  updateEnvironmentParams: (params: {
    temperature?: number;
    sunlight?: number;
    waterLevel?: number;
  }) => void;

  // Organism & Viewport Interactions
  selectOrganism: (id: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  setSpawnTool: (tool: SpawnTool) => void;
  spawnOrganismAt: (species: SpeciesType, position: Position3D) => void;
  triggerCataclysm: (type: 'monsoon' | 'drought' | 'superbloom' | 'surge') => void;
  setBiome: (biome: BiomeType) => void;

  // Audio Controls
  toggleSound: () => void;
  toggleAmbience: () => void;

  // Persistence & Data Studio
  exportWorldJSON: () => string;
  importWorldJSON: (jsonString: string) => boolean;
}

let clock: SimulationClock | null = null;

export const useSimulationStore = create<SimulationStore>((set, get) => {
  const handleTick = () => {
    get().advanceSimulation();
  };

  const getClock = () => {
    if (!clock) {
      clock = new SimulationClock(handleTick);
    }
    return clock;
  };

  const getCounts = (world: World) => {
    const plants = world.organisms.filter((o) => o.species === 'plant' && o.alive).length;
    const rabbits = world.organisms.filter((o) => o.species === 'rabbit' && o.alive).length;
    const foxes = world.organisms.filter((o) => o.species === 'fox' && o.alive).length;
    return { plants, rabbits, foxes };
  };

  return {
    world: null,
    isRunning: false,
    speed: 1.0,
    currentTick: 0,
    events: [],
    statistics: {
      totalOrganisms: 0,
      plantCount: 0,
      rabbitCount: 0,
      foxCount: 0,
      births: 0,
      deaths: 0,
      predations: 0,
      starvations: 0,
    },
    populationHistory: [],

    selectedOrganismId: null,
    cameraMode: 'orbit',
    spawnTool: 'none',
    weather: 'clear',
    biome: 'genesis',
    soundMuted: false,
    ambienceActive: false,

    initWorld: (seed = Date.now()) => {
      const initialWorld = createInitialWorld(seed);
      const counts = getCounts(initialWorld);

      const stats: SimulationStats = {
        totalOrganisms: initialWorld.organisms.length,
        plantCount: counts.plants,
        rabbitCount: counts.rabbits,
        foxCount: counts.foxes,
        births: 0,
        deaths: 0,
        predations: 0,
        starvations: 0,
      };

      const initialHistory: PopulationHistoryEntry = {
        tick: 0,
        day: initialWorld.environment.day,
        plants: counts.plants,
        rabbits: counts.rabbits,
        foxes: counts.foxes,
      };

      set({
        world: initialWorld,
        isRunning: false,
        currentTick: 0,
        selectedOrganismId: null,
        weather: 'clear',
        events: [
          {
            id: 'init',
            type: 'SYSTEM',
            timestamp: 0,
            day: initialWorld.environment.day,
            message: 'Ecosystem simulation initialized in Genesis Valley.',
          },
        ],
        statistics: stats,
        populationHistory: [initialHistory],
      });
    },

    startSimulation: () => {
      const { world, speed } = get();
      if (!world) return;

      soundEngine.playClick(900);
      getClock().start(speed);
      set({ isRunning: true });
    },

    pauseSimulation: () => {
      soundEngine.playClick(650);
      getClock().stop();
      set({ isRunning: false });
    },

    resetSimulation: () => {
      soundEngine.playClick(500);
      getClock().stop();
      get().initWorld();
    },

    setSpeed: (speed: number) => {
      soundEngine.playClick(750 + speed * 50);
      set({ speed });
      getClock().setSpeed(speed);
    },

    advanceSimulation: () => {
      const { world, events, statistics, populationHistory, selectedOrganismId } = get();
      if (!world) return;

      const { world: nextWorld, events: newEvents, statsChange } = SimulationEngine.tick(world);
      const counts = getCounts(nextWorld);

      // Verify if selected organism died or was eaten
      let updatedSelectedId = selectedOrganismId;
      if (selectedOrganismId) {
        const selectedStillAlive = nextWorld.organisms.some(
          (o) => o.id === selectedOrganismId && o.alive
        );
        if (!selectedStillAlive) {
          updatedSelectedId = null;
        }
      }

      const updatedEvents = [...newEvents.reverse(), ...events].slice(0, 75);

      const nextStats: SimulationStats = {
        totalOrganisms: nextWorld.organisms.length,
        plantCount: counts.plants,
        rabbitCount: counts.rabbits,
        foxCount: counts.foxes,
        births: statistics.births + statsChange.births,
        deaths: statistics.deaths + statsChange.deaths,
        predations: statistics.predations + statsChange.predations,
        starvations: statistics.starvations + statsChange.starvations,
      };

      let updatedHistory = [...populationHistory];
      if (nextWorld.simulation.currentTick % 2 === 0) {
        updatedHistory.push({
          tick: nextWorld.simulation.currentTick,
          day: nextWorld.environment.day,
          plants: counts.plants,
          rabbits: counts.rabbits,
          foxes: counts.foxes,
        });
        updatedHistory = updatedHistory.slice(-180);
      }

      set({
        world: nextWorld,
        currentTick: nextWorld.simulation.currentTick,
        selectedOrganismId: updatedSelectedId,
        events: updatedEvents,
        statistics: nextStats,
        populationHistory: updatedHistory,
      });
    },

    updateEnvironmentParams: (params) => {
      const { world } = get();
      if (!world) return;

      soundEngine.playClick(850);
      const nextWorld = {
        ...world,
        environment: {
          ...world.environment,
          ...params,
        },
      };

      set({ world: nextWorld });
    },

    selectOrganism: (id: string | null) => {
      if (id) {
        soundEngine.playOrganismSelect();
      }
      set({ selectedOrganismId: id });
    },

    setCameraMode: (mode: CameraMode) => {
      soundEngine.playClick(700);
      set({ cameraMode: mode });
    },

    setSpawnTool: (tool: SpawnTool) => {
      soundEngine.playClick(600);
      set({ spawnTool: tool });
    },

    spawnOrganismAt: (species: SpeciesType, position: Position3D) => {
      const { world, statistics, events } = get();
      if (!world) return;

      soundEngine.playClick(1100);

      let newOrg: Organism;
      if (species === 'plant') {
        newOrg = createPlant(position);
      } else if (species === 'rabbit') {
        newOrg = createRabbit(position);
      } else {
        newOrg = createFox(position);
      }

      const updatedOrganisms = [...world.organisms, newOrg];
      const counts = getCounts({ ...world, organisms: updatedOrganisms });

      const newEvent: SimulationEvent = {
        id: `manual_spawn_${Date.now()}`,
        type: 'SYSTEM',
        timestamp: world.simulation.currentTick,
        day: world.environment.day,
        message: `Architect manually spawned a ${species} into the biosphere.`,
        organismId: newOrg.id,
        species,
      };

      set({
        world: {
          ...world,
          organisms: updatedOrganisms,
        },
        statistics: {
          ...statistics,
          totalOrganisms: updatedOrganisms.length,
          plantCount: counts.plants,
          rabbitCount: counts.rabbits,
          foxCount: counts.foxes,
        },
        events: [newEvent, ...events].slice(0, 75),
        selectedOrganismId: newOrg.id,
      });
    },

    triggerCataclysm: (type) => {
      const { world, events } = get();
      if (!world) return;

      soundEngine.playCataclysmSound(type);

      let nextEnv = { ...world.environment };
      let updatedOrganisms = [...world.organisms];
      let eventMsg = '';

      if (type === 'monsoon') {
        nextEnv.waterLevel = 98;
        nextEnv.sunlight = 40;
        nextEnv.temperature = 19;
        eventMsg = '🌧️ Torrential Monsoon unleashed: Water saturation peaked to 98%.';
      } else if (type === 'drought') {
        nextEnv.waterLevel = 12;
        nextEnv.sunlight = 99;
        nextEnv.temperature = 39;
        eventMsg = '☀️ Severe Drought struck: Water supplies dried to 12%, heat soared to 39°C.';
      } else if (type === 'superbloom') {
        nextEnv.waterLevel = 85;
        nextEnv.sunlight = 90;
        // Seed 12 nutritious plants instantly
        for (let i = 0; i < 12; i++) {
          const x = 10 + Math.random() * (world.dimensions.width - 20);
          const z = 10 + Math.random() * (world.dimensions.depth - 20);
          updatedOrganisms.push(createPlant({ x, y: 0, z }, 2));
        }
        eventMsg = '🌸 Botanical Superbloom: 12 nutrient-dense flora clusters emerged!';
      } else if (type === 'surge') {
        // Spawn 2 hungry foxes
        for (let i = 0; i < 2; i++) {
          const x = 20 + Math.random() * (world.dimensions.width - 40);
          const z = 20 + Math.random() * (world.dimensions.depth - 40);
          updatedOrganisms.push(createFox({ x, y: 0, z }));
        }
        eventMsg = '⚡ Apex Predator Surge: An invasive pack of foxes entered the territory.';
      }

      const cataclysmEvent: SimulationEvent = {
        id: `cataclysm_${Date.now()}`,
        type: 'SYSTEM',
        timestamp: world.simulation.currentTick,
        day: world.environment.day,
        message: eventMsg,
      };

      set({
        world: {
          ...world,
          environment: nextEnv,
          organisms: updatedOrganisms,
        },
        weather: type === 'surge' ? 'clear' : type,
        events: [cataclysmEvent, ...events].slice(0, 75),
      });
    },

    setBiome: (biome: BiomeType) => {
      soundEngine.playClick(600);
      set({ biome });
    },

    toggleSound: () => {
      const nextMuted = !get().soundMuted;
      soundEngine.setMuted(nextMuted);
      set({ soundMuted: nextMuted });
    },

    toggleAmbience: () => {
      const isNowPlaying = soundEngine.toggleAmbience();
      set({ ambienceActive: isNowPlaying });
    },

    exportWorldJSON: () => {
      const { world, statistics, populationHistory } = get();
      return JSON.stringify(
        {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          world,
          statistics,
          populationHistory,
        },
        null,
        2
      );
    },

    importWorldJSON: (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.world && parsed.world.dimensions && parsed.world.environment) {
          get().pauseSimulation();
          set({
            world: parsed.world,
            statistics: parsed.statistics || get().statistics,
            populationHistory: parsed.populationHistory || [],
            currentTick: parsed.world.simulation.currentTick || 0,
            selectedOrganismId: null,
          });
          soundEngine.playOrganismSelect();
          return true;
        }
      } catch {
        // Invalid json
      }
      return false;
    },
  };
});
