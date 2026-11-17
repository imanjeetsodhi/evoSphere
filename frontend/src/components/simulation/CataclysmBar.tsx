'use client';

import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { CloudRain, Sun, Flower2, Zap, AlertTriangle } from 'lucide-react';

export const CataclysmBar: React.FC = () => {
  const triggerCataclysm = useSimulationStore((state) => state.triggerCataclysm);
  const weather = useSimulationStore((state) => state.weather);

  const events: {
    type: 'monsoon' | 'drought' | 'superbloom' | 'surge';
    label: string;
    icon: React.ReactNode;
    color: string;
    desc: string;
  }[] = [
    {
      type: 'monsoon',
      label: 'Monsoon Rain',
      icon: <CloudRain className="w-3.5 h-3.5" />,
      color: 'hover:border-sky-500/50 hover:bg-sky-950/30 text-sky-400',
      desc: 'Spikes water saturation, accelerates growth',
    },
    {
      type: 'drought',
      label: 'Arid Drought',
      icon: <Sun className="w-3.5 h-3.5" />,
      color: 'hover:border-amber-500/50 hover:bg-amber-950/30 text-amber-400',
      desc: 'Dries water, raises temperature',
    },
    {
      type: 'superbloom',
      label: 'Superbloom',
      icon: <Flower2 className="w-3.5 h-3.5" />,
      color: 'hover:border-pink-500/50 hover:bg-pink-950/30 text-pink-400',
      desc: 'Seeds 12 nutrient-rich flower clusters',
    },
    {
      type: 'surge',
      label: 'Apex Surge',
      icon: <Zap className="w-3.5 h-3.5" />,
      color: 'hover:border-rose-500/50 hover:bg-rose-950/30 text-rose-400',
      desc: 'Releases aggressive pack of foxes',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-2.5">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-850">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Ecosystem Cataclysms & Miracles</span>
        </div>
        {weather !== 'clear' && (
          <span className="text-[10px] font-mono text-cyan-400 uppercase bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40 font-bold animate-pulse">
            Active: {weather}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {events.map((e) => (
          <button
            key={e.type}
            onClick={() => triggerCataclysm(e.type)}
            className={`flex flex-col items-start gap-1 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 transition-all ${e.color} hover:scale-[1.02] text-left group`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold font-mono">
              {e.icon}
              <span>{e.label}</span>
            </div>
            <span className="text-[9px] text-slate-500 group-hover:text-slate-400 leading-tight">
              {e.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
