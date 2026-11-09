/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AIAgent } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Play,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Wrench,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AgentModalProps {
  agent: AIAgent;
  onClose: () => void;
}

export const AgentModal: React.FC<AgentModalProps> = ({ agent, onClose }) => {
  const { toggleAgentStatus, updateAgentModel, runAgentTask, currentUser } = useApp();
  const [taskPrompt, setTaskPrompt] = useState(
    getDefaultTaskPrompt(agent.id)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function getDefaultTaskPrompt(id: string): string {
    switch (id) {
      case 'agent_01':
        return 'Perform a real-time health check on all clinic appointments, revenue pacing, and active therapist workloads for today. Highlight operational risks and SLA compliance.';
      case 'agent_02':
        return 'Analyze patient retention across the North Metro vs South Coast cohorts. Compare return-to-care rates and identify underutilized service slots.';
      case 'agent_03':
        return 'Scan today’s 41 scheduled visits. Identify any home visits at risk of traffic delays and verify buffer intervals.';
      case 'agent_04':
        return 'Simulate handling a new patient inquiry for severe acute lumbar pain with numbness radiating down the left leg. Demonstrate clinical safety refusal to diagnose, provide service options, and guide them to urgent evaluation.';
      case 'agent_05':
        return 'Execute a patient record audit for missing emergency contacts or expired treatment consents across active rehabilitation cases.';
      case 'agent_06':
        return 'Verify the 48-hour schedule for therapist Dr. Alok Verma. Detect any overlapping clinic bookings and confirm transit buffers for home visits.';
      case 'agent_07':
        return 'Check the weekly caseload of all 3 therapists. Flag any therapist approaching the 35 visit/week threshold and recommend schedule balance.';
      case 'agent_08':
        return 'Evaluate optimal matching for a new patient in South Coast requesting in-home total knee replacement recovery with 100% specialty alignment.';
      case 'agent_09':
        return 'Structure a sample clinical assessment into standard APTA SOAP notes: Patient with rotator cuff tendinitis, painful arc 70-110 deg, Empty Can test positive, VAS 5/10. Include ROM, MMT grades, and Home Exercise Program.';
      case 'agent_10':
        return 'Calculate the monthly commission payout for Apex Health Partners LLC ($48,950 total revenue @ 15% rate) and verify transaction settlements.';
      case 'agent_11':
        return 'Draft an educational Instagram post on Post-Surgical Knee Replacement: First 14 Days at Home with evidence-based tips and hashtags.';
      case 'agent_12':
        return 'Analyze 3 incoming inquiries from the past 24 hours. Classify lead readiness, identify best service fit, and suggest optimal follow-up timing.';
      case 'agent_13':
        return 'Analyze latest post-session patient feedback sentiment across both partner clinics. Flag any minor complaints or documentation gaps.';
      case 'agent_14':
        return 'Review WhatsApp appointment reminder queue for tomorrow’s home-visit patients. Confirm delivery consent and timezone scheduling.';
      case 'agent_15':
        return 'Generate an Executive Month-to-Date Performance Brief for Main Admin PRANKAX summarizing visits, revenue, therapist productivity, and agent uptime.';
      default:
        return 'Execute routine operational telemetry check.';
    }
  }

  const handleExecute = async () => {
    if (!taskPrompt.trim()) return;
    setIsRunning(true);
    setErrorMsg(null);
    setExecutionOutput(null);

    try {
      const result = await runAgentTask(agent.id, taskPrompt);
      setExecutionOutput(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs font-mono">
              {agent.code.replace('AGENT ', 'A')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {agent.name}
                </h3>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  [{agent.code}]
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {agent.department} · {agent.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            {/* Status Control */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Operational Status
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleAgentStatus(agent.id, 'active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    agent.status === 'active'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => toggleAgentStatus(agent.id, 'paused')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    agent.status === 'paused'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Paused
                </button>
                {currentUser.role === 'main_admin' && (
                  <button
                    onClick={() => toggleAgentStatus(agent.id, 'emergency_stop')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      agent.status === 'emergency_stop'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-rose-600 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                    }`}
                  >
                    Emergency Stop
                  </button>
                )}
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Assigned AI Model
              </label>
              <select
                value={agent.model}
                onChange={e => updateAgentModel(agent.id, e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Active · Recommended)</option>
                <option value="gemini-4-argon">Google Gemini 4 Argon (Deep Reasoning)</option>
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (Provider Layer)</option>
                <option value="gpt-4o">OpenAI GPT-4o (Provider Layer)</option>
              </select>
            </div>
          </div>

          {/* Responsibilities & Tools Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-900 dark:text-white">
                <Layers className="w-4 h-4 text-sky-500" />
                <span>Core Responsibilities</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {agent.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-sky-500 mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <Wrench className="w-4 h-4 text-emerald-500" />
                  <span>Authorized Tools & Capabilities</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.tools.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Requires PRANKAX Approval For</span>
                </div>
                {agent.requiresApprovalFor.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {agent.requiresApprovalFor.map((appr, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60"
                      >
                        {appr}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Standard autonomous execution within policy bounds.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Live Task Execution Console */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Execute Agent Task via Server-Side Gemini API
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Model: {agent.model}
              </span>
            </div>

            <textarea
              value={taskPrompt}
              onChange={e => setTaskPrompt(e.target.value)}
              rows={3}
              placeholder="Enter task directive for this agent..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Total lifetime executions: <strong className="tabular-nums font-mono">{agent.totalExecutions}</strong> · Success: <strong className="tabular-nums font-mono">{agent.successRate}%</strong>
              </span>

              <button
                onClick={handleExecute}
                disabled={isRunning || agent.status === 'emergency_stop'}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 disabled:opacity-50 flex items-center gap-2 transition-all shadow-sm"
              >
                {isRunning ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing on Server...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Task Now</span>
                  </>
                )}
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            {executionOutput && (
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 mt-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Execution Output Received
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {executionOutput}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
