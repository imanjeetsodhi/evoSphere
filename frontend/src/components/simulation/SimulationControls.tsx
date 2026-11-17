'use client';

import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export const SimulationControls: React.FC = () => {
  const {
    isRunning,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    advanceSimulation,
  } = useSimulationStore();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {isRunning ? (
        <button
          onClick={pauseSimulation}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-lg text-sm font-semibold transition shadow-md"
        >
          <Pause className="w-4 h-4 fill-white" />
          Pause
        </button>
      ) : (
        <button
          onClick={startSimulation}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition shadow-md"
        >
          <Play className="w-4 h-4 fill-white" />
          Start
        </button>
      )}

      <button
        onClick={advanceSimulation}
        disabled={isRunning}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 rounded-lg text-sm font-semibold border border-slate-700 transition"
        title="Advance one simulation tick"
      >
        <SkipForward className="w-4 h-4" />
        Step
      </button>

      <button
        onClick={resetSimulation}
        className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-slate-400 hover:text-slate-200 rounded-lg text-sm font-semibold border border-slate-800 hover:border-slate-700 transition"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
};
