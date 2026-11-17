'use client';

import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { EventType } from '../../types/events';

export const EventLog: React.FC = () => {
  const events = useSimulationStore((state) => state.events);

  const getEventStyles = (type: EventType) => {
    switch (type) {
      case 'BIRTH':
        return { badge: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30', text: 'text-emerald-350' };
      case 'PREDATION':
        return { badge: 'bg-rose-950/40 text-rose-400 border-rose-900/30', text: 'text-rose-200 font-semibold' };
      case 'STARVATION':
        return { badge: 'bg-amber-950/40 text-amber-505 text-amber-400 border-amber-900/30', text: 'text-amber-300' };
      case 'FEEDING':
        return { badge: 'bg-slate-950/40 text-slate-400 border-slate-900/30', text: 'text-slate-300' };
      case 'DEATH':
        return { badge: 'bg-slate-900 text-slate-450 text-slate-400 border-slate-800', text: 'text-slate-400' };
      case 'PLANT_GROWTH':
        return { badge: 'bg-emerald-950/20 text-emerald-500/80 border-emerald-950/20', text: 'text-slate-400' };
      case 'SYSTEM':
      default:
        return { badge: 'bg-sky-950/40 text-sky-400 border-sky-900/30', text: 'text-sky-300 font-semibold' };
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 flex flex-col h-[320px] overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-850 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1.5">
            Event Console Log
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {events.length} records buffered
        </span>
      </div>

      {/* Console Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs flex flex-col gap-2 bg-slate-950/40 custom-scrollbar">
        {events.length === 0 ? (
          <div className="text-slate-600 flex items-center justify-center h-full italic">
            Waiting for simulation ticks...
          </div>
        ) : (
          events.map((event) => {
            const styles = getEventStyles(event.type);
            return (
              <div
                key={event.id}
                className="flex items-start gap-2.5 py-1 px-1.5 rounded hover:bg-slate-900/30 transition border border-transparent hover:border-slate-850"
              >
                {/* Day / Timestamp */}
                <span className="text-slate-600 font-bold shrink-0">
                  [D{event.day} T{event.timestamp}]
                </span>

                {/* Badge Type */}
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded border uppercase shrink-0 ${styles.badge}`}
                >
                  {event.type}
                </span>

                {/* Message */}
                <span className={`flex-1 break-all ${styles.text}`}>
                  {event.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
