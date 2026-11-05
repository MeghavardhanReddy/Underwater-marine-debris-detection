import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  User, 
  Shield, 
  Anchor, 
  Check, 
  RotateCcw, 
  Upload, 
  Sparkles 
} from 'lucide-react';

const PRESET_AVATARS = [
  { id: 'sonar', label: 'Hydrographer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'commander', label: 'Subsea Commander', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'engineer', label: 'Robotics Specialist', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'scientist', label: 'Marine Geologist', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
];

export default function ProfileModal({ isOpen, onClose, profile, onSaveProfile }) {
  const [name, setName] = useState(profile.name || 'Lead Hydrographer');
  const [role, setRole] = useState(profile.role || 'R&D Mission Lead');
  const [vessel, setVessel] = useState(profile.vessel || 'RV SAGAR NIDHI // CH-04');
  const [clearance, setClearance] = useState(profile.clearance || 'LEVEL 4 - SUBSEA SPECIALIST');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      name,
      role,
      vessel,
      clearance,
      avatarUrl,
    };
    onSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setName('Lead Hydrographer');
    setRole('R&D Mission Lead');
    setVessel('RV SAGAR NIDHI // CH-04');
    setClearance('LEVEL 4 - SUBSEA SPECIALIST');
    setAvatarUrl(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg hud-panel-active rounded-2xl border border-sonar-cyan/40 p-6 shadow-glow-cyan-lg space-y-5 bg-[#041324]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sonar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sonar-cyan/20 border border-sonar-cyan/40 flex items-center justify-center text-sonar-cyan">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-tech text-base font-bold text-white tracking-wide">
                OPERATIONAL PERSONNEL PROFILE
              </h2>
              <div className="text-[10px] font-mono-data text-sonar-cyan">
                TACTICAL CREDENTIALS & MISSION ASSIGNMENT
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-5 p-3 rounded-xl bg-slate-950/60 border border-sonar-border/50">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full border-2 border-sonar-cyan/60 overflow-hidden bg-slate-900 flex items-center justify-center shadow-glow-cyan">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-sonar-cyan/70" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-sonar-cyan text-[10px] font-mono-data"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded bg-sonar-cyan hover:bg-cyan-300 text-slate-950 text-xs font-tech font-bold flex items-center gap-1.5 transition-all shadow-glow-cyan"
                >
                  <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Choose Photo</span>
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(null)}
                    className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-tech transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono-data">
                Supported formats: PNG, JPG, WebP. Max 5MB.
              </div>

              {/* Preset avatar shortcuts */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[9px] font-mono-data text-slate-500">Presets:</span>
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    className="w-6 h-6 rounded-full overflow-hidden border border-slate-700 hover:border-sonar-cyan hover:scale-110 transition-transform"
                    title={preset.label}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 font-mono-data text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                OPERATIONAL FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Lead Hydrographer"
                className="w-full bg-slate-950/80 border border-sonar-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sonar-cyan transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  TACTICAL ROLE / TITLE
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  placeholder="e.g. R&D Mission Lead"
                  className="w-full bg-slate-950/80 border border-sonar-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sonar-cyan transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  VESSEL / CALL SIGN
                </label>
                <input
                  type="text"
                  value={vessel}
                  onChange={(e) => setVessel(e.target.value)}
                  placeholder="e.g. RV SAGAR NIDHI // CH-04"
                  className="w-full bg-slate-950/80 border border-sonar-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sonar-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                CLEARANCE LEVEL
              </label>
              <select
                value={clearance}
                onChange={(e) => setClearance(e.target.value)}
                className="w-full bg-slate-950/80 border border-sonar-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sonar-cyan transition-colors"
              >
                <option value="LEVEL 4 - SUBSEA SPECIALIST">LEVEL 4 - SUBSEA SPECIALIST</option>
                <option value="LEVEL 5 - MISSION COMMANDER">LEVEL 5 - MISSION COMMANDER</option>
                <option value="LEVEL 3 - HYDROGRAPHIC ANALYST">LEVEL 3 - HYDROGRAPHIC ANALYST</option>
                <option value="LEVEL 2 - ROV PILOT">LEVEL 2 - ROV PILOT</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-sonar-border">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-lg text-xs font-tech text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-tech text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-sonar-cyan hover:bg-cyan-300 text-slate-950 font-tech font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan transition-all active:scale-95"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
