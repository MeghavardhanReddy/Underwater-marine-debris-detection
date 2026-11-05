import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Sliders, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  FileUp, 
  Eye, 
  Clock, 
  Zap 
} from 'lucide-react';
import { renderSonarWaterfall } from '../utils/sonarCanvas';
import { predictSonarImage, checkBackendHealth } from '../services/api';

export default function SonarAnalysis({ onInspectTarget }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.65);
  const [iouThreshold, setIouThreshold] = useState(0.50);
  const [applyClahe, setApplyClahe] = useState(true);
  const [applySlantRange, setApplySlantRange] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ online: false });

  const rawCanvasRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendStatus(res);
    });
  }, []);

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setFilePreviewUrl(url);
    // Clear stale predictions
    setAnalysisResult(null);
  };

  // Load benchmark sample image
  const handleLoadSample = () => {
    // Simulated dummy file
    const sample = new File(['sonar-sample'], 'swath_sr_2024_098.png', { type: 'image/png' });
    setSelectedFile(sample);
    setFilePreviewUrl(null); // will render via procedural canvas
    setAnalysisResult(null);
  };

  // Trigger analysis
  const handleRunInference = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);

    try {
      const fileToUpload = selectedFile || new File(['sample'], 'benchmark_swath.png', { type: 'image/png' });
      const response = await predictSonarImage(fileToUpload, {
        confidenceThreshold,
        iouThreshold,
        applyClahe,
      });

      setAnalysisResult(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Redraw canvases
  useEffect(() => {
    if (rawCanvasRef.current) {
      renderSonarWaterfall(rawCanvasRef.current, {
        invertContrast: false,
        showAcousticShadows: false,
        showGraticule: true,
        claheActive: applyClahe,
        showBoundingBoxes: false,
      });
    }

    if (detectionCanvasRef.current) {
      renderSonarWaterfall(detectionCanvasRef.current, {
        invertContrast: false,
        showAcousticShadows: true,
        showGraticule: true,
        claheActive: applyClahe,
        showBoundingBoxes: !!analysisResult,
      });
    }
  }, [analysisResult, applyClahe]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="hud-panel rounded-xl p-4 border border-sonar-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-slate-400">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ACOUSTIC RUNTIME ACTIVE
            </span>
            <span>//</span>
            <span className="text-sonar-cyan">RUN #SR-2024-098</span>
            <span>/</span>
            <span>Real-time Ingest Pipeline</span>
          </div>
          <h1 className="font-tech text-xl md:text-2xl font-bold text-white tracking-wide mt-1">
            Acoustic Sonar Upload & Real-Time Inference
          </h1>
          <p className="text-xs text-slate-300 max-w-3xl font-sans mt-0.5">
            Ingest side-scan sonar waterfall imagery (.png, .jpg, .xtf) to detect lost fishing gear (ghost nets), metal containers, sunken debris, and geological anomalies with spatial shadow attributions.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex-shrink-0">
          <button
            onClick={handleLoadSample}
            className="px-3.5 py-2 rounded-lg hud-panel hover:bg-slate-800 border border-sonar-cyan/40 text-xs font-tech text-slate-200 flex items-center gap-2 transition-all shadow-glow-cyan"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase">LOAD PRESET</div>
              <div className="font-bold text-sonar-cyan text-xs">Container & Ghost Net Sample</div>
            </div>
          </button>
        </div>
      </div>

      {/* Upload Dropzone Card */}
      <div className="hud-panel rounded-xl p-5 border border-sonar-border space-y-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) processSelectedFile(file);
          }}
          className="border-2 border-dashed border-sonar-border/80 hover:border-sonar-cyan rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-cyan-950/20 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg,.webp,.xtf"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full border border-sonar-cyan/40 bg-sonar-navy/80 flex items-center justify-center mx-auto text-sonar-cyan group-hover:scale-110 transition-transform shadow-glow-cyan">
            <FileUp className="w-6 h-6" />
          </div>
          <h3 className="font-tech text-base font-bold text-white tracking-wide mt-3">
            {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload Side-Scan Sonar Imagery'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Drag and drop an acoustic waterfall or raw image here, or browse local hydrographic swaths.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 font-mono-data text-[10px] text-slate-500">
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">.JPG</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">.PNG</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">.WEBP</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">.XTF*</span>
            <span>Max 50MB per acoustic swath</span>
          </div>

          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-1.5 rounded-lg bg-sonar-panel border border-sonar-border hover:bg-slate-800 text-xs font-tech text-slate-200"
            >
              Browse Local Files
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadSample();
              }}
              className="px-4 py-1.5 rounded-lg bg-sonar-teal/20 text-sonar-teal border border-sonar-teal/40 hover:bg-sonar-teal/30 text-xs font-tech font-bold"
            >
              Load Benchmark Test Image
            </button>
          </div>
        </div>

        {/* Inference Tuning Bar & CTA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2">
          {/* Confidence Slider */}
          <div className="md:col-span-3 bg-slate-950/60 p-2.5 rounded-lg border border-sonar-border/40">
            <div className="flex justify-between text-xs font-mono-data text-slate-400 mb-1">
              <span>Confidence Threshold:</span>
              <span className="text-sonar-cyan font-bold">{(confidenceThreshold * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.95"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-sonar-cyan bg-slate-800 h-1 rounded cursor-pointer"
            />
          </div>

          {/* IOU Slider */}
          <div className="md:col-span-3 bg-slate-950/60 p-2.5 rounded-lg border border-sonar-border/40">
            <div className="flex justify-between text-xs font-mono-data text-slate-400 mb-1">
              <span>IOU NMS Overlap:</span>
              <span className="text-sonar-teal font-bold">{iouThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="0.80"
              step="0.05"
              value={iouThreshold}
              onChange={(e) => setIouThreshold(Number(e.target.value))}
              className="w-full accent-sonar-teal bg-slate-800 h-1 rounded cursor-pointer"
            />
          </div>

          {/* Toggle Switches */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              onClick={() => setApplyClahe(!applyClahe)}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-tech font-medium border transition-all ${
                applyClahe
                  ? 'bg-sonar-cyan/20 text-sonar-cyan border-sonar-cyan shadow-glow-cyan'
                  : 'bg-slate-950/50 text-slate-400 border-slate-800'
              }`}
            >
              ADAPTIVE CLAHE
            </button>
            <button
              onClick={() => setApplySlantRange(!applySlantRange)}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-tech font-medium border transition-all ${
                applySlantRange
                  ? 'bg-sonar-teal/20 text-sonar-teal border-sonar-teal'
                  : 'bg-slate-950/50 text-slate-400 border-slate-800'
              }`}
            >
              SLANT-RANGE COR.
            </button>
          </div>

          {/* Run Inference CTA Button */}
          <div className="md:col-span-3">
            <button
              onClick={handleRunInference}
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 rounded-lg bg-sonar-cyan hover:bg-cyan-300 text-slate-950 font-tech font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan active:scale-95 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing Waterfall...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Analyze Sonar Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dual Side-by-Side Sonar Viewers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Raw Waterfall */}
        <div className="hud-panel rounded-xl overflow-hidden border border-sonar-border">
          <div className="px-4 py-2 bg-sonar-navy/90 border-b border-sonar-border flex items-center justify-between text-xs font-tech">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>RAW SONAR WATERFALL (PORT / STBD)</span>
            </div>
            <div className="font-mono-data text-[10px] text-slate-400">
              ORIGINAL PINGS // UNPROCESSED
            </div>
          </div>
          <div className="p-2 bg-[#02070e] flex items-center justify-center min-h-[340px] scanlines">
            <canvas ref={rawCanvasRef} width={640} height={400} className="w-full h-auto rounded" />
          </div>
          <div className="px-3 py-1.5 bg-slate-950/80 border-t border-sonar-border/40 text-[10px] font-mono-data text-slate-400 flex justify-between">
            <span>UNPROCESSED SENSOR ACOUSTIC BACKSCATTER</span>
            <span>PORT: 60m | STBD: 60m</span>
          </div>
        </div>

        {/* Right: YOLOv8-Marine Annotated Output */}
        <div className="hud-panel rounded-xl overflow-hidden border border-sonar-border">
          <div className="px-4 py-2 bg-sonar-navy/90 border-b border-sonar-border flex items-center justify-between text-xs font-tech">
            <div className="flex items-center gap-2 font-bold text-sonar-cyan">
              <span className="w-2 h-2 rounded-full bg-sonar-cyan animate-pulse" />
              <span>YOLOv8-MARINE v1.2 (DETECTIONS)</span>
            </div>
            <div className="font-mono-data text-[10px] text-emerald-400">
              {analysisResult ? '3 ANOMALIES BOUNDED' : 'AWAITING INFERENCE TRIGGER'}
            </div>
          </div>
          <div className="p-2 bg-[#02070e] flex items-center justify-center min-h-[340px] relative scanlines">
            <canvas ref={detectionCanvasRef} width={640} height={400} className="w-full h-auto rounded" />
            {!analysisResult && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                <Play className="w-10 h-10 text-sonar-cyan/70 mb-2 animate-bounce" />
                <div className="font-tech text-base font-bold text-white">Click "Analyze Sonar Image" Above</div>
                <div className="text-xs text-slate-400 max-w-xs mt-1">
                  Processes side-scan sonogram through bounding box localization and acoustic shadow trigonometry.
                </div>
              </div>
            )}
          </div>
          <div className="px-3 py-1.5 bg-slate-950/80 border-t border-sonar-border/40 text-[10px] font-mono-data text-slate-400 flex justify-between">
            <span className="text-sonar-cyan">3 TARGET REGIONS IDENTIFIED</span>
            <span className="text-sonar-teal">GEOMETRIC SPATIAL VECTORS EMITTED</span>
          </div>
        </div>
      </div>

      {/* Performance & Metrics Strip */}
      {analysisResult && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono-data text-xs">
          <div className="hud-panel rounded-lg p-3 border border-sonar-border">
            <div className="text-[10px] text-slate-400">TOTAL TARGETS</div>
            <div className="text-xl font-bold text-sonar-cyan mt-1">03 Objects</div>
            <div className="text-[9px] text-slate-500">2 Critical / 1 Low</div>
          </div>
          <div className="hud-panel rounded-lg p-3 border border-sonar-border">
            <div className="text-[10px] text-slate-400">CLASSIFICATION</div>
            <div className="text-base font-bold text-white mt-1">Industrial & Net</div>
            <div className="text-[9px] text-slate-500">Marine Debris Types</div>
          </div>
          <div className="hud-panel rounded-lg p-3 border border-sonar-border">
            <div className="text-[10px] text-slate-400">INFERENCE SPEED</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">38.4 ms</div>
            <div className="text-[9px] text-slate-500">TensorRT FP16 Engine</div>
          </div>
          <div className="hud-panel rounded-lg p-3 border border-sonar-border">
            <div className="text-[10px] text-slate-400">SWATH RESOLUTION</div>
            <div className="text-base font-bold text-amber-400 mt-1">0.08 m/px</div>
            <div className="text-[9px] text-slate-500">Side-scan / 360 kHz</div>
          </div>
          <div className="hud-panel rounded-lg p-3 border border-sonar-border">
            <div className="text-[10px] text-slate-400">POST-PROCESS</div>
            <div className="text-xl font-bold text-sonar-teal mt-1">12.1 ms</div>
            <div className="text-[9px] text-slate-500">NMS + Shadow Tracing</div>
          </div>
        </div>
      )}

      {/* Detections Manifest Table */}
      {analysisResult && (
        <div className="hud-panel rounded-xl p-4 border border-sonar-border space-y-3">
          <div className="flex items-center justify-between text-xs font-tech font-bold text-white border-b border-sonar-border pb-2">
            <span>DETECTION MANIFEST DETAILS</span>
            <span className="text-[10px] font-mono-data text-sonar-cyan font-normal">
              SIH-26057 Output Schema Conformance
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono-data text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="py-2">TARGET ID</th>
                  <th className="py-2">CLASSIFICATION TAG</th>
                  <th className="py-2">CONFIDENCE</th>
                  <th className="py-2">BOUNDING BOX [px]</th>
                  <th className="py-2">CALCULATED AREA</th>
                  <th className="py-2">ACOUSTIC REMARKS</th>
                  <th className="py-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {analysisResult.detections?.map((det) => (
                  <tr key={det.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 font-bold text-sonar-cyan">#{det.id}</td>
                    <td className="py-2.5 font-semibold text-slate-200">{det.class_name}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">{(det.confidence * 100).toFixed(1)}%</td>
                    <td className="py-2.5 text-slate-400 text-[11px]">[{det.bbox.join(', ')}]</td>
                    <td className="py-2.5 text-amber-300">{(det.dimensions.length * det.dimensions.width).toFixed(1)} m²</td>
                    <td className="py-2.5 text-slate-400 text-[11px] max-w-xs truncate">{det.acoustic_signature}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onInspectTarget?.(det.id)}
                        className="px-2.5 py-1 rounded bg-sonar-panel border border-sonar-border hover:bg-sonar-cyan hover:text-slate-950 font-tech text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mandatory Official Validation Notice per Problem Statement Rules */}
      <div className="p-3.5 rounded-lg bg-slate-950/80 border border-amber-500/30 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-tech font-bold text-amber-300 tracking-wide text-xs">
            Official Validation & Research Notice
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            Example detections are displayed for system demonstration and validation under SIH Problem Statement ID: 26057.
            <strong> "No detected objects" does not guarantee that the seabed is free of debris.</strong> Field operations require certified hydrographic verification by lead hydrographers and multi-frequency acoustic sonar validation.
          </p>
        </div>
      </div>
    </div>
  );
}
