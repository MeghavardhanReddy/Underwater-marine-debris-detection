import React from 'react';
import { 
  LayoutGrid, 
  Radar, 
  Crosshair, 
  LineChart, 
  Workflow, 
  Database, 
  Sliders, 
  Wifi, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid, tag: '00' },
  { id: 'analysis', label: 'Sonar Analysis', icon: Radar, tag: '01' },
  { id: 'results', label: 'Detection Results', icon: Crosshair, tag: '02' },
  { id: 'evaluation', label: 'Model Evaluation', icon: LineChart, tag: '03' },
  { id: 'workflow', label: 'System Workflow', icon: Workflow, tag: '04' },
  { id: 'dataset', label: 'Dataset Information', icon: Database, tag: '05' },
  { id: 'settings', label: 'Settings & API', icon: Sliders, tag: '06' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 flex-shrink-0 hud-panel border-r border-sonar-border flex flex-col justify-between p-3.5 z-20 h-full overflow-y-auto">
      {/* Top Menu Section */}
      <div className="space-y-4">
        <div className="px-2 pt-1">
          <div className="text-[10px] font-mono-data uppercase tracking-widest text-slate-400">
            OPERATIONAL UNITS
          </div>
          <div className="text-xs font-medium text-sonar-cyan/70 font-mono-data">
            SUBSEA SUITE // V1.2.4
          </div>
        </div>

        {/* Navigation buttons */}
        <nav className="space-y-1.5" aria-label="Operational navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-tech font-medium transition-all group ${
                  isActive
                    ? 'bg-sonar-cyan text-slate-950 shadow-glow-cyan font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-slate-950 stroke-[2.5]' : 'text-sonar-cyan/70 group-hover:text-sonar-cyan'
                    }`}
                  />
                  <span className="tracking-wide text-left">{item.label}</span>
                </div>
                <span
                  className={`text-[10px] font-mono-data px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-slate-900/40 text-slate-950 font-bold'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {item.tag}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Animated Tactical Radar Scanner Widget */}
        <div className="p-3 rounded-lg border border-sonar-border bg-slate-950/60 flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full border border-sonar-cyan/30 flex items-center justify-center overflow-hidden">
            {/* Concentric distance rings */}
            <div className="absolute inset-2 rounded-full border border-sonar-cyan/20" />
            <div className="absolute inset-5 rounded-full border border-sonar-cyan/20" />
            <div className="absolute inset-8 rounded-full border border-sonar-cyan/15" />

            {/* Crosshair axes */}
            <div className="absolute w-full h-[1px] bg-sonar-cyan/25" />
            <div className="absolute h-full w-[1px] bg-sonar-cyan/25" />

            {/* Rotating sonar sweep beam */}
            <div
              className="absolute inset-0 origin-center animate-radar-sweep pointer-events-none"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(0,242,254,0.35) 0deg, rgba(0,242,254,0.05) 45deg, transparent 60deg)',
              }}
            />

            {/* Simulated sonar echo blips */}
            <span className="absolute top-6 right-8 w-1.5 h-1.5 rounded-full bg-sonar-cyan shadow-glow-cyan animate-ping-slow" />
            <span className="absolute bottom-7 left-7 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />

            <div className="z-10 text-[9px] font-mono-data text-sonar-cyan/90 bg-slate-950/80 px-1 rounded">
              360° SWEEP
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] font-mono-data text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>BEAM PINGING: 256 CH</span>
          </div>
        </div>
      </div>

      {/* Host Link Edge Status Card */}
      <div className="p-3 rounded-lg border border-sonar-border bg-sonar-panel space-y-2 text-[11px] font-mono-data">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-sonar-teal" /> HOST LINK
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> CONNECTED
          </span>
        </div>

        <div className="border-t border-slate-800 pt-2 space-y-1">
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-500">Engine:</span>
            <span className="text-sonar-cyan font-semibold">YOLOv8-Marine v1.2</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-500">Pipeline Mode:</span>
            <span className="text-amber-400 font-semibold">LOCAL EDGE</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 leading-tight pt-1">
          Tactical Instrumentation / Hydrographic Testbench
        </div>
      </div>
    </aside>
  );
}
