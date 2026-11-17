'use client';

import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';

export const SimulationStatus: React.FC = () => {
  const { isRunning, currentTick, world } = useSimulationStore();
  const environment = world?.environment;

  return (
    <div className="flex items-center gap-4 text-sm font-mono select-none">
      <div className="flex items-center gap-2">
        <span className="text-slate-400">Day:</span>
        <span className="text-white font-bold text-base">{environment?.day ?? 1}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400">Tick:</span>
        <span className="text-white font-bold text-base">{currentTick}</span>
      </div>

      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-xs">
        <span
          className={`w-2 h-2 rounded-full ${
            isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
          }`}
        />
        <span className={isRunning ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'}>
          {isRunning ? 'RUNNING' : 'PAUSED'}
        </span>
      </div>
    </div>
  );
};
