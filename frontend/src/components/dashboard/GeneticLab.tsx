'use client';

import React, { useState } from 'react';
import { SPECIES_CONFIG } from '../../config/simulationConfig';
import { Dna, RotateCcw, Sliders } from 'lucide-react';
import { soundEngine } from '../../lib/soundEngine';

export const GeneticLab: React.FC = () => {
  const [, setTick] = useState(0);

  const update = () => {
    soundEngine.playClick(750);
    setTick((t) => t + 1);
  };

  const resetDefaults = () => {
    soundEngine.playClick(500);
    SPECIES_CONFIG.rabbit.movementSpeed = 1.2;
    SPECIES_CONFIG.rabbit.visionRange = 15;
    SPECIES_CONFIG.rabbit.energyLossPerTick = 0.25;

    SPECIES_CONFIG.fox.movementSpeed = 1.8;
    SPECIES_CONFIG.fox.visionRange = 25;
    SPECIES_CONFIG.fox.energyLossPerTick = 0.35;

    SPECIES_CONFIG.plant.growthRate = 0.1;
    setTick((t) => t + 1);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex flex-col gap-4 text-slate-100">
      <div className="flex items-center justify-between pb-2 border-b border-slate-850">
        <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider font-mono">
            Genetics & Biome Lab
          </h3>
        </div>
        <button
          onClick={resetDefaults}
          className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Calibration
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Herbivore Genetic Traits */}
        <div className="flex flex-col gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-sky-950/40">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400">
            <span>🐇</span>
            <span>Rabbit Genetic Tuning</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Sprint Speed</span>
              <span className="text-white font-bold">{SPECIES_CONFIG.rabbit.movementSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.8"
              step="0.1"
              value={SPECIES_CONFIG.rabbit.movementSpeed}
              onChange={(e) => {
                SPECIES_CONFIG.rabbit.movementSpeed = parseFloat(e.target.value);
                update();
              }}
              className="accent-sky-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Sensory Vision</span>
              <span className="text-white font-bold">{SPECIES_CONFIG.rabbit.visionRange}m</span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              step="1"
              value={SPECIES_CONFIG.rabbit.visionRange}
              onChange={(e) => {
                SPECIES_CONFIG.rabbit.visionRange = parseInt(e.target.value);
                update();
              }}
              className="accent-sky-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Metabolic Drain</span>
              <span className="text-white font-bold">{SPECIES_CONFIG.rabbit.energyLossPerTick.toFixed(2)}/t</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={SPECIES_CONFIG.rabbit.energyLossPerTick}
              onChange={(e) => {
                SPECIES_CONFIG.rabbit.energyLossPerTick = parseFloat(e.target.value);
                update();
              }}
              className="accent-sky-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Carnivore Genetic Traits */}
        <div className="flex flex-col gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-orange-950/40">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400">
            <span>🦊</span>
            <span>Fox Apex Genetic Tuning</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Hunting Stride</span>
              <span className="text-white font-bold">{SPECIES_CONFIG.fox.movementSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.5"
              step="0.1"
              value={SPECIES_CONFIG.fox.movementSpeed}
              onChange={(e) => {
                SPECIES_CONFIG.fox.movementSpeed = parseFloat(e.target.value);
                update();
              }}
              className="accent-orange-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Detection Radius</span>
              <span className="text-white font-bold">{SPECIES_CONFIG.fox.visionRange}m</span>
            </div>
            <input
              type="range"
              min="12"
              max="45"
              step="1"
              value={SPECIES_CONFIG.fox.visionRange}
              onChange={(e) => {
                SPECIES_CONFIG.fox.visionRange = parseInt(e.target.value);
                update();
              }}
              className="accent-orange-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Caloric Burn</span>
              <span className="text-white font-bold">{SPECIES_CONFIG.fox.energyLossPerTick.toFixed(2)}/t</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.8"
              step="0.05"
              value={SPECIES_CONFIG.fox.energyLossPerTick}
              onChange={(e) => {
                SPECIES_CONFIG.fox.energyLossPerTick = parseFloat(e.target.value);
                update();
              }}
              className="accent-orange-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
