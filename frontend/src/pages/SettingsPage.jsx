import React, { useState, useEffect } from 'react';
import { Sliders, CheckCircle2, AlertCircle, RefreshCw, Server, Shield, Globe } from 'lucide-react';
import { API_BASE_URL, checkBackendHealth } from '../services/api';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [isChecking, setIsChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [mockModeActive, setMockModeActive] = useState(true);

  const testConnection = async () => {
    setIsChecking(true);
    const status = await checkBackendHealth();
    setHealthStatus(status);
    setIsChecking(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Banner */}
      <div className="hud-panel rounded-xl p-4 border border-sonar-border">
        <div className="flex items-center gap-2 text-xs font-mono-data text-slate-400">
          <span className="text-sonar-cyan font-bold">SYSTEM SETTINGS</span>
          <span>//</span>
          <span>API CONTRACT & ENVIRONMENT CONFIGURATION</span>
        </div>
        <h1 className="font-tech text-xl md:text-2xl font-bold text-white tracking-wide mt-1">
          Centralized Backend API & Pipeline Configuration
        </h1>
        <p className="text-xs text-slate-300 font-sans mt-0.5">
          Configure connection endpoints to Member 3's FastAPI inference service, adjust detection thresholds, or toggle calibrated offline demonstration mode.
        </p>
      </div>

      {/* Backend Connection Card */}
      <div className="hud-panel rounded-xl p-5 border border-sonar-border space-y-4">
        <div className="flex items-center justify-between border-b border-sonar-border pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-sonar-cyan" />
            <span className="font-tech text-sm font-bold text-white">FastAPI Service Endpoint</span>
          </div>
          <span className="text-[10px] font-mono-data text-slate-400">
            ENV: VITE_API_URL
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono-data text-slate-300 block mb-1.5">
              API Base URL:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-sonar-border rounded-lg px-3 py-2 text-xs font-mono-data text-slate-200 focus:outline-none focus:border-sonar-cyan"
                placeholder="http://localhost:8000"
              />
              <button
                onClick={testConnection}
                disabled={isChecking}
                className="px-4 py-2 rounded-lg bg-sonar-cyan text-slate-950 font-tech font-bold text-xs flex items-center gap-2 hover:bg-cyan-300 transition-all disabled:opacity-50"
              >
                {isChecking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                <span>Test Health</span>
              </button>
            </div>
          </div>

          {/* Health Status Result */}
          {healthStatus && (
            <div
              className={`p-3 rounded-lg border text-xs font-mono-data flex items-center justify-between ${
                healthStatus.online
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {healthStatus.online ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {healthStatus.online
                    ? `Backend Online (Model Loaded: ${healthStatus.modelLoaded ? 'YES' : 'NO'})`
                    : 'Backend Offline — Using Calibrated Synthetic Inspection Engine'}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold">
                {healthStatus.online ? 'CONNECTED' : 'DEMO MODE ACTIVE'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* API Contract Details */}
      <div className="hud-panel rounded-xl p-5 border border-sonar-border space-y-3">
        <div className="font-tech text-sm font-bold text-white border-b border-sonar-border pb-2">
          Documented Backend API Endpoints (Member 3 Contract)
        </div>

        <div className="space-y-2 font-mono-data text-xs">
          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">GET</span>
              <span className="text-slate-200">/health</span>
            </div>
            <span className="text-slate-400 text-[11px]">Returns health and model loaded status</span>
          </div>

          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-sonar-cyan text-[10px] font-bold">POST</span>
              <span className="text-slate-200">/predict</span>
            </div>
            <span className="text-slate-400 text-[11px]">Multipart form upload (file) returning BBoxes + telemetry</span>
          </div>
        </div>
      </div>
    </div>
  );
}
