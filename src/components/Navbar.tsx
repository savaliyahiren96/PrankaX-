/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  ShieldAlert,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  UserCheck,
  Building2,
  Stethoscope,
  User as UserIcon,
  RotateCcw,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isDark,
  setIsDark,
}) => {
  const { currentUser, switchUser, users, approvals, resetToInitialDemoData } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  const navLinks = [
    { id: 'command_centre', label: 'AI Command Centre', badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined },
    { id: 'admin_hub', label: 'Admin Authority', roleLimit: ['main_admin', 'partner', 'team_head'] },
    { id: 'appointments', label: 'Appointments' },
    { id: 'clinical', label: 'Clinical SOAP', roleLimit: ['main_admin', 'partner', 'team_head', 'physiotherapist'] },
    { id: 'financials', label: 'Financials', roleLimit: ['main_admin', 'partner'] },
    { id: 'marketing', label: 'Leads & Marketing', roleLimit: ['main_admin', 'partner'] },
    { id: 'patient_portal', label: 'Patient Portal' },
  ];

  const visibleLinks = navLinks.filter(link => {
    if (!link.roleLimit) return true;
    return link.roleLimit.includes(currentUser.role);
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'main_admin':
        return <UserCheck className="w-3.5 h-3.5 text-sky-500" />;
      case 'partner':
        return <Building2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'team_head':
      case 'physiotherapist':
        return <Stethoscope className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <UserIcon className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const getRoleBadgeLabel = (role: string) => {
    switch (role) {
      case 'main_admin':
        return 'Main Admin (PRANKAX)';
      case 'partner':
        return 'Partner Director';
      case 'team_head':
        return 'Team Lead';
      case 'physiotherapist':
        return 'Physiotherapist';
      default:
        return 'Patient';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('command_centre')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Activity className="w-5 h-5 text-sky-400 dark:text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  X Physiotherapy Services
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase font-mono">
                  X AI OS · Enterprise
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {visibleLinks.map(link => {
              const active = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Role Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Demo Reset */}
            <button
              onClick={resetToInitialDemoData}
              title="Reset to Initial Demo State"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    getRoleIcon(currentUser.role)
                  )}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[110px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                    {getRoleBadgeLabel(currentUser.role)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRoleDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Switch Authority Persona
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Test strict role-based access & permissions
                      </p>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-0.5">
                      {users.map(u => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                            currentUser.id === u.id
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                            {u.avatarUrl ? (
                              <img
                                src={u.avatarUrl}
                                alt={u.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              getRoleIcon(u.role)
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium text-slate-900 dark:text-white truncate">
                              {u.name}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {getRoleBadgeLabel(u.role)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
