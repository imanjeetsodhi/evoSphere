'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  BarChart3,
  BookOpen,
  Cpu,
  Globe2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

// Miniature 3D rotating ecosystem orb
const MiniEcosystemOrb = () => {
  const orbRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.4;
      orbRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <group ref={orbRef}>
      {/* Central stylized biosphere sphere */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshStandardMaterial
          color="#15803d"
          roughness={0.8}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Atmospheric transparent shield */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Orbiting celestial satellite / moon */}
      <mesh position={[3.6, 0.8, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#e0f2fe" />
      </mesh>

      {/* Orbital coordinate rings */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[3.2, 3.25, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default function LandingPage() {
  const metrics = [
    { label: 'Simulation Fidelity', value: '60 FPS Ticks' },
    { label: 'Trophic Equilibrium', value: 'Lotka-Volterra' },
    { label: 'Rendering Core', value: 'WebGL / R3F' },
    { label: 'Soundscape', value: 'Web Audio Synthesized' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
      {/* Radial atmospheric background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 bg-[#030712]/80 backdrop-blur-2xl px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Compass className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-base font-extrabold tracking-wider text-white uppercase font-sans">
            Evo<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Sphere</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400">
          <Link href="/world" className="hover:text-white transition">Simulator</Link>
          <Link href="/analytics" className="hover:text-white transition">Research Lab</Link>
          <Link href="/codex" className="hover:text-white transition">Species Codex</Link>
          <Link href="/worlds" className="hover:text-white transition">Biomes</Link>
        </nav>

        <Link
          href="/world"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-bold shadow-lg shadow-emerald-950 transition duration-300 hover:scale-105"
        >
          <span>Launch Biosphere</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center text-center gap-8 z-10 flex-1">
        {/* Flagship Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-xs font-mono text-emerald-300 shadow-xl shadow-emerald-950/20">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Next-Generation Autonomous Artificial Life OS</span>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Experience the Living{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Evolutionary Sphere
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Create living low-poly ecosystems, simulate multi-tier Lotka-Volterra trophic food webs, track autonomous predator-prey AI in 3D, and deploy cataclysms in real time.
          </p>
        </div>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/world"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 rounded-2xl text-sm font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition duration-300 hover:scale-105 group font-mono"
          >
            <span>Enter Simulation Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/codex"
            className="inline-flex items-center gap-2 px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-2xl text-sm font-mono font-medium transition duration-200"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Species Codex</span>
          </Link>
        </div>

        {/* Interactive 3D Miniature Orb Preview */}
        <div className="w-full max-w-md h-[280px] sm:h-[340px] my-4 relative">
          <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[6, 8, 6]} intensity={1.8} color="#e0f2fe" />
            <MiniEcosystemOrb />
            <OrbitControls enableZoom={false} autoRotate={false} />
          </Canvas>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 bg-slate-950/80 px-3 py-1 rounded-full border border-white/5">
            Interactive Specimen • Drag to Orbit
          </div>
        </div>

        {/* Real-time Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl border-y border-white/5 py-6">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-lg font-bold font-mono text-white">{m.value}</span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Apple/Google Style Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-6">
          {/* Card 1: 3D Graphics & Follow Cam */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/10 p-7 rounded-3xl flex flex-col justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                <Globe2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Real-time WebGL Visualization
                </span>
                <h3 className="text-xl font-bold text-white">Cinematic Follow Camera & Celestial Day/Night</h3>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Lock the 3D third-person cinematic camera onto any individual rabbit or fox to witness their hunts, flight escapes, and mating journeys. Features animated water shaders, weather particles, and dynamic solar arcs.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-semibold">
              <Link href="/world" className="inline-flex items-center gap-1.5 hover:underline">
                <span>Test in simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: God-Mode Spawner */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/10 p-7 rounded-3xl flex flex-col justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  God-Mode Spawner
                </span>
                <h3 className="text-base font-bold text-white">Terrain Spawner Palette</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click anywhere on the terrain to plant flora, release rabbits, or introduce foxes. Trigger monsoons, droughts, superblooms, and predator surges.
            </p>
            <Link href="/world" className="text-xs font-mono text-emerald-300 hover:underline">
              Try spawner tools →
            </Link>
          </div>

          {/* Card 3: DeepMind Analytics */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/10 p-7 rounded-3xl flex flex-col justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-teal-950/60 border border-teal-800/40 text-teal-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider">
                  Theoretical Ecology
                </span>
                <h3 className="text-base font-bold text-white">Lotka-Volterra Phase Space</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track multi-generational predator-prey limit cycles and compute the Shannon-Wiener Biodiversity Index and trophic biomass ratios.
            </p>
            <Link href="/analytics" className="text-xs font-mono text-teal-300 hover:underline">
              Open Research Lab →
            </Link>
          </div>

          {/* Card 4: Species Codex & Biomes */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/10 p-7 rounded-3xl flex flex-col justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  Diverse Ecosystems
                </span>
                <h3 className="text-xl font-bold text-white">Biome Presets & Anatomical Species Codex</h3>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore preset biomes ranging from the scorching Sahara Oasis to the frigid Boreal Taiga. Inspect species taxonomy and examine behavioral priority trees with isolated 3D viewports.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-indigo-300 font-semibold">
              <Link href="/worlds" className="inline-flex items-center gap-1.5 hover:underline">
                <span>Browse Biomes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/codex" className="inline-flex items-center gap-1.5 hover:underline">
                <span>Read Codex</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Flagship Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500 font-mono bg-[#020617]/60">
        EvoSphere Autonomous Ecosystem OS v2.0 • Engineered with Next.js, React Three Fiber & Fastify.
      </footer>
    </div>
  );
}
