'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Volume2, VolumeX, Wind, BarChart3, BookOpen, Layers, Sparkles } from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

export const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const { soundMuted, toggleSound, ambienceActive, toggleAmbience, isRunning } = useSimulationStore();

  const navLinks = [
    { href: '/world', label: 'Biosphere Sim', icon: <Layers className="w-3.5 h-3.5" /> },
    { href: '/analytics', label: 'Research Lab', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { href: '/codex', label: 'Species Codex', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { href: '/worlds', label: 'Biomes', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-2xl px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xl transition-all">
      {/* Brand Identity */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 group-hover:border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300">
            <Compass className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-500" />
            <div className="absolute -inset-0.5 rounded-xl bg-emerald-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white uppercase font-sans">
                Evo<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Sphere</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                v2.0 PRO
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">
              Autonomous Ecosystem OS
            </span>
          </div>
        </Link>

        {/* Global Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5 backdrop-blur-md">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white shadow-md shadow-emerald-950/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Audio & Live Telemetry Controls */}
      <div className="flex items-center gap-3">
        {/* Sim Engine Pulse Status */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono">
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-slate-300">{isRunning ? 'SIMULATING' : 'STANDBY'}</span>
        </div>

        {/* Procedural Wind / Nature Ambience Toggle */}
        <button
          onClick={toggleAmbience}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            ambienceActive
              ? 'bg-teal-500/10 border-teal-500/30 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.2)]'
              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
          title={ambienceActive ? 'Turn off Nature Ambience' : 'Start Procedural Nature Ambience'}
        >
          <Wind className={`w-3.5 h-3.5 ${ambienceActive ? 'animate-pulse text-teal-300' : ''}`} />
          <span className="hidden lg:inline text-[11px]">Ambience</span>
        </button>

        {/* Master Sound Effects Toggle */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-lg border transition-all ${
            !soundMuted
              ? 'bg-slate-900/80 border-slate-800 text-emerald-400 hover:bg-slate-800'
              : 'bg-rose-950/20 border-rose-900/40 text-rose-400 hover:bg-rose-950/40'
          }`}
          title={soundMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
        >
          {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
