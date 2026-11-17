'use client';

import React, { useEffect } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { AppShell } from '../../components/layout/AppShell';
import { PopulationChart } from '../../components/analytics/PopulationChart';
import { LotkaVolterraPlot } from '../../components/analytics/LotkaVolterraPlot';
import { BiodiversityIndex } from '../../components/analytics/BiodiversityIndex';
import { GeneticLab } from '../../components/dashboard/GeneticLab';
import { StatisticsPanel } from '../../components/dashboard/StatisticsPanel';
import { BarChart3, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
  const { world, initWorld } = useSimulationStore();

  useEffect(() => {
    if (!world) {
      initWorld();
    }
  }, [world, initWorld]);

  return (
    <AppShell>
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/40 p-5 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/30 text-cyan-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-white uppercase tracking-tight font-sans">
              Ecosystem Research & Analytics Lab
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Mathematical modeling, phase-space trajectories & stability diagnostics
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lotka-Volterra Telemetry Engine</span>
        </div>
      </div>

      {/* Aggregate Statistics Overview */}
      <StatisticsPanel />

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopulationChart />
        <LotkaVolterraPlot />
      </div>

      {/* Mathematical Indices & State Studio */}
      <BiodiversityIndex />

      {/* Genetics & Environmental Variable Laboratory */}
      <GeneticLab />
    </AppShell>
  );
}
