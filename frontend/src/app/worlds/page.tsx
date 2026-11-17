'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSimulationStore, BiomeType } from '../../store/simulationStore';
import { AppShell } from '../../components/layout/AppShell';
import { Sparkles, ArrowRight, Sun, Droplets, Thermometer, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../../lib/soundEngine';

export default function WorldsPage() {
  const router = useRouter();
  const { setBiome, updateEnvironmentParams, initWorld } = useSimulationStore();

  const presets: {
    id: BiomeType;
    title: string;
    emoji: string;
    tagline: string;
    description: string;
    temp: number;
    sun: number;
    water: number;
    volatility: 'Low' | 'Medium' | 'High' | 'Extreme';
    gradient: string;
  }[] = [
    {
      id: 'genesis',
      title: 'Genesis Valley',
      emoji: '🌿',
      tagline: 'Balanced Temperate Meadow',
      description: 'The golden baseline ecosystem. Balanced solar irradiance and steady water supply sustain gentle population oscillations.',
      temp: 24,
      sun: 80,
      water: 70,
      volatility: 'Low',
      gradient: 'from-emerald-950/40 to-teal-950/20 border-emerald-800/40',
    },
    {
      id: 'desert',
      title: 'Sahara Oasis',
      emoji: '🏜️',
      tagline: 'Arid Dune & Extreme Heat',
      description: 'High thermal index and scarce precipitation. Plants struggle to retain moisture, driving intense competition for survival.',
      temp: 36,
      sun: 98,
      water: 25,
      volatility: 'High',
      gradient: 'from-amber-950/40 to-orange-950/20 border-amber-800/40',
    },
    {
      id: 'rainforest',
      title: 'Amazonian Canopy',
      emoji: '🌴',
      tagline: 'Hyper-Fertile Rainforest',
      description: 'Dense humidity and rich moisture tables trigger rapid botanical proliferation, allowing herbivore populations to boom.',
      temp: 28,
      sun: 75,
      water: 95,
      volatility: 'Medium',
      gradient: 'from-green-950/40 to-emerald-950/20 border-green-800/40',
    },
    {
      id: 'taiga',
      title: 'Boreal Taiga',
      emoji: '🏔️',
      tagline: 'Alpine Freeze & Predator Haven',
      description: 'Chilly sub-alpine territory where botanical growth is sluggish, forcing apex carnivores to patrol broad swathes of land.',
      temp: 12,
      sun: 60,
      water: 55,
      volatility: 'Extreme',
      gradient: 'from-cyan-950/40 to-slate-950/40 border-cyan-800/40',
    },
  ];

  const handleDeployBiome = (preset: typeof presets[0]) => {
    soundEngine.playClick(1000);
    initWorld(Date.now());
    setBiome(preset.id);
    updateEnvironmentParams({
      temperature: preset.temp,
      sunlight: preset.sun,
      waterLevel: preset.water,
    });
    router.push('/world');
  };

  return (
    <AppShell>
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-900/40 p-5 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-white uppercase tracking-tight font-sans">
              Ecosystem Biome Library
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Pre-configured environmental simulations with distinct climate conditions
            </p>
          </div>
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {presets.map((p) => (
          <div
            key={p.id}
            className={`bg-gradient-to-br ${p.gradient} border p-6 rounded-2xl flex flex-col justify-between gap-5 transition-all hover:scale-[1.01] shadow-xl`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-slate-950/60 border border-white/10">
                    {p.emoji}
                  </span>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-white font-sans">{p.title}</h2>
                    <span className="text-xs font-mono text-cyan-400">{p.tagline}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 text-[10px] font-mono">
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  <span className="text-slate-400">Volatility:</span>
                  <span className="text-white font-bold">{p.volatility}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>

              {/* Climate Telemetry */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-orange-400">
                    <Thermometer className="w-3 h-3" />
                    <span>Temp</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">{p.temp}°C</span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                    <Sun className="w-3 h-3" />
                    <span>Solar</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">{p.sun}%</span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-sky-400">
                    <Droplets className="w-3 h-3" />
                    <span>Water</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">{p.water}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDeployBiome(p)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition duration-200 group"
            >
              <span>Deploy Biome into Biosphere</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
