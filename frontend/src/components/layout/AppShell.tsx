'use client';

import React from 'react';
import { AppHeader } from './AppHeader';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#050b14] text-slate-100 antialiased">
      {/* Header Navigation */}
      <AppHeader />

      {/* Main Page Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {children}
      </main>

      {/* Mini Footer */}
      <footer className="border-t border-slate-900 bg-[#02060c] py-3 text-center text-[10px] font-mono text-slate-655 text-slate-600">
        EvoSphere Simulator Engine v1.0.0 © 2026. Built with Next.js & React Three Fiber.
      </footer>
    </div>
  );
};
