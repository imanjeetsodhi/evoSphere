'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Activity, ShieldCheck, Download, Upload, Copy, Check } from 'lucide-react';
import { soundEngine } from '../../lib/soundEngine';

export const BiodiversityIndex: React.FC = () => {
  const { world, exportWorldJSON, importWorldJSON } = useSimulationStore();
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!world) return null;

  const plants = world.organisms.filter((o) => o.species === 'plant' && o.alive).length;
  const rabbits = world.organisms.filter((o) => o.species === 'rabbit' && o.alive).length;
  const foxes = world.organisms.filter((o) => o.species === 'fox' && o.alive).length;
  const total = plants + rabbits + foxes;

  // 1. Shannon-Wiener Diversity Index: H' = - sum(pi * ln(pi))
  let shannonH = 0;
  if (total > 0) {
    [plants, rabbits, foxes].forEach((count) => {
      if (count > 0) {
        const p = count / total;
        shannonH -= p * Math.log(p);
      }
    });
  }

  // 2. Evenness: J' = H' / ln(3)
  const evenness = Math.min(1, shannonH / Math.log(3));

  // 3. Resilience Stability Score (0 - 100)
  // High when all 3 trophic tiers coexist with healthy balance
  let resilienceScore = 0;
  if (plants > 15 && rabbits > 3 && foxes >= 1) {
    resilienceScore = Math.min(100, Math.round(evenness * 70 + (plants / 40) * 30));
  } else if (plants > 5 && rabbits > 0) {
    resilienceScore = 45;
  } else {
    resilienceScore = 15;
  }

  const handleCopyJSON = () => {
    soundEngine.playClick(900);
    const json = exportWorldJSON();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    soundEngine.playClick(900);
    const json = exportWorldJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evosphere-world-day${world.environment.day}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importWorldJSON(content);
        if (success) {
          setImportStatus('Loaded successfully!');
        } else {
          setImportStatus('Invalid ecosystem schema.');
        }
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-slate-100 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-850">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider font-mono">
            Ecological Stability & Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Lotka-Volterra Metrics</span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Shannon Diversity Index */}
        <div className="bg-slate-950/40 p-3 rounded-xl border border-emerald-950/40 flex flex-col">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Shannon Index (H&apos;)</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">
            {shannonH.toFixed(3)}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            Max theoretical: 1.098
          </span>
        </div>

        {/* Species Evenness */}
        <div className="bg-slate-950/40 p-3 rounded-xl border border-sky-950/40 flex flex-col">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Species Evenness (J&apos;)</span>
          <span className="text-2xl font-extrabold text-sky-400 font-mono">
            {(evenness * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            Equitability distribution
          </span>
        </div>

        {/* Resilience Index */}
        <div className="bg-slate-950/40 p-3 rounded-xl border border-cyan-950/40 flex flex-col">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            Resilience Score
          </span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono">
            {resilienceScore}/100
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            Trophic pyramid health
          </span>
        </div>
      </div>

      {/* Trophic Tier Biomass Ratio Bar */}
      <div className="flex flex-col gap-1.5 bg-slate-950/30 p-3 rounded-xl border border-slate-850">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400">Trophic Tier Ratio</span>
          <span className="text-slate-200">
            {plants} Flora : {rabbits} Herbivores : {foxes} Carnivores
          </span>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
          {total > 0 && (
            <>
              <div
                style={{ width: `${(plants / total) * 100}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Plants: ${plants}`}
              />
              <div
                style={{ width: `${(rabbits / total) * 100}%` }}
                className="bg-slate-300 h-full transition-all duration-300"
                title={`Rabbits: ${rabbits}`}
              />
              <div
                style={{ width: `${(foxes / total) * 100}%` }}
                className="bg-orange-500 h-full transition-all duration-300"
                title={`Foxes: ${foxes}`}
              />
            </>
          )}
        </div>
      </div>

      {/* State JSON Export & Import Studio */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-850">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Download File
          </button>
        </div>

        <div className="flex items-center gap-2">
          {importStatus && (
            <span className="text-xs font-mono text-cyan-400 animate-pulse">{importStatus}</span>
          )}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/50 text-xs font-mono text-cyan-300 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            Import World JSON
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
