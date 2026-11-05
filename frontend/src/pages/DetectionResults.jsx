import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  Send, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Sliders, 
  AlertTriangle, 
  Check, 
  Layers, 
  ShieldAlert, 
  Compass, 
  Activity 
} from 'lucide-react';
import { renderSonarWaterfall } from '../utils/sonarCanvas';

export default function DetectionResults() {
  const canvasRef = useRef(null);

  // Viewer state
  const [activeViewTab, setActiveViewTab] = useState('overlay'); // 'overlay' | 'raw' | 'heatmap'
  const [invertContrast, setInvertContrast] = useState(false);
  const [showAcousticShadows, setShowAcousticShadows] = useState(true);
  const [showGraticule, setShowGraticule] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedTargetId, setSelectedTargetId] = useState('DET-01');
  const [minConfidence, setMinConfidence] = useState(70);
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [isApproved, setIsApproved] = useState(false);

  // Targets manifest
  const targets = [
    {
      id: 'DET-01',
      className: 'Sunken Shipping Container',
      category: 'Metal Anomaly / Heavy Cargo',
      confidence: 94.2,
      confLevel: 'High Confidence',
      length: '6.1 m',
      lengthNote: '20ft ISO standard spec',
      width: '2.4 m',
      widthNote: 'Aspect match: 98.1%',
      shadow: '8.9 m',
      shadowNote: 'Vector Angle: 042° True',
      height: '2.6 m',
      heightNote: 'Trigonometric derivation',
      bbox: '[xmin: 582, ymin: 341, xmax: 772, ymax: 486]',
      volume: '38.06 m³',
      signature: 'Specular metallic reflection + sharp shadow',
      riskLevel: 'MODERATE HAZARD',
      riskDesc: 'Navigational snag hazard for bottom-trawling gear; potential marine cargo container leakage.',
      status: 'FOCUSED',
      shadowPhysics: '8.9m shadow (2.6m h)',
    },
    {
      id: 'DET-02',
      className: 'Ghost Fishing Net',
      category: 'Synthetic Polymer Hazard',
      confidence: 88.7,
      confLevel: 'High Confidence',
      length: '8.4 m',
      lengthNote: 'Entangled mass bundle',
      width: '4.2 m',
      widthNote: 'Transverse spread',
      shadow: '4.1 m',
      shadowNote: 'Diffuse shadow boundary',
      height: '0.9 m',
      heightNote: 'Low seabed relief',
      bbox: '[xmin: 480, ymin: 290, xmax: 610, ymax: 410]',
      volume: '15.20 m³',
      signature: 'High diffuse acoustic backscatter + fibrous tangle',
      riskLevel: 'HIGH BIOLOGICAL HAZARD',
      riskDesc: 'Active ghost-fishing entanglement hazard for marine life and benthic habitats.',
      status: 'VERIFIED',
      shadowPhysics: 'High diffuse backscatter',
    },
    {
      id: 'DET-03',
      className: 'Debris Cluster',
      category: 'Metallic & Silt Anomaly',
      confidence: 71.4,
      confLevel: 'Moderate Confidence',
      length: '2.1 m',
      lengthNote: 'Fragmented profile',
      width: '1.8 m',
      widthNote: 'Scattered footprint',
      shadow: '2.3 m',
      shadowNote: 'Irregular attenuation',
      height: '0.8 m',
      heightNote: 'Partially buried',
      bbox: '[xmin: 680, ymin: 480, xmax: 750, ymax: 560]',
      volume: '3.02 m³',
      signature: 'Patchy irregular shadow + scattered speckle',
      riskLevel: 'LOW HAZARD',
      riskDesc: 'Submerged metallic debris or pipe ballast fragment; safe clearance margin.',
      status: 'PENDING',
      shadowPhysics: 'Patchy irregular shadow',
    },
  ];

  const currentTarget = targets.find((t) => t.id === selectedTargetId) || targets[0];

  // Draw procedural sonar waterfall
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderSonarWaterfall(canvas, {
      invertContrast,
      showAcousticShadows,
      showGraticule,
      claheActive: activeViewTab === 'heatmap',
      showBoundingBoxes: activeViewTab === 'overlay',
      selectedDetectionId: selectedTargetId,
      zoom: zoomLevel / 100,
    });
  }, [activeViewTab, invertContrast, showAcousticShadows, showGraticule, zoomLevel, selectedTargetId]);

  return (
    <div className="space-y-4">
      {/* Sub-bar / Breadcrumbs & Global Run Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2 border-b border-sonar-border/50">
        <div>
          <div className="text-[11px] font-mono-data text-slate-400 flex items-center gap-2">
            <span>SONAR RUNS</span>
            <span>/</span>
            <span className="text-sonar-cyan font-semibold">RUN #SR-2024-098</span>
            <span>/</span>
            <span className="text-slate-300">DETAILED INSPECTION</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="font-tech text-xl md:text-2xl font-bold tracking-wide text-white">
              Acoustic Detection Records & Granular Analysis
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono-data px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              SYNTHETIC APERTURE MODE ACTIVE
            </span>
          </div>
        </div>

        {/* Action button toolbar */}
        <div className="flex flex-wrap items-center gap-2 font-tech text-xs">
          <button
            onClick={() => alert('Exporting structured geo-referenced JSON detections payload...')}
            className="px-3 py-1.5 rounded hud-panel hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-sonar-cyan" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => alert('Downloading calibrated GeoTIFF bathymetry swath...')}
            className="px-3 py-1.5 rounded hud-panel hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-sonar-teal" />
            <span>Download GeoTIFF</span>
          </button>
          <button
            onClick={() => alert('Generating Hydrographic Inspection Survey PDF Report...')}
            className="px-3 py-1.5 rounded hud-panel hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Survey PDF</span>
          </button>
          <button
            onClick={() => alert('Run queued for Lead Hydrographer dual verification.')}
            className="px-3 py-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send To Human Queue</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2-column layout (Viewer + Inspection Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 cols): Sonar Image Viewer + Waveform */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="hud-panel rounded-xl overflow-hidden border border-sonar-border">
            {/* Viewer Header Tabs & Telemetry */}
            <div className="px-4 py-2.5 bg-sonar-navy/90 border-b border-sonar-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-sonar-border/50">
                <button
                  onClick={() => setActiveViewTab('overlay')}
                  className={`px-3 py-1 rounded text-xs font-tech font-medium transition-all ${
                    activeViewTab === 'overlay'
                      ? 'bg-sonar-cyan text-slate-950 font-bold shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Acoustic Overlay
                </button>
                <button
                  onClick={() => setActiveViewTab('raw')}
                  className={`px-3 py-1 rounded text-xs font-tech font-medium transition-all ${
                    activeViewTab === 'raw'
                      ? 'bg-sonar-cyan text-slate-950 font-bold shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Raw Sonogram
                </button>
                <button
                  onClick={() => setActiveViewTab('heatmap')}
                  className={`px-3 py-1 rounded text-xs font-tech font-medium transition-all ${
                    activeViewTab === 'heatmap'
                      ? 'bg-sonar-cyan text-slate-950 font-bold shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bathymetric Heatmap
                </button>
              </div>

              <div className="text-xs font-mono-data text-slate-300 flex items-center gap-3">
                <span>FREQ: <strong className="text-sonar-cyan">360 kHz</strong></span>
                <span className="text-slate-600">|</span>
                <span>SWATH: <strong className="text-sonar-teal">120m</strong></span>
              </div>
            </div>

            {/* Canvas Viewer Container */}
            <div className="relative bg-[#02070e] flex items-center justify-center p-2 min-h-[440px] overflow-hidden scanlines">
              <canvas
                ref={canvasRef}
                width={840}
                height={520}
                className="w-full max-w-full h-auto rounded border border-sonar-border/30 shadow-2xl transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              />

              {/* Watermark / Scale Ratio Overlays */}
              <div className="absolute bottom-4 left-5 pointer-events-none font-mono-data text-[10px] text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded border border-amber-400/30 flex items-center gap-2">
                <span>SCALE RATIO:</span>
                <span className="inline-block w-8 h-1 bg-amber-400 rounded-sm" />
                <span>10m</span>
              </div>

              <div className="absolute bottom-4 right-5 pointer-events-none font-mono-data text-[10px] text-sonar-cyan bg-slate-950/80 px-2.5 py-1 rounded border border-sonar-cyan/30">
                MAGNIFICATION: {zoomLevel}%
              </div>
            </div>

            {/* Viewer Control Toolbar */}
            <div className="px-4 py-2.5 bg-sonar-navy/80 border-t border-sonar-border flex flex-wrap items-center justify-between gap-3 text-xs font-tech">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(180, z + 15))}
                  className="p-1.5 rounded hud-panel hover:bg-slate-800 text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4 text-sonar-cyan" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                  className="p-1.5 rounded hud-panel hover:bg-slate-800 text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4 text-sonar-cyan" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 rounded hud-panel hover:bg-slate-800 text-slate-300"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInvertContrast(!invertContrast)}
                  className={`px-3 py-1.5 rounded border transition-all ${
                    invertContrast
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                      : 'hud-panel text-slate-300 border-sonar-border hover:bg-slate-800'
                  }`}
                >
                  Invert Contrast
                </button>
                <button
                  onClick={() => setShowAcousticShadows(!showAcousticShadows)}
                  className={`px-3 py-1.5 rounded border transition-all ${
                    showAcousticShadows
                      ? 'bg-sonar-cyan text-slate-950 font-bold border-cyan-300'
                      : 'hud-panel text-slate-300 border-sonar-border hover:bg-slate-800'
                  }`}
                >
                  Acoustic Shadows
                </button>
                <button
                  onClick={() => setShowGraticule(!showGraticule)}
                  className={`px-3 py-1.5 rounded border font-mono-data text-xs ${
                    showGraticule
                      ? 'bg-sonar-teal text-slate-950 font-bold'
                      : 'hud-panel text-slate-400'
                  }`}
                >
                  Graticule: {showGraticule ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      document.documentElement.requestFullscreen();
                    }
                  }}
                  className="p-1.5 rounded hud-panel hover:bg-slate-800 text-slate-300"
                >
                  <Maximize2 className="w-4 h-4 text-sonar-cyan" />
                </button>
              </div>
            </div>

            {/* Real-Time Hydrographic Telemetry Bar */}
            <div className="px-4 py-2 bg-slate-950/90 border-t border-sonar-border/40 text-[11px] font-mono-data flex flex-wrap items-center justify-between gap-4 text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">LAT:</span>
                <span className="text-sonar-cyan">14°18'22.4"N</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500">LON:</span>
                <span className="text-sonar-cyan">74°29'08.1"E</span>
              </div>
              <div className="flex items-center gap-4">
                <span>SEABED DEPTH: <strong className="text-emerald-400">48.5 m</strong></span>
                <span>SALINITY: <strong className="text-cyan-300">35.0 PSU</strong></span>
                <span>TEMP: <strong className="text-amber-300">22.4°C</strong></span>
              </div>
            </div>
          </div>

          {/* Bottom Graph: Acoustic Backscatter Density Profiler */}
          <div className="hud-panel rounded-xl p-4 border border-sonar-border">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-sonar-border/40">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="font-tech text-xs tracking-wider text-slate-200 uppercase font-bold">
                  ACOUSTIC BACKSCATTER DENSITY PROFILER (CROSS-SWATH PING)
                </span>
              </div>
              <div className="text-[11px] font-mono-data text-slate-400">
                RECEIVE BEAMS: <span className="text-sonar-cyan font-bold">256 CH</span>
              </div>
            </div>

            {/* SVG Waveform Chart with Peak Return */}
            <div className="relative h-28 w-full bg-slate-950/80 rounded-lg p-2 border border-slate-800 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 600 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="backscatterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#00f2fe" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="25" x2="600" y2="25" stroke="rgba(0,242,254,0.1)" strokeDasharray="4 4" />
                <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(0,242,254,0.1)" strokeDasharray="4 4" />
                <line x1="0" y1="75" x2="600" y2="75" stroke="rgba(0,242,254,0.1)" strokeDasharray="4 4" />

                {/* Waveform curve with peak return at beam 140 (~x=330) */}
                <path
                  d="M 0 78 Q 60 76 120 75 T 220 73 Q 270 70 300 45 Q 325 15 340 18 Q 360 25 385 88 Q 420 90 480 80 T 600 78 L 600 100 L 0 100 Z"
                  fill="url(#backscatterGrad)"
                />
                <path
                  d="M 0 78 Q 60 76 120 75 T 220 73 Q 270 70 300 45 Q 325 15 340 18 Q 360 25 385 88 Q 420 90 480 80 T 600 78"
                  fill="none"
                  stroke="#00f2fe"
                  strokeWidth="2.5"
                />

                {/* Peak Return Highlight */}
                <circle cx="335" cy="17" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
              </svg>

              {/* Peak Return Indicator Callout Badge */}
              <div className="absolute top-2 right-8 font-mono-data text-[10px] text-amber-300 bg-amber-950/70 border border-amber-400/40 px-2 py-0.5 rounded shadow-glow-gold">
                PEAK RET: +28.4 dB @ BEAM 140
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Detailed Selected Object Inspector & Swath Index */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Selected Object Detail Card */}
          <div className="hud-panel rounded-xl p-4 border border-sonar-border space-y-3.5">
            {/* Header info */}
            <div className="flex items-center justify-between pb-2 border-b border-sonar-border">
              <div className="flex items-center gap-1.5 text-xs font-mono-data text-sonar-cyan">
                <span className="w-2 h-2 rounded-full bg-sonar-cyan animate-pulse" />
                <span>SELECTED OBJECT: #{currentTarget.id}</span>
              </div>
              <div className="hud-badge-teal px-2 py-0.5 rounded text-[11px] font-mono-data font-bold">
                {currentTarget.confidence}% CONF
              </div>
            </div>

            <div>
              <h2 className="font-tech text-lg font-bold text-white tracking-wide">
                {currentTarget.className}
              </h2>
              <div className="text-xs font-mono-data text-slate-400">
                Category: {currentTarget.category}
              </div>
            </div>

            {/* 4-Box Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-data">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-sonar-border/40">
                <div className="text-[10px] text-slate-400 uppercase">ESTIMATED LENGTH</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{currentTarget.length}</div>
                <div className="text-[9px] text-slate-500">{currentTarget.lengthNote}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-sonar-border/40">
                <div className="text-[10px] text-slate-400 uppercase">ESTIMATED WIDTH</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{currentTarget.width}</div>
                <div className="text-[9px] text-slate-500">{currentTarget.widthNote}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-sonar-border/40">
                <div className="text-[10px] text-slate-400 uppercase">ACOUSTIC SHADOW</div>
                <div className="text-base font-bold text-sonar-cyan mt-0.5">{currentTarget.shadow}</div>
                <div className="text-[9px] text-slate-500">{currentTarget.shadowNote}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-sonar-border/40">
                <div className="text-[10px] text-slate-400 uppercase">REL. HEIGHT OFF SEABED</div>
                <div className="text-base font-bold text-sonar-cyan mt-0.5">{currentTarget.height}</div>
                <div className="text-[9px] text-slate-500">{currentTarget.heightNote}</div>
              </div>
            </div>

            {/* Deep physical telemetry rows */}
            <div className="space-y-1.5 text-[11px] font-mono-data bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">SPATIAL EXTENT (PX):</span>
                <span className="text-amber-300 font-semibold">{currentTarget.bbox}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ESTIMATED VOLUME:</span>
                <span className="text-slate-200">{currentTarget.volume}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-400 flex-shrink-0">ACOUSTIC SIGNATURE:</span>
                <span className="text-sonar-teal text-right text-[10px]">{currentTarget.signature}</span>
              </div>
            </div>

            {/* Risk Assessment Box */}
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs">
              <div className="flex items-center gap-1.5 font-tech text-amber-300 font-bold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>RISK ASSESSMENT: {currentTarget.riskLevel}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {currentTarget.riskDesc}
              </p>
            </div>

            {/* Review Status & Approval Button */}
            <div className="pt-1 flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono-data">REVIEW STATUS:</div>
                <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-medium">
                  <span className={`w-2 h-2 rounded-full ${isApproved ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                  <span>{isApproved ? 'Approved by Hydrographer' : 'Pending Marine Sign-off'}</span>
                </div>
              </div>
              <button
                onClick={() => setIsApproved(!isApproved)}
                className={`px-3 py-1.5 rounded font-tech text-xs font-bold transition-all ${
                  isApproved
                    ? 'bg-emerald-500 text-slate-950 shadow-glow-teal'
                    : 'bg-sonar-cyan text-slate-950 hover:bg-cyan-300 shadow-glow-cyan'
                }`}
              >
                {isApproved ? 'Record Verified' : 'Approve Record'}
              </button>
            </div>
          </div>

          {/* Target Manifest Filters */}
          <div className="hud-panel rounded-xl p-3.5 border border-sonar-border space-y-3">
            <div className="flex items-center justify-between text-xs font-tech font-bold text-slate-200 border-b border-sonar-border pb-1.5">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sonar-cyan" /> TARGET MANIFEST FILTERS
              </span>
              <span className="text-[10px] font-mono-data text-sonar-teal font-normal">
                3 Targets in Swath
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-data">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">TARGET CLASS</label>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="w-full bg-slate-950/80 border border-sonar-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-sonar-cyan"
                >
                  <option value="all">Metals & Containers</option>
                  <option value="nets">Ghost Nets & Ropes</option>
                  <option value="debris">Debris & Ballast</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">SORT BY</label>
                <select className="w-full bg-slate-950/80 border border-sonar-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-sonar-cyan">
                  <option>Confidence (High to Low)</option>
                  <option>Shadow Length (Max to Min)</option>
                  <option>Estimated Height</option>
                </select>
              </div>
            </div>

            {/* Slider */}
            <div>
              <div className="flex justify-between text-[10px] font-mono-data text-slate-400 mb-1">
                <span>MIN INFERENCE CONFIDENCE:</span>
                <span className="text-amber-400 font-bold">{minConfidence}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 rounded h-1 cursor-pointer"
              />
            </div>
          </div>

          {/* Swath Manifest Index Table */}
          <div className="hud-panel rounded-xl p-3.5 border border-sonar-border space-y-2">
            <div className="flex items-center justify-between text-xs font-tech font-bold text-slate-200 border-b border-sonar-border pb-1.5">
              <span>SWATH MANIFEST INDEX</span>
              <span className="text-[10px] font-mono-data text-emerald-400 font-normal">
                3 POSITIVE DETECTIONS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-mono-data text-left">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="py-1">ID</th>
                    <th className="py-1">CLASS</th>
                    <th className="py-1">CONF.</th>
                    <th className="py-1">SHADOW / PHYSICS</th>
                    <th className="py-1 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {targets.map((tgt) => {
                    const isSelected = selectedTargetId === tgt.id;
                    return (
                      <tr
                        key={tgt.id}
                        onClick={() => setSelectedTargetId(tgt.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/40 text-white'
                            : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-2 text-sonar-cyan font-semibold">#{tgt.id}</td>
                        <td className="py-2">
                          <div className="font-medium text-slate-200">{tgt.className}</div>
                        </td>
                        <td className="py-2 text-emerald-400 font-bold">{tgt.confidence}%</td>
                        <td className="py-2 text-[10px] text-slate-400">{tgt.shadowPhysics}</td>
                        <td className="py-2 text-right">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950'
                                : tgt.status === 'VERIFIED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isSelected ? 'FOCUSED' : tgt.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
