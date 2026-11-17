'use client';

import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Rabbit, Fox, Plant } from '../../types/organism';
import { Camera, X, Zap, Heart, Clock, Compass, Activity, Crosshair } from 'lucide-react';

export const OrganismInspector: React.FC = () => {
  const {
    world,
    selectedOrganismId,
    selectOrganism,
    cameraMode,
    setCameraMode,
  } = useSimulationStore();

  if (!selectedOrganismId || !world) return null;

  const organism = world.organisms.find((o) => o.id === selectedOrganismId && o.alive);

  if (!organism) return null;

  const isPlant = organism.species === 'plant';
  const isRabbit = organism.species === 'rabbit';
  const isFox = organism.species === 'fox';

  const scientificName = isPlant
    ? 'Trifolium pratense (Flora)'
    : isRabbit
    ? 'Oryctolagus cuniculus (Herbivore)'
    : 'Vulpes vulpes (Apex Carnivore)';

  const energyPercent = Math.min(100, Math.round((organism.energy / organism.maxEnergy) * 100));
  const agePercent = Math.min(100, Math.round((organism.age / organism.maxAge) * 100));

  // Determine state label
  const stateLabel = isPlant
    ? 'Photosynthesizing'
    : (organism as Rabbit | Fox).state.toUpperCase();

  const isFollowing = cameraMode === 'follow';

  return (
    <div className="bg-slate-950/85 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-4.5 text-slate-100 shadow-2xl shadow-cyan-950/30 flex flex-col gap-3.5 transition-all animate-in fade-in slide-in-from-top-4 duration-300">
      {/* HUD Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/40 flex items-center justify-center text-2xl shadow-inner">
            {isPlant ? '🌱' : isRabbit ? '🐇' : '🦊'}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                {organism.species} #{organism.id.slice(-4)}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950/60 text-cyan-400 border border-cyan-800/50">
                GEN {organism.generation}
              </span>
              {!isPlant && (
                <span className="text-xs font-mono text-slate-400">
                  {(organism as Rabbit | Fox).gender === 'male' ? '♂ Male' : '♀ Female'}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-400 italic">
              {scientificName}
            </span>
          </div>
        </div>

        <button
          onClick={() => selectOrganism(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Behavioral State Badge */}
      <div className="flex items-center justify-between bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-400">Intent State:</span>
        </div>
        <span
          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
            stateLabel === 'HUNTING'
              ? 'bg-rose-950/60 text-rose-300 border-rose-800'
              : stateLabel === 'FLEEING'
              ? 'bg-amber-950/60 text-amber-300 border-amber-800'
              : stateLabel === 'SEEKING_MATE'
              ? 'bg-pink-950/60 text-pink-300 border-pink-800'
              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
          }`}
        >
          {stateLabel}
        </span>
      </div>

      {/* Real-time Bio Gauges */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Metabolic Energy Core */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-xl flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Zap className="w-3 h-3" />
              <span>Energy Core</span>
            </div>
            <span className="font-bold text-white">{energyPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${energyPercent}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-slate-500">
            {organism.energy.toFixed(1)} / {organism.maxEnergy} units
          </span>
        </div>

        {/* Biological Lifespan */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-xl flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-sky-400">
              <Clock className="w-3 h-3" />
              <span>Age Horizon</span>
            </div>
            <span className="font-bold text-white">{agePercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${agePercent}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-slate-500">
            {organism.age} / {organism.maxAge} ticks
          </span>
        </div>
      </div>

      {/* Spatial Coordinates & Health */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/30 px-3 py-1.5 rounded-lg border border-slate-850">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>Pos: ({organism.position.x.toFixed(1)}, {organism.position.z.toFixed(1)})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-rose-400" />
          <span>Health: {organism.health}%</span>
        </div>
      </div>

      {/* Interactive Follow-Cam Toggle */}
      <button
        onClick={() => setCameraMode(isFollowing ? 'orbit' : 'follow')}
        className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold font-mono transition-all ${
          isFollowing
            ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
            : 'bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30'
        }`}
      >
        <Camera className="w-3.5 h-3.5" />
        {isFollowing ? 'Tracking Organism in 3D (Click to Free Cam)' : 'Lock 3D Cinematic Follow Camera'}
      </button>
    </div>
  );
};
