/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIAgent, AIApprovalRequest } from '../types';
import { AgentModal } from './AgentModal';
import {
  Cpu,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ShieldCheck,
  TrendingUp,
  Play,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  FileQuestion,
  RefreshCw,
} from 'lucide-react';

export const CommandCentre: React.FC = () => {
  const {
    agents,
    approvals,
    executions,
    decideApproval,
    toggleAgentStatus,
    requestEmergencyStopAllAgents,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'approvals' | 'logs'>('matrix');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [inspectingAgent, setInspectingAgent] = useState<AIAgent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Overview metrics
  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const pausedAgents = agents.filter(a => a.status === 'paused').length;
  const emergencyStopped = agents.filter(a => a.status === 'emergency_stop').length;
  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const totalExecutionsCount = agents.reduce((acc, a) => acc + a.totalExecutions, 0);
  const estimatedCostUsd = ((totalExecutionsCount * 450) / 1000000 * 0.15).toFixed(2);

  const departments = [
    { id: 'all', label: 'All 15 Specialized Agents' },
    { id: 'A: Business Management', label: 'Dept A: Business' },
    { id: 'B: Patient Management', label: 'Dept B: Patient' },
    { id: 'C: Staff & Clinical Management', label: 'Dept C: Staff & Clinical' },
    { id: 'D: Finance & Marketing', label: 'Dept D: Finance & Marketing' },
    { id: 'E: Quality, Communication & Reporting', label: 'Dept E: Quality & Reporting' },
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesDept = selectedDepartment === 'all' || agent.department === selectedDepartment;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              X AI Command Centre
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              PRANKAX Orchestrator v4.2
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Centralized orchestration across all 15 specialized business, clinical, and financial agents.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          {currentUser.role === 'main_admin' && (
            <button
              onClick={requestEmergencyStopAllAgents}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Emergency Lockdown</span>
            </button>
          )}

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Agent Matrix ({totalAgents})
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'approvals'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Approval Centre</span>
              {pendingApprovals.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'logs'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Execution Logs
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Active Agents</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {activeAgents} <span className="text-xs font-sans font-normal text-slate-400">/ {totalAgents}</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            100% Core coverage
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {pendingApprovals.length}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Requires PRANKAX review
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Tasks Executed</span>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalExecutionsCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
            Avg 99.7% Success
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Latency Avg</span>
            <Cpu className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            295<span className="text-sm font-sans font-normal text-slate-400">ms</span>
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Gemini 3.8 Flash pipeline
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Est. AI Compute</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ${estimatedCostUsd}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Zero token overrun
          </span>
        </div>
      </div>

      {/* Main Tab 1: Agent Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {departments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedDepartment === dept.id
                      ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search agent or specialty..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 w-full sm:w-64"
            />
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAgents.map(agent => {
              const isEmergency = agent.status === 'emergency_stop';
              const isPaused = agent.status === 'paused';

              return (
                <div
                  key={agent.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs group"
                >
                  <div>
                    {/* Top Row: Code & Status Indicator */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {agent.code}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {agent.department.split(':')[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isEmergency
                              ? 'bg-rose-500'
                              : isPaused
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="text-[11px] font-medium capitalize text-slate-600 dark:text-slate-300">
                          {agent.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Agent Name & Role */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {agent.role}
                    </p>

                    {/* Responsibilities Sample */}
                    <div className="mt-3.5 space-y-1">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Primary Responsibilities
                      </p>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        {agent.responsibilities.slice(0, 2).map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                            <span className="text-sky-500 mt-0.5">•</span>
                            <span className="truncate">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Telemetry metadata */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>Model: {agent.model.replace('gemini-', 'gem-')}</span>
                      <span>{agent.totalExecutions} runs · {agent.avgLatencyMs}ms</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setInspectingAgent(agent)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current text-sky-400" />
                      <span>Execute / Configure</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Tab 2: Approval Centre */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Human-in-the-Loop Governance Board
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Main Admin PRANKAX must authorize sensitive AI actions (financial payouts, patient transfers, refunds, public social posts).
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
              {pendingApprovals.length} Pending Actions
            </span>
          </div>

          <div className="space-y-3">
            {approvals.map(appr => {
              const isPending = appr.status === 'pending';
              const isApproved = appr.status === 'approved';
              const isRejected = appr.status === 'rejected';

              return (
                <div
                  key={appr.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          {appr.id}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {appr.actionType.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                            appr.riskLevel === 'high'
                              ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {appr.riskLevel} Risk
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {appr.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {appr.description}
                      </p>

                      <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                        <span>Triggered by: <strong>{appr.agentName}</strong></span>
                        <span>·</span>
                        <span>Requested: {new Date(appr.requestedAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isPending ? (
                        currentUser.role === 'main_admin' ? (
                          <>
                            <button
                              onClick={() => decideApproval(appr.id, 'approved')}
                              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Authorize Action</span>
                            </button>
                            <button
                              onClick={() => decideApproval(appr.id, 'revision_requested', 'Need additional clinical justification.')}
                              className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                            >
                              Revise
                            </button>
                            <button
                              onClick={() => decideApproval(appr.id, 'rejected', 'Rejected by PRANKAX')}
                              className="px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                            Awaiting Main Admin (PRANKAX)
                          </span>
                        )
                      ) : (
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                              isApproved
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {appr.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">
                            By {appr.decisionBy} · {appr.decisionAt ? new Date(appr.decisionAt).toLocaleTimeString() : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Tab 3: Execution Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Deterministic Agent Activity Ledger
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Showing recent {executions.length} executions
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Timestamp</th>
                    <th className="px-4 py-3 font-semibold">Agent</th>
                    <th className="px-4 py-3 font-semibold">Task Objective</th>
                    <th className="px-4 py-3 font-semibold">Trigger</th>
                    <th className="px-4 py-3 font-semibold text-right">Latency</th>
                    <th className="px-4 py-3 font-semibold text-right">Tokens</th>
                    <th className="px-4 py-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {executions.map(exec => (
                    <tr key={exec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(exec.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {exec.agentName}
                      </td>
                      <td className="px-4 py-3 font-sans text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {exec.taskTitle}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {exec.triggerEvent}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400 tabular-nums">
                        {exec.executionTimeMs}ms
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400 tabular-nums">
                        {exec.tokensUsed}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                            exec.status === 'completed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {exec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inspector */}
      {inspectingAgent && (
        <AgentModal
          agent={inspectingAgent}
          onClose={() => setInspectingAgent(null)}
        />
      )}
    </div>
  );
};
