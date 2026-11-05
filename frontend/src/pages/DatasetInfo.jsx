import React from 'react';
import { Database, ShieldAlert, CheckCircle2, Layers, AlertTriangle, FileCode } from 'lucide-react';

export default function DatasetInfo() {
  const classes = [
    { name: 'Sunken Containers', code: 'CLASS_01', type: 'Heavy Cargo / Anomaly', color: 'text-sonar-cyan', samples: 740 },
    { name: 'Ghost Fishing Nets', code: 'CLASS_02', type: 'Synthetic Entanglement', color: 'text-sonar-teal', samples: 912 },
    { name: 'Tires & Rubber', code: 'CLASS_03', type: 'Industrial Scrap', color: 'text-amber-400', samples: 515 },
    { name: 'Pipelines & Cables', code: 'CLASS_04', type: 'Subsea Infrastructure', color: 'text-sky-400', samples: 390 },
    { name: 'Natural Reef Outcrops', code: 'CLASS_05', type: 'Geological Baseline', color: 'text-emerald-400', samples: 650 },
  ];

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="hud-panel rounded-xl p-4 border border-sonar-border">
        <div className="flex items-center gap-2 text-xs font-mono-data text-slate-400">
          <span className="text-sonar-cyan font-bold">ACOUSTIC DATASET INVENTORY</span>
          <span>//</span>
          <span>SIDE-SCAN SONAR (SSS) BENCHMARK</span>
        </div>
        <h1 className="font-tech text-xl md:text-2xl font-bold text-white tracking-wide mt-1">
          Dataset Specifications & Hydrographic Ground Truth
        </h1>
        <p className="text-xs text-slate-300 max-w-3xl font-sans mt-0.5">
          Per SIH 26057 requirements, all training datasets must derive from authentic side-scan sonar transducers. Standard optical RGB photographs of marine debris are non-equivalent and excluded from training.
        </p>
      </div>

      {/* Dataset Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono-data">
        <div className="hud-panel rounded-xl p-3.5 border border-sonar-border">
          <div className="text-[10px] text-slate-400">TOTAL SONAR SWATHS</div>
          <div className="text-2xl font-bold text-sonar-cyan mt-1">3,207</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Dual-frequency swaths</div>
        </div>

        <div className="hud-panel rounded-xl p-3.5 border border-sonar-border">
          <div className="text-[10px] text-slate-400">TRANSDUCER FREQUENCIES</div>
          <div className="text-2xl font-bold text-sonar-teal mt-1">360 / 900 kHz</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Dual-frequency sonar</div>
        </div>

        <div className="hud-panel rounded-xl p-3.5 border border-sonar-border">
          <div className="text-[10px] text-slate-400">ANNOTATION FORMAT</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">YOLO BBox + Shadow</div>
          <div className="text-[10px] text-slate-500 mt-0.5">2D Bounding Box + Vector</div>
        </div>

        <div className="hud-panel rounded-xl p-3.5 border border-sonar-border">
          <div className="text-[10px] text-slate-400">DATA SPLIT RATIO</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">70 / 15 / 15</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Survey-sequence separated</div>
        </div>
      </div>

      {/* Class Distribution Table */}
      <div className="hud-panel rounded-xl p-4 border border-sonar-border space-y-3">
        <div className="flex items-center justify-between border-b border-sonar-border pb-2 text-xs font-tech font-bold text-white">
          <span>TARGET CLASS INVENTORY & ANNOTATION POLICY</span>
          <span className="text-[10px] font-mono-data text-sonar-cyan">5 Defined Classes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono-data text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                <th className="py-2">CLASS NAME</th>
                <th className="py-2">IDENTIFIER</th>
                <th className="py-2">DEBRIS CATEGORY</th>
                <th className="py-2">ANNOTATED INSTANCES</th>
                <th className="py-2 text-right">ACOUSTIC SIGNATURE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {classes.map((c) => (
                <tr key={c.code} className="hover:bg-slate-800/40 transition-colors">
                  <td className={`py-2.5 font-bold ${c.color}`}>{c.name}</td>
                  <td className="py-2.5 text-slate-400">{c.code}</td>
                  <td className="py-2.5 text-slate-300">{c.type}</td>
                  <td className="py-2.5 text-white font-semibold">{c.samples} samples</td>
                  <td className="py-2.5 text-right text-[11px] text-slate-400">
                    Specular return + elongated acoustic shadow
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Leakage Avoidance Rule */}
      <div className="p-4 rounded-xl hud-panel border border-sonar-border space-y-2">
        <div className="flex items-center gap-2 text-xs font-tech font-bold text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>DATA LEAKAGE MITIGATION POLICY</span>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Because side-scan sonar waterfall pings are captured consecutively along linear vessel survey tracks, randomly splitting individual pings between train and test causes severe spatial autocorrelation leakage.
          All splits are strictly segregated by <strong>distinct geographic survey legs and seabed topography zones</strong>.
        </p>
      </div>
    </div>
  );
}
