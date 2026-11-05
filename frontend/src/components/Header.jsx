import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  Clock, 
  Upload, 
  User, 
  Radio, 
  CheckCircle2, 
  Edit3 
} from 'lucide-react';

export default function Header({ 
  onQuickUploadClick, 
  backendStatus, 
  userProfile = {},
  onOpenProfileModal 
}) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      const ms = String(now.getUTCMilliseconds()).padStart(3, '0');
      setUtcTime(`${h}:${m}:${s}.${ms} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex-shrink-0 w-full z-40 hud-panel border-b border-sonar-border px-4 py-2.5 flex items-center justify-between gap-4">
      {/* Left Branding */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-lg border border-sonar-cyan/40 bg-sonar-navy/80 flex items-center justify-center shadow-glow-cyan">
          <Radar className="w-6 h-6 text-sonar-cyan animate-pulse-subtle" />
          <div className="absolute inset-0 rounded-lg border border-sonar-cyan/20 animate-ping-slow" />
        </div>
        <div>
          <span className="font-tech text-xl font-bold tracking-wider text-white">MARINE AI</span>
          <div className="text-[11px] font-mono-data tracking-widest text-slate-400">
            TAC-SUBSEA SUITE // SSS ANOMALY DETECTOR
          </div>
        </div>
      </div>

      {/* Center Telemetry */}
      <div className="hidden xl:flex items-center gap-2.5">
        <div className="hud-badge px-2.5 py-1 rounded text-xs flex items-center gap-2 font-mono-data">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">HYDRO-LINK:</span>
          <span className="text-emerald-300 font-semibold">LIVE</span>
        </div>

        <div className="hud-badge px-2.5 py-1 rounded text-xs flex items-center gap-2 font-mono-data">
          <Radio className="w-3.5 h-3.5 text-sonar-cyan animate-pulse" />
          <span className="text-slate-300">CH-04 ACOUSTIC:</span>
          <span className="text-sonar-cyan font-semibold">360 kHz ACTIVE</span>
        </div>

        <div className="hud-badge px-2.5 py-1 rounded text-xs flex items-center gap-2 font-mono-data">
          <Clock className="w-3.5 h-3.5 text-sonar-teal" />
          <span className="text-slate-300">SYNC:</span>
          <span className="text-sonar-teal font-semibold tabular-nums">{utcTime}</span>
        </div>

        <div className="px-2 py-1 rounded text-xs flex items-center gap-1.5 font-mono-data border border-slate-700 bg-slate-900/60">
          {backendStatus?.online ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">FastAPI Online</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping-slow" />
              <span className="text-amber-300">Calibrated Demo Engine</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Upload + Profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onQuickUploadClick}
          className="px-3.5 py-1.5 rounded-md bg-sonar-cyan text-slate-950 font-tech font-bold text-xs tracking-wider flex items-center gap-2 hover:bg-cyan-300 transition-colors shadow-glow-cyan active:scale-95"
        >
          <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Upload Sonar Raw (.xtf/.png)</span>
        </button>

        <button
          onClick={onOpenProfileModal}
          title="Edit profile"
          className="hidden md:flex items-center gap-2.5 pl-3 border-l border-sonar-border hover:bg-slate-800/40 px-2 py-1 rounded-lg transition-colors group"
        >
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-200 group-hover:text-white flex items-center justify-end gap-1">
              <span>{userProfile.name || 'Lead Hydrographer'}</span>
              <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-sonar-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-[10px] font-mono-data text-sonar-cyan">
              {userProfile.role || 'R&D Mission Lead'}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-sonar-cyan/40 bg-cyan-950/60 flex items-center justify-center text-sonar-cyan overflow-hidden group-hover:border-sonar-cyan">
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
