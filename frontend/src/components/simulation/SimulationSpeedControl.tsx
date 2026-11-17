'use client';

import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { SIMULATION_SPEEDS } from '../../config/simulationConfig';

export const SimulationSpeedControl: React.FC = () => {
  const { speed, setSpeed } = useSimulationStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Speed:</span>
      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg">
        {SIMULATION_SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition ${
              speed === s
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
