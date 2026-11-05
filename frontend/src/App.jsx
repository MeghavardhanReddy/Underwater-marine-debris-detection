import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import UnderwaterBackground3D from './components/UnderwaterBackground3D';
import ProfileModal from './components/ProfileModal';
import Overview from './pages/Overview';
import SonarAnalysis from './pages/SonarAnalysis';
import DetectionResults from './pages/DetectionResults';
import ModelEvaluation from './pages/ModelEvaluation';
import SystemWorkflow from './pages/SystemWorkflow';
import DatasetInfo from './pages/DatasetInfo';
import SettingsPage from './pages/SettingsPage';
import { checkBackendHealth } from './services/api';
import { useEffect } from 'react';

const DEFAULT_PROFILE = {
  name: 'Lead Hydrographer',
  role: 'R&D Mission Lead',
  vessel: 'RV SAGAR NIDHI // CH-04',
  clearance: 'LEVEL 4 - SUBSEA SPECIALIST',
  avatarUrl: null,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('results');
  const [backendStatus, setBackendStatus] = useState({ online: false });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('marine_ai_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    checkBackendHealth().then(setBackendStatus);
  }, []);

  const handleSaveProfile = (updated) => {
    setUserProfile(updated);
    try { localStorage.setItem('marine_ai_user_profile', JSON.stringify(updated)); } catch {}
  };

  return (
    /*
      Simple full-height flex column.
      Header → fixed height row at top.
      Row below → sidebar + scrollable main, fills the remainder.
      The 3D canvas is position:fixed behind everything — it never participates in layout.
      Result: completely stable, zero reflow, zero gaps.
    */
    <div className="relative h-screen flex flex-col bg-[#020a13] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden">

      {/* 3D background — fixed, behind everything, does not affect layout */}
      <UnderwaterBackground3D />

      {/* Header — always visible, never moves, flex-shrink-0 */}
      <div className="relative z-40 flex-shrink-0">
        <Header
          onQuickUploadClick={() => setActiveTab('analysis')}
          backendStatus={backendStatus}
          userProfile={userProfile}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />
      </div>

      {/* Body row — fills remaining height, never shifts */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* Sidebar — fixed width, full height of this row */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main content — the ONLY scrollable element */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          {activeTab === 'overview'    && <Overview setActiveTab={setActiveTab} />}
          {activeTab === 'analysis'   && <SonarAnalysis onInspectTarget={() => setActiveTab('results')} />}
          {activeTab === 'results'    && <DetectionResults />}
          {activeTab === 'evaluation' && <ModelEvaluation />}
          {activeTab === 'workflow'   && <SystemWorkflow />}
          {activeTab === 'dataset'    && <DatasetInfo />}
          {activeTab === 'settings'   && <SettingsPage />}
        </main>
      </div>

      {/* Profile modal — portalled above all content */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
