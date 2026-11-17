'use client';

import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AppShell } from '../../components/layout/AppShell';
import { RabbitRenderer } from '../../components/world/RabbitRenderer';
import { FoxRenderer } from '../../components/world/FoxRenderer';
import { PlantRenderer } from '../../components/world/PlantRenderer';
import { Rabbit, Fox, Plant } from '../../types/organism';
import { BookOpen, Dna, ArrowRight, Activity, ShieldCheck, Heart } from 'lucide-react';

// Isolated rotating preview container
const ModelPreview: React.FC<{ type: 'plant' | 'rabbit' | 'fox' }> = ({ type }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.7;
    }
  });

  const dummyPlant: Plant = {
    id: 'preview_plant',
    species: 'plant',
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    energy: 45,
    maxEnergy: 50,
    health: 100,
    age: 120,
    maxAge: 400,
    alive: true,
    reproductionCooldown: 0,
    generation: 1,
    growthStage: 0.9,
    growthRate: 0.1,
  };

  const dummyRabbit: Rabbit = {
    id: 'preview_rabbit',
    species: 'rabbit',
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0.1, y: 0, z: 0 },
    energy: 80,
    maxEnergy: 100,
    health: 100,
    age: 95,
    maxAge: 600,
    alive: true,
    reproductionCooldown: 0,
    generation: 2,
    gender: 'male',
    visionRange: 15,
    speed: 1.2,
    state: 'wandering',
  };

  const dummyFox: Fox = {
    id: 'preview_fox',
    species: 'fox',
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0.1, y: 0, z: 0 },
    energy: 110,
    maxEnergy: 150,
    health: 100,
    age: 140,
    maxAge: 1000,
    alive: true,
    reproductionCooldown: 0,
    generation: 1,
    gender: 'female',
    visionRange: 25,
    speed: 1.8,
    state: 'hunting',
  };

  return (
    <group ref={groupRef}>
      {type === 'plant' && <PlantRenderer plant={dummyPlant} />}
      {type === 'rabbit' && <RabbitRenderer rabbit={dummyRabbit} />}
      {type === 'fox' && <FoxRenderer fox={dummyFox} />}
    </group>
  );
};

export default function CodexPage() {
  const [selectedSpecies, setSelectedSpecies] = useState<'plant' | 'rabbit' | 'fox'>('rabbit');

  const speciesData = {
    plant: {
      name: 'Wild Flora & Botanical Shoots',
      scientific: 'Trifolium pratense / Briza media',
      trophic: 'Autotrophic Primary Producer (Tier 1)',
      emoji: '🌱',
      role: 'Captures solar irradiance and water saturation to synthesize caloric biomass. Supplies the biological foundation of the entire biosphere.',
      traits: [
        { label: 'Energy Storage', val: '50 units' },
        { label: 'Growth Catalyst', val: 'Sunlight + Water %' },
        { label: 'Reproduction Mode', val: 'Asexual Radial Seeding' },
        { label: 'Max Lifespan', val: '400 Ticks' },
      ],
      behaviorTree: [
        { step: '1. Photosynthesis', desc: 'Converts solar sunlight & soil moisture into metabolic energy' },
        { step: '2. Biomass Expansion', desc: 'Increases foliage volume and develops flowering seed buds' },
        { step: '3. Radial Seeding', desc: 'Spreads baby clones within 5-13 meter radius when energy > 45 units' },
      ],
    },
    rabbit: {
      name: 'Grassland Herbivore',
      scientific: 'Oryctolagus cuniculus',
      trophic: 'Primary Consumer / Herbivore (Tier 2)',
      emoji: '🐇',
      role: 'Keeps flora growth checked by grazing upon plants. Serves as the primary caloric lifeblood for apex carnivores.',
      traits: [
        { label: 'Movement Velocity', val: '1.2 m/tick' },
        { label: 'Sensory Vision', val: '15.0 m' },
        { label: 'Metabolic Drain', val: '0.25 units/tick' },
        { label: 'Mating Horizon', val: 'Sexual Pairing (Energy > 75)' },
      ],
      behaviorTree: [
        { step: '1. Predator Proximity', desc: 'If Fox detected within 15m → Instantly flees in reverse vector' },
        { step: '2. Caloric Foraging', desc: 'If Energy < 75% → Navigates toward nearest live plant to graze' },
        { step: '3. Mating Attraction', desc: 'If mature & high energy → Seeks opposite-gender partner to birth offspring' },
        { step: '4. Kinetic Wander', desc: 'Otherwise steers gently across grassland boundaries' },
      ],
    },
    fox: {
      name: 'Red Fox Apex Carnivore',
      scientific: 'Vulpes vulpes',
      trophic: 'Secondary Consumer / Apex Predator (Tier 3)',
      emoji: '🦊',
      role: 'Regulates herbivore populations to prevent ecological overgrazing and catastrophic desertification.',
      traits: [
        { label: 'Pursuit Speed', val: '1.8 m/tick' },
        { label: 'Hunting Vision', val: '25.0 m' },
        { label: 'Metabolic Drain', val: '0.35 units/tick' },
        { label: 'Caloric Bounty', val: '+80 units per rabbit captured' },
      ],
      behaviorTree: [
        { step: '1. Stalking & Hunt', desc: 'If hungry and rabbit visible within 25m → Sprints on intercept course' },
        { step: '2. Predation Strike', desc: 'If distance < 2.2m → Consumes prey, replenishing +80 energy units' },
        { step: '3. Lineage Mating', desc: 'If energy > 110 units → Courts opposite-gender fox partner' },
        { step: '4. Roaming Survey', desc: 'Patrols grassland boundaries searching for scent trails' },
      ],
    },
  };

  const current = speciesData[selectedSpecies];

  return (
    <AppShell>
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-900/40 p-5 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-white uppercase tracking-tight font-sans">
              Species Codex & Biological Field Guide
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Taxonomy, behavioral priority trees & 3D anatomical models
            </p>
          </div>
        </div>
      </div>

      {/* Species Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 w-fit">
        {(['plant', 'rabbit', 'fox'] as const).map((key) => {
          const item = speciesData[key];
          const isActive = selectedSpecies === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedSpecies(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950 font-bold scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span className="text-base">{item.emoji}</span>
              <span className="capitalize">{key}</span>
            </button>
          );
        })}
      </div>

      {/* Main Codex Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Isolated Interactive Model */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span>3D Interactive Specimen Inspection</span>
            <span className="text-cyan-400 font-bold">Orbit & Zoomable</span>
          </div>

          <div className="w-full h-[340px] bg-slate-900/40 rounded-xl overflow-hidden border border-slate-800 relative">
            <Canvas camera={{ position: [2, 2.5, 3.5], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 8, 5]} intensity={1.5} />
              <ModelPreview type={selectedSpecies} />
              <OrbitControls autoRotate={false} minDistance={2} maxDistance={8} />
              <gridHelper args={[6, 12, '#334155', '#1e293b']} position={[0, -0.01, 0]} />
            </Canvas>
          </div>

          <div className="text-center text-[11px] font-mono text-slate-500">
            Procedural low-poly anatomical model generated without external assets.
          </div>
        </div>

        {/* Right Column: Traits & Behavioral Decision Trees */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Scientific Bio Header */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{current.emoji}</span>
              <h2 className="text-lg font-bold text-white font-sans">{current.name}</h2>
            </div>
            <span className="text-xs font-mono text-cyan-400 italic">{current.scientific}</span>
            <span className="text-xs font-mono text-emerald-400">{current.trophic}</span>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">{current.role}</p>
          </div>

          {/* Trait Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {current.traits.map((trait, idx) => (
              <div
                key={idx}
                className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 flex flex-col"
              >
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {trait.label}
                </span>
                <span className="text-xs font-bold font-mono text-white mt-1">
                  {trait.val}
                </span>
              </div>
            ))}
          </div>

          {/* Behavioral Priority Decision Tree */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                Behavioral AI State Transition Tree
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {current.behaviorTree.map((node, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-850"
                >
                  <div className="p-1 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 font-mono text-[10px] font-bold shrink-0">
                    Priority #{i + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white font-mono">{node.step}</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed">{node.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
