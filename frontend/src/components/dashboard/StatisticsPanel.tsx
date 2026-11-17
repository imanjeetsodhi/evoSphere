'use client';

import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { ShieldAlert, Heart, Skull, Activity } from 'lucide-react';

export const StatisticsPanel: React.FC = () => {
  const statistics = useSimulationStore((state) => state.statistics);

  const stats = [
    {
      label: 'Cumulative Births',
      value: statistics.births,
      color: 'text-emerald-400 border-emerald-950/40 bg-emerald-950/10',
      icon: <Heart className="w-4 h-4 text-emerald-400" />,
    },
    {
      label: 'Predation Events',
      value: statistics.predations,
      color: 'text-rose-400 border-rose-950/40 bg-rose-950/10',
      icon: <Skull className="w-4 h-4 text-rose-400" />,
    },
    {
      label: 'Starvation Deaths',
      value: statistics.starvations,
      color: 'text-amber-400 border-amber-950/40 bg-amber-950/10',
      icon: <ShieldAlert className="w-4 h-4 text-amber-400" />,
    },
    {
      label: 'Total Deaths',
      value: statistics.deaths,
      color: 'text-slate-400 border-slate-800 bg-slate-900/40',
      icon: <Activity className="w-4 h-4 text-slate-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={`stat_${idx}`}
          className={`flex items-center gap-3 border p-4 rounded-xl shadow-sm ${stat.color}`}
        >
          <div className="p-2 rounded-lg bg-slate-950/40">{stat.icon}</div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              {stat.label}
            </span>
            <span className="text-xl font-extrabold font-mono text-slate-100">
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
