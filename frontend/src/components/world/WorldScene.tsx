'use client';

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSimulationStore, CameraMode, BiomeType } from '../../store/simulationStore';
import { Terrain } from './Terrain';
import { OrganismRenderer } from './OrganismRenderer';
import { Atmosphere } from './Atmosphere';
import { WeatherParticles } from './WeatherParticles';
import { CinematicCamera } from './CinematicCamera';
import { WORLD_CONFIG } from '../../config/simulationConfig';
import { Camera, Eye, Map, Box, Download, SunMedium } from 'lucide-react';
import { soundEngine } from '../../lib/soundEngine';

export const WorldScene: React.FC = () => {
  const world = useSimulationStore((state) => state.world);
  const weather = useSimulationStore((state) => state.weather);
  const biome = useSimulationStore((state) => state.biome);
  const setBiome = useSimulationStore((state) => state.setBiome);
  const cameraMode = useSimulationStore((state) => state.cameraMode);
  const setCameraMode = useSimulationStore((state) => state.setCameraMode);
  const selectedOrganismId = useSimulationStore((state) => state.selectedOrganismId);

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const environment = world?.environment || {
    sunlight: 80,
    timeOfDay: 12,
    temperature: 24,
    waterLevel: 70,
    day: 1,
  };

  const organisms = world?.organisms || [];
  const isNight = environment.timeOfDay < 6.0 || environment.timeOfDay > 18.0;

  // 4K Canvas Snapshot Downloader
  const handleCaptureSnapshot = () => {
    soundEngine.playClick(1000);
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `evosphere-snapshot-day${environment.day}-tick${world?.simulation.currentTick || 0}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const cameraOptions: { id: CameraMode; label: string; icon: React.ReactNode }[] = [
    { id: 'orbit', label: 'Free Orbit', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'follow', label: 'Follow Cam', icon: <Camera className="w-3.5 h-3.5" /> },
    { id: 'topDown', label: 'Top-Down', icon: <Map className="w-3.5 h-3.5" /> },
    { id: 'isometric', label: 'Isometric', icon: <Box className="w-3.5 h-3.5" /> },
  ];

  const biomes: { id: BiomeType; label: string; emoji: string }[] = [
    { id: 'genesis', label: 'Genesis', emoji: '🌿' },
    { id: 'desert', label: 'Oasis', emoji: '🏜️' },
    { id: 'rainforest', label: 'Jungle', emoji: '🌴' },
    { id: 'taiga', label: 'Taiga', emoji: '🏔️' },
  ];

  return (
    <div
      ref={canvasContainerRef}
      className="w-full h-full min-h-[580px] bg-[#020617] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative select-none"
    >
      {/* Top Floating Telemetry & Viewport Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Day & Solar Ticker */}
        <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 pointer-events-auto shadow-lg">
          <SunMedium className="w-4 h-4 text-amber-400" />
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-white font-bold">
              {Math.floor(environment.timeOfDay).toString().padStart(2, '0')}:
              {Math.round((environment.timeOfDay % 1) * 60).toString().padStart(2, '0')}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Day {environment.day}</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-bold">{organisms.length} Entities</span>
          </div>
        </div>

        {/* Right: Camera Mode Suite, Biomes & Snapshot */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Biome Quick Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-950/80 backdrop-blur-xl p-1 rounded-xl border border-white/10">
            {biomes.map((b) => (
              <button
                key={b.id}
                onClick={() => setBiome(b.id)}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                  biome === b.id
                    ? 'bg-emerald-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={`Switch Biome to ${b.label}`}
              >
                <span>{b.emoji}</span>
              </button>
            ))}
          </div>

          {/* Camera Mode Toolbar */}
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-lg">
            {cameraOptions.map((opt) => {
              const isActive = cameraMode === opt.id;
              const isDisabled = opt.id === 'follow' && !selectedOrganismId;
              return (
                <button
                  key={opt.id}
                  onClick={() => setCameraMode(opt.id)}
                  disabled={isDisabled}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                      : isDisabled
                      ? 'opacity-40 cursor-not-allowed text-slate-600'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={isDisabled ? 'Select an organism first to follow' : opt.label}
                >
                  {opt.icon}
                  <span className="hidden md:inline">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* 4K Screenshot Capture */}
          <button
            onClick={handleCaptureSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-xl border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800/80 shadow-lg transition"
            title="Export High-Res Canvas Snapshot"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Snapshot</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{
          position: [WORLD_CONFIG.width / 2, 45, WORLD_CONFIG.depth * 1.15],
          fov: 42,
        }}
      >
        {/* Celestial Atmosphere & Dynamic Lighting */}
        <Atmosphere timeOfDay={environment.timeOfDay} sunlight={environment.sunlight} />

        {/* Dynamic Weather Particle Simulation */}
        <WeatherParticles weather={weather} isNight={isNight} />

        {/* Biome Terrain & Interactive God-Mode Spawner */}
        <Terrain />

        {/* Dynamic Simulated Organisms */}
        {organisms.map((organism) => (
          <OrganismRenderer key={organism.id} organism={organism} />
        ))}

        {/* Smart Camera Controller (Orbit, Follow Cam, Satellite, Iso) */}
        <CinematicCamera />
      </Canvas>
    </div>
  );
};
