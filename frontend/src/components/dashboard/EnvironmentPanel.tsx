'use client';

import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Sun, Thermometer, Droplets } from 'lucide-react';

export const EnvironmentPanel: React.FC = () => {
  const world = useSimulationStore((state) => state.world);
  const updateEnvironmentParams = useSimulationStore((state) => state.updateEnvironmentParams);

  if (!world) return null;

  const { temperature, sunlight, waterLevel } = world.environment;

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-slate-100 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-850">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Environment Builder
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">Real-time parameters</span>
      </div>

      {/* Temperature Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-orange-400">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </div>
          <span className="text-white font-bold">{temperature}°C</span>
        </div>
        <input
          type="range"
          min="10"
          max="40"
          value={temperature}
          onChange={(e) => updateEnvironmentParams({ temperature: parseInt(e.target.value) })}
          className="w-full accent-orange-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>10°C (Cold)</span>
          <span>40°C (Hot)</span>
        </div>
      </div>

      {/* Sunlight Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-450 text-amber-400">
            <Sun className="w-3.5 h-3.5" />
            <span>Solar Sunlight</span>
          </div>
          <span className="text-white font-bold">{sunlight}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sunlight}
          onChange={(e) => updateEnvironmentParams({ sunlight: parseInt(e.target.value) })}
          className="w-full accent-amber-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0% (Dark)</span>
          <span>100% (Noon)</span>
        </div>
      </div>

      {/* Water Level Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-sky-400">
            <Droplets className="w-3.5 h-3.5" />
            <span>Water Saturation</span>
          </div>
          <span className="text-white font-bold">{waterLevel}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={waterLevel}
          onChange={(e) => updateEnvironmentParams({ waterLevel: parseInt(e.target.value) })}
          className="w-full accent-sky-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0% (Arid)</span>
          <span>100% (Rain)</span>
        </div>
      </div>
    </div>
  );
};
