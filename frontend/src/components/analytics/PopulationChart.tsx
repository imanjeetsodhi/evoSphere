'use client';

import React, { useEffect, useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const PopulationChart: React.FC = () => {
  const populationHistory = useSimulationStore((state) => state.populationHistory);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl h-[300px] flex items-center justify-center text-slate-500 text-xs font-mono">
        Loading analytics charts...
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-slate-100 flex flex-col h-[340px] overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-4 bg-slate-900/10">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Population Dynamics
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">Historical tracking</span>
      </div>

      <div className="flex-1 w-full text-xs font-mono">
        {populationHistory.length <= 1 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-655 text-slate-500 italic">
            Waiting for simulation history points...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={populationHistory}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="tick"
                stroke="#64748b"
                tickFormatter={(tick) => `T${tick}`}
                style={{ fontSize: 9 }}
              />
              <YAxis stroke="#64748b" style={{ fontSize: 9 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontFamily: 'monospace',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="plants"
                name="Plants 🌱"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="rabbits"
                name="Rabbits 🐇"
                stroke="#cbd5e1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="foxes"
                name="Foxes 🦊"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
