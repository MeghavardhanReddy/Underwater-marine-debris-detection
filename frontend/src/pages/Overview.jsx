import React from 'react';
import { 
  Radar, 
  Workflow, 
  Crosshair, 
  LineChart, 
  Database, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Compass, 
  AlertCircle 
} from 'lucide-react';

export default function Overview({ setActiveTab }) {
  return (
    <div className="space-y-5">
      {/* Hero Welcome Banner */}
      <div className="hud-panel rounded-xl p-6 border border-sonar-border relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-data">
            <span className="px-2 py-0.5 rounded bg-cyan-950/90 text-sonar-cyan border border-sonar-cyan/40">
              SMART INDIA HACKATHON // PROBLEM STATEMENT ID: 26057
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-400 font-semibold">R&D PHASE 1 READY</span>
          </div>

          <h1 className="font-tech text-2xl md:text-3xl font-bold text-white tracking-wide">
            AI-Powered Underwater Marine Debris and Anomaly Detection System
          </h1>

          <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
            A state-of-the-art hydrographic subsea suite designed to ingest Side-Scan Sonar (SSS) acoustic waterfall imagery, detect and localize hazardous marine debris (lost ghost fishing nets, sunken shipping containers, submerged pipelines, and scrap metal), and trigonometrically deduce physical height profiles from acoustic shadow projections.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('analysis')}
              className="px-4 py-2 rounded-lg bg-sonar-cyan hover:bg-cyan-300 text-slate-950 font-tech font-bold text-xs tracking-wider flex items-center gap-2 shadow-glow-cyan transition-all"
            >
              <Radar className="w-4 h-4 stroke-[2.5]" />
              <span>Launch Sonar Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className="px-4 py-2 rounded-lg hud-panel hover:bg-slate-800 text-slate-200 font-tech font-bold text-xs tracking-wider flex items-center gap-2 transition-all"
            >
              <Crosshair className="w-4 h-4 text-sonar-teal" />
              <span>Inspect Swath #SR-2024-098</span>
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className="px-4 py-2 rounded-lg hud-panel hover:bg-slate-800 text-slate-200 font-tech font-bold text-xs tracking-wider flex items-center gap-2 transition-all"
            >
              <Workflow className="w-4 h-4 text-amber-400" />
              <span>View System Workflow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono-data">
        <div className="hud-panel rounded-xl p-4 border border-sonar-border">
          <div className="text-[10px] text-slate-400 uppercase">ACOUSTIC FREQUENCIES</div>
          <div className="text-xl font-bold text-sonar-cyan mt-1">360 / 900 kHz</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Dual-Swath Side-Scan</div>
        </div>

        <div className="hud-panel rounded-xl p-4 border border-sonar-border">
          <div className="text-[10px] text-slate-400 uppercase">DETECTION CLASSES</div>
          <div className="text-xl font-bold text-sonar-teal mt-1">5 Subsea Classes</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Containers, Nets, Cables, Reef</div>
        </div>

        <div className="hud-panel rounded-xl p-4 border border-sonar-border">
          <div className="text-[10px] text-slate-400 uppercase">SHADOW HEIGHT RESOLUTION</div>
          <div className="text-xl font-bold text-amber-400 mt-1">± 0.15 m</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Trigonometric Derivation</div>
        </div>

        <div className="hud-panel rounded-xl p-4 border border-sonar-border">
          <div className="text-[10px] text-slate-400 uppercase">EDGE LATENCY</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">38.4 ms</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Real-time Towfish Inference</div>
        </div>
      </div>

      {/* Four-Member Workstream Split (As Mandated by Project Prompt) */}
      <div className="hud-panel rounded-xl p-5 border border-sonar-border space-y-4">
        <div className="flex items-center justify-between border-b border-sonar-border pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sonar-cyan" />
            <span className="font-tech text-base font-bold text-white tracking-wide">
              FOUR-MEMBER WORKSTREAM RESPONSIBILITY MATRIX
            </span>
          </div>
          <span className="text-[11px] font-mono-data text-sonar-teal">
            Member 1 (You) — Frontend Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Member 1 */}
          <div className="p-3.5 rounded-lg bg-cyan-950/40 border border-sonar-cyan shadow-glow-cyan space-y-2">
            <div className="flex justify-between items-center font-mono-data text-[10px]">
              <span className="text-sonar-cyan font-bold">MEMBER 1</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">ACTIVE</span>
            </div>
            <div className="font-tech text-sm font-bold text-white">Frontend & Dashboard</div>
            <ul className="text-[11px] text-slate-300 space-y-1 font-sans list-disc list-inside">
              <li>Responsive Tactical Marine HUD</li>
              <li>Acoustic Sonogram Waterfall Viewer</li>
              <li>Interactive System Workflow Diagram</li>
              <li>Centralized API Service with Fallback</li>
              <li>3D Underwater Moving Water Background</li>
            </ul>
          </div>

          {/* Member 2 */}
          <div className="p-3.5 rounded-lg hud-panel border border-slate-700 space-y-2 opacity-85">
            <div className="flex justify-between items-center font-mono-data text-[10px]">
              <span className="text-slate-400 font-bold">MEMBER 2</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">PARALLEL</span>
            </div>
            <div className="font-tech text-sm font-bold text-white">Dataset & ML Model</div>
            <ul className="text-[11px] text-slate-400 space-y-1 font-sans list-disc list-inside">
              <li>Permitted SSS Dataset Curation</li>
              <li>Train/Validation/Test Leakage Splits</li>
              <li>YOLOv8-Marine Baseline Training</li>
              <li>Quantitative Held-Out Benchmarks</li>
            </ul>
          </div>

          {/* Member 3 */}
          <div className="p-3.5 rounded-lg hud-panel border border-slate-700 space-y-2 opacity-85">
            <div className="flex justify-between items-center font-mono-data text-[10px]">
              <span className="text-slate-400 font-bold">MEMBER 3</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">PARALLEL</span>
            </div>
            <div className="font-tech text-sm font-bold text-white">FastAPI Backend</div>
            <ul className="text-[11px] text-slate-400 space-y-1 font-sans list-disc list-inside">
              <li>GET /health & POST /predict endpoints</li>
              <li>Image content validation & decoding</li>
              <li>Structured JSON Bounding Box Schema</li>
              <li>CORS and error handling</li>
            </ul>
          </div>

          {/* Member 4 */}
          <div className="p-3.5 rounded-lg hud-panel border border-slate-700 space-y-2 opacity-85">
            <div className="flex justify-between items-center font-mono-data text-[10px]">
              <span className="text-slate-400 font-bold">MEMBER 4</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">PARALLEL</span>
            </div>
            <div className="font-tech text-sm font-bold text-white">QA, Eval & Docs</div>
            <ul className="text-[11px] text-slate-400 space-y-1 font-sans list-disc list-inside">
              <li>End-to-end integration test cases</li>
              <li>Architecture documentation</li>
              <li>Presentation slides & video script</li>
              <li>Deployment packaging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
