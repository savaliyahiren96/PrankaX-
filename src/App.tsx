/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CommandCentre } from './components/CommandCentre';
import { AdminHub } from './components/AdminHub';
import { AppointmentsHub } from './components/AppointmentsHub';
import { ClinicalHub } from './components/ClinicalHub';
import { FinanceHub } from './components/FinanceHub';
import { MarketingHub } from './components/MarketingHub';
import { PatientPortal } from './components/PatientPortal';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('command_centre');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { currentUser } = useApp();

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-20 lg:pb-8">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'command_centre' && <CommandCentre />}
        {currentTab === 'admin_hub' && <AdminHub />}
        {currentTab === 'appointments' && <AppointmentsHub />}
        {currentTab === 'clinical' && <ClinicalHub />}
        {currentTab === 'financials' && <FinanceHub />}
        {currentTab === 'marketing' && <MarketingHub />}
        {currentTab === 'patient_portal' && <PatientPortal />}
      </main>

      {/* Mobile Touch Bottom Navigation (PWA ergonomics) */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              X Physiotherapy Services
            </span>
            <span>·</span>
            <span>X AI OS Business Platform</span>
            <span>·</span>
            <span>Main Admin: <strong>PRANKAX</strong></span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>15 Specialized AI Agents Active</span>
            <span>·</span>
            <span>HIPAA / APTA Clinical Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
