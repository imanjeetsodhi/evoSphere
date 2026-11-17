'use client';

import React, { useEffect } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { AppShell } from '../../components/layout/AppShell';
import { WorldScene } from '../../components/world/WorldScene';
import { SimulationControls } from '../../components/simulation/SimulationControls';
import { SimulationStatus } from '../../components/simulation/SimulationStatus';
import { SimulationSpeedControl } from '../../components/simulation/SimulationSpeedControl';
import { SpawnPalette } from '../../components/simulation/SpawnPalette';
import { CataclysmBar } from '../../components/simulation/CataclysmBar';
import { OrganismInspector } from '../../components/dashboard/OrganismInspector';
import { EnvironmentPanel } from '../../components/dashboard/EnvironmentPanel';
import { SpeciesPanel } from '../../components/dashboard/SpeciesPanel';
import { StatisticsPanel } from '../../components/dashboard/StatisticsPanel';
import { EventLog } from '../../components/dashboard/EventLog';
import { PopulationChart } from '../../components/analytics/PopulationChart';

export default function WorldPage() {
  const { world, initWorld, pauseSimulation, selectedOrganismId } = useSimulationStore();

  useEffect(() => {
    const currentWorld = useSimulationStore.getState().world;
    if (!currentWorld) {
      initWorld();
    }
    return () => {
      pauseSimulation();
    };
  }, [initWorld, pauseSimulation]);

  return (
    <AppShell>
      {/* Simulation Command Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/50 backdrop-blur-xl p-4 border border-white/5 rounded-2xl shadow-xl">
        <SimulationStatus />
        <div className="flex flex-wrap items-center gap-3">
          <SpawnPalette />
          <SimulationSpeedControl />
          <SimulationControls />
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Telemetry Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Dynamic Organism Inspector (Promoted to top when an entity is selected) */}
          {selectedOrganismId && <OrganismInspector />}

          <EnvironmentPanel />
          <SpeciesPanel />
        </div>

        {/* Right 3D Viewport Column */}
        <div className="lg:col-span-8 h-full flex flex-col justify-stretch">
          <WorldScene />
        </div>
      </div>

      {/* Cataclysms & Environmental Scenario Interventions */}
      <CataclysmBar />

      {/* Cumulative Statistics Overview */}
      <StatisticsPanel />

      {/* Analytics Chart & Event Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PopulationChart />
        <EventLog />
      </div>
    </AppShell>
  );
}
