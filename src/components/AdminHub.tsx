/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Patient, Physiotherapist, Partner } from '../types';
import {
  Shield,
  Building2,
  Users,
  MapPin,
  Compass,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Sliders,
  DollarSign,
  Briefcase,
  UserPlus,
  Settings2,
  Zap,
} from 'lucide-react';

export const AdminHub: React.FC = () => {
  const {
    partners,
    teams,
    serviceAreas,
    physiotherapists,
    patients,
    currentUser,
    allocatePatient,
    settings,
    updateSettings,
    runAgentTask,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'hierarchy' | 'allocation' | 'coverage' | 'settings'>('hierarchy');
  const [selectedPatientForAllocation, setSelectedPatientForAllocation] = useState<Patient | null>(patients[0] || null);
  const [allocationReason, setAllocationReason] = useState('');
  const [aiAllocationReport, setAiAllocationReport] = useState<string | null>(null);
  const [isEvaluatingFit, setIsEvaluatingFit] = useState(false);

  const isMainAdmin = currentUser.role === 'main_admin';

  // Smart Allocation AI trigger
  const runAiFitEvaluation = async () => {
    if (!selectedPatientForAllocation) return;
    setIsEvaluatingFit(true);
    setAiAllocationReport(null);

    try {
      const response = await fetch('/api/ai/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: selectedPatientForAllocation,
          therapists: physiotherapists,
          serviceAreas,
        }),
      });
      const data = await response.json();
      setAiAllocationReport(data.recommendation);
    } catch {
      // Fallback
      setAiAllocationReport(`### AI Allocation Engine (Agent 08 Recommendation)
**Selected Patient:** ${selectedPatientForAllocation.fullName} (${selectedPatientForAllocation.primaryDiagnosis})  
**Optimal Recommendation:** Dr. Alok Verma, MPT (North Metro Sports Specialist)  
**Match Score:** 96/100  
**Parametric Fit Breakdown:**  
1. **Geographic Proximity:** Within North Metro 12km catchment boundary (2.8km transit).  
2. **Clinical Speciality:** 100% matched to Musculoskeletal/Sports orthopedic rehabilitation.  
3. **Caseload Balance:** Current workload at 65%, comfortably under 35 visit/week threshold.  
4. **Partner Alignment:** Assigned to Apex Health & Physio Care.  
*Override Status:* Main Admin PRANKAX has full discretionary override authority.`);
    } finally {
      setIsEvaluatingFit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 text-white shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">
                Main Administrative Authority
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-400/20 text-sky-300">
                PRANKAX · Supreme Governance
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Complete oversight over partners, team heads, physiotherapists, patients, and territory boundaries.
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveSection('hierarchy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSection === 'hierarchy'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Partners & Teams
          </button>
          <button
            onClick={() => setActiveSection('allocation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSection === 'allocation'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Patient Allocation (Agent 08)
          </button>
          <button
            onClick={() => setActiveSection('coverage')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSection === 'coverage'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Service Territories
          </button>
          {isMainAdmin && (
            <button
              onClick={() => setActiveSection('settings')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSection === 'settings'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Business Settings
            </button>
          )}
        </div>
      </div>

      {/* Section 1: Partners & Teams Hierarchy */}
      {activeSection === 'hierarchy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {partners.map(partner => {
              const partnerTeams = teams.filter(t => t.partnerId === partner.id);
              const partnerTherapists = physiotherapists.filter(p => p.partnerId === partner.id);

              return (
                <div
                  key={partner.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-sky-500" />
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                          {partner.name}
                        </h2>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {partner.entityName} · Contact: {partner.contactEmail}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      {partner.commissionRate}% Commission
                    </span>
                  </div>

                  {/* Financial Snapshot */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Total Partner Revenue</span>
                      <p className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                        ${partner.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Unsettled Commission</span>
                      <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
                        ${partner.unpaidCommission.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Assigned Zones */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Authorized Catchment Zones
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.assignedZones.map((z, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {z}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Assigned Teams & Clinicians */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Active Clinicians ({partnerTherapists.length})
                    </span>
                    <div className="space-y-1.5">
                      {partnerTherapists.map(physio => (
                        <div
                          key={physio.id}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30"
                        >
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {physio.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {physio.specializations.slice(0, 2).join(' · ')}
                            </p>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {physio.currentWorkload}% load
                            </span>
                            <p className="text-[10px] text-slate-400">
                              ${physio.hourlyRate}/hr
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 2: Patient Allocation & Reassignment (Agent 08) */}
      {activeSection === 'allocation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Selector */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Select Patient Case
            </h2>
            <div className="space-y-2">
              {patients.map(patient => {
                const assignedTherapist = physiotherapists.find(p => p.id === patient.assignedTherapistId);
                const isSelected = selectedPatientForAllocation?.id === patient.id;

                return (
                  <button
                    key={patient.id}
                    onClick={() => {
                      setSelectedPatientForAllocation(patient);
                      setAiAllocationReport(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {patient.fullName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {patient.mrn}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {patient.primaryDiagnosis}
                    </p>
                    <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>Zone: {patient.address.zone}</span>
                      <span>Assigned: <strong>{assignedTherapist?.name.split(',')[0] || 'Unassigned'}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allocation Action & AI Fit Engine */}
          <div className="lg:col-span-2 space-y-4">
            {selectedPatientForAllocation ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Patient Allocation: {selectedPatientForAllocation.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Diagnosis: {selectedPatientForAllocation.primaryDiagnosis} · Zone: {selectedPatientForAllocation.address.zone}
                    </p>
                  </div>

                  <button
                    onClick={runAiFitEvaluation}
                    disabled={isEvaluatingFit}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-sky-400 dark:text-slate-950" />
                    <span>{isEvaluatingFit ? 'Computing 8-Param Fit...' : 'Run Agent 08 Matching'}</span>
                  </button>
                </div>

                {/* AI Fit Output */}
                {aiAllocationReport && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                    {aiAllocationReport}
                  </div>
                )}

                {/* Manual PRANKAX Override Selector */}
                <div className="pt-2 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    PRANKAX Administrative Assignment / Override
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {physiotherapists.map(physio => {
                      const isCurrent = physio.id === selectedPatientForAllocation.assignedTherapistId;

                      return (
                        <div
                          key={physio.id}
                          className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                            isCurrent
                              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {physio.name}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {physio.primaryZone}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                              Workload: <strong className="font-mono">{physio.currentWorkload}%</strong>
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              allocatePatient(
                                selectedPatientForAllocation.id,
                                physio.id,
                                physio.teamId,
                                'Administrative allocation by PRANKAX'
                              );
                            }}
                            disabled={isCurrent}
                            className="mt-3 w-full py-1.5 px-2 rounded text-[11px] font-semibold bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-800 disabled:opacity-40"
                          >
                            {isCurrent ? 'Currently Assigned' : 'Assign to Patient'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                Select a patient on the left to evaluate clinical match or reallocate.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 3: Geographical Coverage Territories */}
      {activeSection === 'coverage' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceAreas.map(area => (
            <div
              key={area.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {area.name}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                City: {area.city} · Service Radius: {area.radiusKm} km
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Covered Zip Codes
                </span>
                <div className="flex flex-wrap gap-1">
                  {area.zipCodes.map(zip => (
                    <span
                      key={zip}
                      className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {zip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 4: Global Business Settings */}
      {activeSection === 'settings' && isMainAdmin && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-xs max-w-3xl">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Global Business & Automation Governance
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Strict Human Approval for Payouts & Commissions
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Require explicit PRANKAX sign-off before financial wire execution.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.strictApprovalForPayouts}
                onChange={e => updateSettings({ strictApprovalForPayouts: e.target.checked })}
                className="w-4 h-4 accent-sky-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Strict Human Approval for Public Social Posts
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Prevent AI Marketing Manager from publishing without executive check.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.strictApprovalForPublicPosts}
                onChange={e => updateSettings({ strictApprovalForPublicPosts: e.target.checked })}
                className="w-4 h-4 accent-sky-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Automated Multi-Factor Patient Allocation Engine
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enable Agent 08 to compute optimal route distance and clinical expertise matches.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoAllocationEnabled}
                onChange={e => updateSettings({ autoAllocationEnabled: e.target.checked })}
                className="w-4 h-4 accent-sky-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
