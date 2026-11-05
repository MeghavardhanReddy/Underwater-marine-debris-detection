import React, { useState } from 'react';
import { 
  Workflow, 
  Cpu, 
  Layers, 
  Activity, 
  Cloud, 
  ShieldCheck, 
  UserCheck, 
  RefreshCw, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';

export default function SystemWorkflow() {
  const [activeNode, setActiveNode] = useState(null);

  const pipelineColumns = [
    {
      step: '01 ACQN',
      color: 'border-sonar-cyan text-sonar-cyan',
      nodes: [
        {
          id: 'n1',
          code: 'NODE 1.1',
          title: 'Acoustic Sonar Acquisition',
          desc: 'Side-Scan Sonar Towfish/AUV acoustic telemetry stream (XTF / JSF format).',
          details: 'Ingests high-frequency dual-ping raw hydrographic hydrophone arrays with pitch, roll, and heave compensation.',
        },
        {
          id: 'n2',
          code: 'NODE 1.2',
          title: 'Dataset Validation & Cleaning',
          desc: 'Checksum verification, dropped ping triage, and format sanitization.',
          details: 'Rejects corrupted headers, validates sonar swath resolutions, and eliminates saturated transducer bursts.',
        },
      ],
    },
    {
      step: '02 PREPROCESSING',
      color: 'border-sonar-teal text-sonar-teal',
      nodes: [
        {
          id: 'n3',
          code: 'NODE 2.1',
          title: 'Slant-Range & Despeckling',
          desc: 'Nadir altitude normalization and Rayleigh speckle adaptive filter.',
          details: 'Transforms slant-range geometry into true horizontal ground range based on towfish altitude above seafloor.',
        },
        {
          id: 'n4',
          code: 'NODE 2.2',
          title: 'Adaptive Contrast (CLAHE)',
          desc: 'Contrast-limited adaptive histogram equalization for acoustic shadows.',
          details: 'Enhances faint acoustic shadow margins without over-amplifying background sandy dune backscatter noise.',
        },
      ],
    },
    {
      step: '03 PARTITIONING',
      color: 'border-sky-400 text-sky-400',
      nodes: [
        {
          id: 'n5',
          code: 'NODE 3.1',
          title: 'Expert Annotation & CVAT',
          desc: 'Multi-class polygon acoustic tagging of debris, containers, and ghost nets.',
          details: 'Enforces distinct bounding box annotations for high-backscatter target highlight and outward acoustic shadow.',
        },
        {
          id: 'n6',
          code: 'NODE 3.2',
          title: 'Stratified Train / Val Split',
          desc: 'Seafloor topography-balanced data loader avoiding survey leg leakage.',
          details: 'Groups pings from the same survey track together to eliminate spatial correlation data leakage.',
        },
      ],
    },
    {
      step: '04 ML INFERENCE',
      color: 'border-emerald-400 text-emerald-400',
      nodes: [
        {
          id: 'n7',
          code: 'NODE 4.1',
          title: 'YOLOv8-Marine Engine',
          desc: 'CSPDarknet backbone with multiscale SPPF head optimized for sonar.',
          details: 'Quantized with TensorRT FP16 for real-time edge execution on AUV embedded compute modules.',
        },
        {
          id: 'n8',
          code: 'NODE 4.2',
          title: 'Shadow & Height Estimator',
          desc: 'Triangulates physical marine debris height off seabed via acoustic trigonometry.',
          details: 'Calculates physical relief using the formula: H_obj = (L_shadow * H_towfish) / R_slant.',
        },
      ],
    },
    {
      step: '05 SERVING / APP',
      color: 'border-blue-400 text-blue-400',
      nodes: [
        {
          id: 'n9',
          code: 'NODE 5.1',
          title: 'FastAPI Async Inference',
          desc: 'REST API + WebSocket ping streaming with strict OpenAPI schemas.',
          details: 'Handles multipart uploads, asynchronous model queueing, and structured bounding box JSON responses.',
        },
        {
          id: 'n10',
          code: 'NODE 5.2',
          title: 'React Scientific Dashboard',
          desc: 'Tactical marine HUD with bounding box overlays, telemetry, and 3D effects.',
          details: 'Provides lead hydrographers with high-contrast inspection, backscatter density profiles, and audit controls.',
        },
      ],
    },
    {
      step: '06 HUMAN LOOP',
      color: 'border-amber-400 text-amber-400',
      nodes: [
        {
          id: 'n11',
          code: 'NODE 6.1',
          title: 'Marine Hydrographer Review',
          desc: 'Expert verification & false positive triage prior to salvage dispatch.',
          details: 'Allows certified human surveyors to approve detections, adjust bounds, or log false positives for mining.',
        },
        {
          id: 'n12',
          code: 'NODE 6.2',
          title: 'Model Retraining & Active Loop',
          desc: 'Hard example mining feedback cycle for continuous model enhancement.',
          details: 'High-uncertainty pings are automatically flagged, packaged, and scheduled for continuous model retraining.',
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="hud-panel rounded-xl p-4 border border-sonar-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-slate-400">
            <span className="text-sonar-cyan font-bold">SYSTEM WORKFLOW ARCHITECTURE</span>
            <span>//</span>
            <span>SIH-26057 END-TO-END PIPELINE</span>
          </div>
          <h1 className="font-tech text-xl md:text-2xl font-bold text-white tracking-wide mt-1">
            End-to-End System Workflow Architecture
          </h1>
          <p className="text-xs text-slate-300 max-w-3xl font-sans mt-0.5">
            Comprehensive pipeline from raw side-scan acoustic acquisition, despeckling preprocessing, deep learning inference, to human validation and cloud synchronization.
          </p>
        </div>

        {/* Legend Chips */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono-data">
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-sonar-cyan border border-sonar-cyan/40">
            Data Engine
          </span>
          <span className="px-2 py-0.5 rounded bg-teal-950/80 text-sonar-teal border border-sonar-teal/40">
            Preprocessing
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-500/40">
            Serving / App
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/40">
            Human in Loop
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Cloud Sync (Optional)
          </span>
        </div>
      </div>

      {/* Towfish Operational Status Card */}
      <div className="hud-panel rounded-xl p-4 border border-sonar-border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-sonar-cyan/40 flex items-center justify-center text-sonar-cyan flex-shrink-0 shadow-glow-cyan">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono-data text-sonar-cyan font-bold">
              DUAL-FREQUENCY SIDE-SCAN SONAR TOWFISH ACTIVE
            </div>
            <div className="text-xs text-slate-300 font-sans max-w-2xl mt-0.5">
              Input bathymetry feed operating at 360 kHz / 900 kHz resolution. Processing acoustic shadow projections for automated volumetric debris height deduction.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 font-mono-data text-xs">
          <div className="text-right">
            <div className="text-[10px] text-slate-400">INFERENCE ACCURACY</div>
            <div className="text-base font-bold text-emerald-400">94.8% mAP@0.5</div>
          </div>
          <div className="text-right border-l border-slate-700 pl-4">
            <div className="text-[10px] text-slate-400">SYSTEM LATENCY</div>
            <div className="text-base font-bold text-sonar-cyan">43.7 ms (Real-time)</div>
          </div>
        </div>
      </div>

      {/* Interactive 6-Column Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {pipelineColumns.map((col, colIdx) => (
          <div key={col.step} className="space-y-3">
            {/* Column Header */}
            <div className={`text-xs font-tech font-bold pb-1.5 border-b-2 ${col.color} flex items-center justify-between`}>
              <span>{col.step}</span>
              <span className="text-[9px] font-mono-data text-slate-500">0{colIdx + 1}</span>
            </div>

            {/* Nodes */}
            <div className="space-y-2.5">
              {col.nodes.map((node) => {
                const isSelected = activeNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNode(isSelected ? null : node)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-sonar-cyan shadow-glow-cyan scale-[1.02]'
                        : 'hud-panel hover:border-sonar-border-bright border-sonar-border'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono-data mb-1">
                      <span className="text-slate-400">{node.code}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-sonar-cyan/70" />
                    </div>
                    <div className="font-tech text-xs font-bold text-white tracking-wide">
                      {node.title}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1 font-sans leading-snug">
                      {node.desc}
                    </div>

                    {isSelected && (
                      <div className="mt-2.5 pt-2 border-t border-sonar-border/50 text-[10px] text-sonar-cyan font-mono-data bg-slate-950/60 p-1.5 rounded">
                        {node.details}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Optional Cloud Synchronization Module per Functional Req B */}
      <div className="hud-panel rounded-xl p-4 border border-dashed border-slate-700 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cloud className="w-6 h-6 text-slate-400 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech text-xs font-bold text-slate-200">
                GCP Object Storage & Fleet-Scale Synchronization
              </span>
              <span className="text-[9px] font-mono-data px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                OPTIONAL CLOUD MODULE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans mt-0.5">
              Edge nodes operate 100% offline at sea. When satellite or shore uplink connects, batched events and verified model checkpoints synchronize seamlessly.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-data text-slate-400">
          <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
            GCS Data Bucket: <span className="text-slate-200">gs://sih-26057-archive/</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Grid: Latency Profiler & Hydrodynamic Physics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latency Profiler (6 cols) */}
        <div className="hud-panel rounded-xl p-4 border border-sonar-border space-y-3">
          <div className="flex items-center justify-between border-b border-sonar-border pb-2">
            <span className="font-tech text-xs font-bold text-white tracking-wider">
              LATENCY PROFILER (EDGE JETSON ORIN)
            </span>
            <span className="text-[10px] font-mono-data text-sonar-cyan">TOTAL: 43.7 ms</span>
          </div>

          {/* Breakdown progress bar */}
          <div className="h-3 w-full rounded bg-slate-950 overflow-hidden flex">
            <div className="bg-cyan-500 h-full" style={{ width: '10%' }} title="Ingestion: 4.2ms" />
            <div className="bg-teal-500 h-full" style={{ width: '35%' }} title="Slant-Range & CLAHE: 15.2ms" />
            <div className="bg-amber-400 h-full" style={{ width: '41%' }} title="YOLOv8 FP16: 18.1ms" />
            <div className="bg-blue-400 h-full" style={{ width: '8%' }} title="Shadow Trig: 3.4ms" />
            <div className="bg-emerald-400 h-full" style={{ width: '6%' }} title="Serialization: 2.8ms" />
          </div>

          <div className="space-y-1.5 text-[11px] font-mono-data">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500" /> Acoustic Ingestion & Validation
              </span>
              <span className="text-slate-400">4.2ms (10%)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" /> Slant-Range + CLAHE Preprocess
              </span>
              <span className="text-slate-400">15.2ms (35%)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> YOLOv8-Marine Forward Pass
              </span>
              <span className="text-amber-300 font-bold">18.1ms (41%)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Shadow Trigonometry & Target Vol.
              </span>
              <span className="text-slate-400">3.4ms (8%)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> WebSocket Serialization
              </span>
              <span className="text-slate-400">2.8ms (6%)</span>
            </div>
          </div>

          <div className="text-[10px] font-mono-data text-emerald-400 text-center pt-1">
            Real-time Capable: 22.8 FPS Real-time Sonar Processing
          </div>
        </div>

        {/* Hydrodynamic Physics: Shadow Height Deduction (6 cols) */}
        <div className="hud-panel rounded-xl p-4 border border-sonar-border space-y-3">
          <div className="flex items-center justify-between border-b border-sonar-border pb-2">
            <span className="font-tech text-xs font-bold text-amber-300 tracking-wider">
              SHADOW HEIGHT DEDUCTION (PHYSICS)
            </span>
            <span className="text-[10px] font-mono-data text-slate-400">TRIGONOMETRY</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-amber-500/30 text-center space-y-1">
            <div className="text-[10px] text-slate-400 font-mono-data uppercase">
              Geometric Formula Utilized by Node 4.2
            </div>
            <div className="text-lg font-bold font-mono-data text-amber-400 tracking-wider py-1">
              H_obj = (L_s × H_t) / R_s
            </div>
            <div className="grid grid-cols-3 gap-1 text-[9px] font-mono-data text-slate-400 pt-1 border-t border-slate-800">
              <div>L_s: Shadow Length</div>
              <div>H_t: Towfish Alt.</div>
              <div>R_s: Slant Range</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Side-scan sonar cannot measure vertical optical depth directly. By calculating the ratio of the acoustic shadow cast behind a sunken container relative to the towfish altitude, the system reliably deduces the true debris relief height off the seabed without active LiDAR.
          </p>

          <div className="p-2 rounded bg-cyan-950/40 border border-sonar-cyan/30 text-[10px] font-mono-data text-sonar-cyan">
            Container Calculation: (8.9m × 14.2m) / 48.5m = <strong>2.6m Verified Height</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
