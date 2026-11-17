'use client';

import React, { useEffect, useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Orbit, Info } from 'lucide-react';

export const LotkaVolterraPlot: React.FC = () => {
  const populationHistory = useSimulationStore((state) => state.populationHistory);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl h-[320px] flex items-center justify-center text-slate-500 text-xs font-mono">
        Loading phase space plot...
      </div>
    );
  }

  const phaseData = populationHistory.map((entry) => ({
    rabbits: entry.rabbits,
    foxes: entry.foxes,
    tick: entry.tick,
  }));

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-slate-100 flex flex-col h-[350px]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-850 mb-3">
        <div className="flex items-center gap-2">
          <Orbit className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider font-mono">
            Lotka-Volterra Phase Space
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400" title="Classical ecological predator-prey cyclic trajectory">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Prey vs Predator Orbit</span>
        </div>
      </div>

      <div className="flex-1 w-full text-xs font-mono">
        {phaseData.length <= 2 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 italic">
            Accumulating phase trajectory vectors...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 15, bottom: 15, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="rabbits"
                name="Herbivores (Prey)"
                stroke="#64748b"
                label={{ value: 'Rabbits (Prey)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }}
                style={{ fontSize: 9 }}
              />
              <YAxis
                type="number"
                dataKey="foxes"
                name="Carnivores (Predator)"
                stroke="#64748b"
                label={{ value: 'Foxes', angle: -90, position: 'insideLeft', offset: 15, fill: '#94a3b8', fontSize: 10 }}
                style={{ fontSize: 9 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs font-mono shadow-xl">
                        <div className="text-cyan-400 font-bold mb-1">Tick #{data.tick}</div>
                        <div className="text-slate-300">🐇 Rabbits: {data.rabbits}</div>
                        <div className="text-orange-400">🦊 Foxes: {data.foxes}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Equilibrium Orbit"
                data={phaseData}
                fill="#06b6d4"
                line={{ stroke: '#0891b2', strokeWidth: 1.5 }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
