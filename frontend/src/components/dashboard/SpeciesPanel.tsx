'use client';

import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Rabbit, Plant, Fox } from '../../types/organism';

export const SpeciesPanel: React.FC = () => {
  const world = useSimulationStore((state) => state.world);

  if (!world) return null;

  const plants = world.organisms.filter((o) => o.species === 'plant' && o.alive);
  const rabbits = world.organisms.filter((o) => o.species === 'rabbit' && o.alive) as Rabbit[];
  const foxes = world.organisms.filter((o) => o.species === 'fox' && o.alive) as Fox[];

  // Math helpers
  const getAvgEnergy = (arr: any[]) => {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, curr) => acc + curr.energy, 0);
    return Math.round(sum / arr.length);
  };

  const getAvgAge = (arr: any[]) => {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, curr) => acc + curr.age, 0);
    return Math.round(sum / arr.length);
  };

  const getGenderBreakdown = (arr: (Rabbit | Fox)[]) => {
    const males = arr.filter((x) => x.gender === 'male').length;
    const females = arr.filter((x) => x.gender === 'female').length;
    return `${males} ♂ / ${females} ♀`;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-slate-100 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-850">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Species Census
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">Live biodiversity</span>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Plant Census */}
        <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-lg border border-emerald-950/30">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌱</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-200">Flora (Plants)</span>
              <span className="text-[10px] text-slate-500 font-mono">
                Avg Age: {getAvgAge(plants)} ticks
              </span>
            </div>
          </div>
          <span className="text-xl font-extrabold text-emerald-400 font-mono">
            {plants.length}
          </span>
        </div>

        {/* Rabbit Census */}
        <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐇</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-200">Herbivores (Rabbits)</span>
              <span className="text-[10px] text-slate-500 font-mono">
                Energy: {getAvgEnergy(rabbits)}% | {getGenderBreakdown(rabbits)}
              </span>
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-300 font-mono">
            {rabbits.length}
          </span>
        </div>

        {/* Fox Census */}
        <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-lg border border-orange-950/30">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🦊</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-200">Carnivores (Foxes)</span>
              <span className="text-[10px] text-slate-500 font-mono">
                Energy: {getAvgEnergy(foxes)}% | {getGenderBreakdown(foxes)}
              </span>
            </div>
          </div>
          <span className="text-xl font-extrabold text-orange-400 font-mono">
            {foxes.length}
          </span>
        </div>
      </div>
    </div>
  );
};
