'use client';

import React from 'react';
import { useSimulationStore, SpawnTool } from '../../store/simulationStore';
import { MousePointer, Sparkles } from 'lucide-react';

export const SpawnPalette: React.FC = () => {
  const { spawnTool, setSpawnTool } = useSimulationStore();

  const tools: { id: SpawnTool; label: string; icon: string; color: string }[] = [
    { id: 'none', label: 'Inspect', icon: '👆', color: 'border-slate-700 bg-slate-900/60' },
    { id: 'plant', label: 'Flora', icon: '🌱', color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400' },
    { id: 'rabbit', label: 'Rabbit', icon: '🐇', color: 'border-sky-500/40 bg-sky-950/30 text-sky-300' },
    { id: 'fox', label: 'Fox', icon: '🦊', color: 'border-orange-500/40 bg-orange-950/30 text-orange-400' },
  ];

  return (
    <div className="flex flex-col gap-1.5 bg-slate-950/60 backdrop-blur-xl border border-white/5 p-2 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          God-Mode Spawner
        </span>
        {spawnTool !== 'none' && (
          <span className="text-[9px] font-mono text-cyan-400 animate-pulse">
            Click terrain to place
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {tools.map((t) => {
          const isActive = spawnTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSpawnTool(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-950 font-bold border border-cyan-400/50 scale-105'
                  : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
