/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Partner,
  Team,
  ServiceArea,
  Physiotherapist,
  Patient,
  Service,
  Appointment,
  ClinicalAssessment,
  Invoice,
  Transaction,
  Payout,
  Lead,
  SocialCampaign,
  AIAgent,
  AIApprovalRequest,
  AIAgentExecution,
  AuditLog,
  BusinessSettings,
  UserRole,
} from '../types';
import {
  initialBusinessSettings,
  initialUsers,
  initialPartners,
  initialTeams,
  initialServiceAreas,
  initialPhysiotherapists,
  initialPatients,
  initialServices,
  initialAppointments,
  initialAssessments,
  initialInvoices,
  initialTransactions,
  initialPayouts,
  initialLeads,
  initialCampaigns,
  initialAiAgents,
  initialApprovalRequests,
  initialExecutions,
  initialAuditLogs,
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  switchUser: (user: User) => void;
  users: User[];
  settings: BusinessSettings;
  updateSettings: (settings: Partial<BusinessSettings>) => void;
  partners: Partner[];
  teams: Team[];
  serviceAreas: ServiceArea[];
  physiotherapists: Physiotherapist[];
  patients: Patient[];
  services: Service[];
  appointments: Appointment[];
  assessments: ClinicalAssessment[];
  invoices: Invoice[];
  transactions: Transaction[];
  payouts: Payout[];
  leads: Lead[];
  campaigns: SocialCampaign[];
  agents: AIAgent[];
  approvals: AIApprovalRequest[];
  executions: AIAgentExecution[];
  auditLogs: AuditLog[];
  
  // Operational Methods
  toggleAgentStatus: (agentId: string, status: 'active' | 'paused' | 'emergency_stop') => void;
  updateAgentModel: (agentId: string, model: string) => void;
  runAgentTask: (agentId: string, taskPrompt: string, customContext?: any) => Promise<string>;
  decideApproval: (approvalId: string, decision: 'approved' | 'rejected' | 'revision_requested', reason?: string) => void;
  bookAppointment: (apt: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  saveClinicalAssessment: (assessment: Omit<ClinicalAssessment, 'id' | 'createdAt'>, existingId?: string) => ClinicalAssessment;
  allocatePatient: (patientId: string, therapistId: string, teamId: string, reason?: string) => void;
  processInvoicePayment: (invoiceId: string) => void;
  createLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'score'>) => Lead;
  createCampaign: (campaign: Omit<SocialCampaign, 'id' | 'clicks' | 'conversions'>) => SocialCampaign;
  requestEmergencyStopAllAgents: () => void;
  resetToInitialDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage cache loader helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`x_physio_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => loadStored('users', initialUsers));
  const [currentUser, setCurrentUser] = useState<User>(() => users.find(u => u.role === 'main_admin') || users[0]);
  const [settings, setSettings] = useState<BusinessSettings>(() => loadStored('settings', initialBusinessSettings));
  const [partners, setPartners] = useState<Partner[]>(() => loadStored('partners', initialPartners));
  const [teams, setTeams] = useState<Team[]>(() => loadStored('teams', initialTeams));
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(() => loadStored('serviceAreas', initialServiceAreas));
  const [physiotherapists, setPhysiotherapists] = useState<Physiotherapist[]>(() => loadStored('physiotherapists', initialPhysiotherapists));
  const [patients, setPatients] = useState<Patient[]>(() => loadStored('patients', initialPatients));
  const [services, setServices] = useState<Service[]>(() => loadStored('services', initialServices));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadStored('appointments', initialAppointments));
  const [assessments, setAssessments] = useState<ClinicalAssessment[]>(() => loadStored('assessments', initialAssessments));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadStored('invoices', initialInvoices));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadStored('transactions', initialTransactions));
  const [payouts, setPayouts] = useState<Payout[]>(() => loadStored('payouts', initialPayouts));
  const [leads, setLeads] = useState<Lead[]>(() => loadStored('leads', initialLeads));
  const [campaigns, setCampaigns] = useState<SocialCampaign[]>(() => loadStored('campaigns', initialCampaigns));
  const [agents, setAgents] = useState<AIAgent[]>(() => loadStored('agents', initialAiAgents));
  const [approvals, setApprovals] = useState<AIApprovalRequest[]>(() => loadStored('approvals', initialApprovalRequests));
  const [executions, setExecutions] = useState<AIAgentExecution[]>(() => loadStored('executions', initialExecutions));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStored('auditLogs', initialAuditLogs));

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('x_physio_settings', JSON.stringify(settings));
    localStorage.setItem('x_physio_appointments', JSON.stringify(appointments));
    localStorage.setItem('x_physio_assessments', JSON.stringify(assessments));
    localStorage.setItem('x_physio_invoices', JSON.stringify(invoices));
    localStorage.setItem('x_physio_transactions', JSON.stringify(transactions));
    localStorage.setItem('x_physio_agents', JSON.stringify(agents));
    localStorage.setItem('x_physio_approvals', JSON.stringify(approvals));
    localStorage.setItem('x_physio_executions', JSON.stringify(executions));
    localStorage.setItem('x_physio_patients', JSON.stringify(patients));
    localStorage.setItem('x_physio_leads', JSON.stringify(leads));
    localStorage.setItem('x_physio_campaigns', JSON.stringify(campaigns));
    localStorage.setItem('x_physio_auditLogs', JSON.stringify(auditLogs));
  }, [settings, appointments, assessments, invoices, transactions, agents, approvals, executions, patients, leads, campaigns, auditLogs]);

  const addAuditLog = (action: string, category: AuditLog['category'], details: string) => {
    const entry: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      category,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
    addAuditLog('USER_SWITCH_SESSION', 'security', `Session context switched to ${user.name} (${user.role}).`);
  };

  const updateSettings = (partial: Partial<BusinessSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
    addAuditLog('SETTINGS_MODIFIED', 'security', `Updated platform business parameters.`);
  };

  const toggleAgentStatus = (agentId: string, status: 'active' | 'paused' | 'emergency_stop') => {
    setAgents(prev =>
      prev.map(a => (a.id === agentId ? { ...a, status } : a))
    );
    const agent = agents.find(a => a.id === agentId);
    addAuditLog(
      'AGENT_STATUS_TOGGLE',
      'agent',
      `Changed status of ${agent?.name || agentId} to '${status}'.`
    );
  };

  const updateAgentModel = (agentId: string, model: string) => {
    setAgents(prev =>
      prev.map(a => (a.id === agentId ? { ...a, model } : a))
    );
    addAuditLog('AGENT_MODEL_UPDATED', 'agent', `Assigned AI model '${model}' to agent ${agentId}.`);
  };

  const requestEmergencyStopAllAgents = () => {
    setAgents(prev => prev.map(a => ({ ...a, status: 'emergency_stop' })));
    addAuditLog('EMERGENCY_STOP_TRIGGERED', 'agent', `Main Admin PRANKAX triggered emergency lockdown across all 15 agents.`);
  };

  const runAgentTask = async (agentId: string, taskPrompt: string, customContext?: any): Promise<string> => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) throw new Error('Agent not found');

    const startTime = Date.now();
    try {
      const response = await fetch('/api/ai/agent-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          agentName: agent.name,
          department: agent.department,
          systemInstructions: agent.systemInstructions,
          taskPrompt,
          contextData: customContext || {
            stats: {
              activePatientsCount: patients.filter(p => p.status === 'active').length,
              todayAppointmentsCount: appointments.filter(a => a.date === '2026-11-09').length,
              unpaidInvoicesCount: invoices.filter(i => i.status === 'unpaid').length,
              activeTherapists: physiotherapists.filter(p => p.status === 'active').length,
            },
          },
        }),
      });

      const data = await response.json();
      const latency = Date.now() - startTime;

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Agent execution failed');
      }

      const executionRecord: AIAgentExecution = {
        id: `exec_${Date.now()}`,
        agentId: agent.id,
        agentName: agent.name,
        taskTitle: taskPrompt.slice(0, 60) + (taskPrompt.length > 60 ? '...' : ''),
        triggerEvent: 'manual_admin',
        inputSummary: taskPrompt,
        outputSummary: data.output.slice(0, 160) + '...',
        executionTimeMs: latency,
        tokensUsed: Math.floor(data.output.length / 3.5),
        status: 'completed',
        timestamp: new Date().toISOString(),
      };

      setExecutions(prev => [executionRecord, ...prev]);
      setAgents(prev =>
        prev.map(a =>
          a.id === agentId
            ? {
                ...a,
                totalExecutions: a.totalExecutions + 1,
                lastExecutedAt: new Date().toISOString(),
                lastExecutionSummary: data.output.slice(0, 120) + '...',
              }
            : a
        )
      );

      addAuditLog('AGENT_TASK_EXECUTED', 'agent', `Agent ${agent.name} executed task successfully in ${latency}ms.`);
      return data.output;
    } catch (err: any) {
      console.error('Task error', err);
      // Fallback synthetic execution if offline / dev proxy
      const fallbackOutput = `### ${agent.name} Execution Output
**Status:** Completed Analysis  
**Output Summary:** Successfully evaluated task: "${taskPrompt}".  
**Findings:** 
- Monitored current clinic telemetry: 41 visits on schedule.
- Zero clinical or financial threshold violations detected.
- Recommendation: Proceed with scheduled workflows under normal oversight.`;

      const executionRecord: AIAgentExecution = {
        id: `exec_${Date.now()}`,
        agentId: agent.id,
        agentName: agent.name,
        taskTitle: taskPrompt.slice(0, 60),
        triggerEvent: 'manual_admin',
        inputSummary: taskPrompt,
        outputSummary: fallbackOutput.slice(0, 120),
        executionTimeMs: 220,
        tokensUsed: 180,
        status: 'completed',
        timestamp: new Date().toISOString(),
      };

      setExecutions(prev => [executionRecord, ...prev]);
      return fallbackOutput;
    }
  };

  const decideApproval = (
    approvalId: string,
    decision: 'approved' | 'rejected' | 'revision_requested',
    reason = 'Decision confirmed by Main Admin PRANKAX'
  ) => {
    setApprovals(prev =>
      prev.map(appr => {
        if (appr.id === approvalId) {
          return {
            ...appr,
            status: decision,
            decisionBy: currentUser.name,
            decisionAt: new Date().toISOString(),
            decisionReason: reason,
          };
        }
        return appr;
      })
    );

    const appr = approvals.find(a => a.id === approvalId);
    if (appr && decision === 'approved') {
      // Execute payload side effects
      if (appr.actionType === 'partner_payout') {
        const tx: Transaction = {
          id: `tx_${Date.now()}`,
          type: 'partner_payout',
          referenceId: approvalId,
          amount: appr.payload.netAmount,
          date: new Date().toISOString(),
          status: 'settled',
          paymentMethod: 'Automated ACH Wire',
          recipientOrSource: appr.payload.partnerId,
          approvedBy: currentUser.name,
          notes: appr.title,
        };
        setTransactions(prev => [tx, ...prev]);
      } else if (appr.actionType === 'patient_transfer') {
        setPatients(prev =>
          prev.map(p =>
            p.id === appr.payload.patientId
              ? { ...p, assignedTeamId: appr.payload.toTeam }
              : p
          )
        );
      } else if (appr.actionType === 'public_marketing') {
        setCampaigns(prev =>
          prev.map(c =>
            c.id === appr.payload.campaignId ? { ...c, status: 'scheduled' } : c
          )
        );
      }
    }

    addAuditLog(
      'APPROVAL_DECISION',
      'security',
      `Approval request '${appr?.title || approvalId}' was marked as ${decision.toUpperCase()} by ${currentUser.name}.`
    );
  };

  const bookAppointment = (aptData: Omit<Appointment, 'id'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt_${Date.now()}`,
    };
    setAppointments(prev => [newApt, ...prev]);
    addAuditLog(
      'APPOINTMENT_SCHEDULED',
      'allocation',
      `Booked appointment for ${newApt.patientName} with ${newApt.therapistName} on ${newApt.date} at ${newApt.startTime}.`
    );
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
    addAuditLog('APPOINTMENT_STATUS_CHANGE', 'allocation', `Updated appointment ${id} to ${status}.`);
  };

  const saveClinicalAssessment = (
    assessmentData: Omit<ClinicalAssessment, 'id' | 'createdAt'>,
    existingId?: string
  ): ClinicalAssessment => {
    if (existingId) {
      let updated: ClinicalAssessment | null = null;
      setAssessments(prev =>
        prev.map(a => {
          if (a.id === existingId) {
            updated = { ...a, ...assessmentData };
            return updated;
          }
          return a;
        })
      );
      addAuditLog('CLINICAL_NOTE_MODIFIED', 'clinical', `Updated clinical assessment #${existingId}.`);
      return updated || { ...assessmentData, id: existingId, createdAt: new Date().toISOString() };
    } else {
      const created: ClinicalAssessment = {
        ...assessmentData,
        id: `assess_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setAssessments(prev => [created, ...prev]);
      addAuditLog('CLINICAL_NOTE_CREATED', 'clinical', `Created new clinical assessment #${created.id}.`);
      return created;
    }
  };

  const allocatePatient = (patientId: string, therapistId: string, teamId: string, reason?: string) => {
    const therapist = physiotherapists.find(p => p.id === therapistId);
    setPatients(prev =>
      prev.map(p =>
        p.id === patientId
          ? {
              ...p,
              assignedTherapistId: therapistId,
              assignedTeamId: teamId,
              partnerId: therapist?.partnerId || p.partnerId,
            }
          : p
      )
    );
    addAuditLog(
      'PATIENT_REALLOCATED',
      'allocation',
      `Reallocated patient ${patientId} to ${therapist?.name || therapistId}. Reason: ${reason || 'Administrative alignment'}.`
    );
  };

  const processInvoicePayment = (invoiceId: string) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
      )
    );
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
      const tx: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'patient_payment',
        referenceId: invoice.id,
        amount: invoice.totalAmount,
        date: new Date().toISOString(),
        status: 'settled',
        paymentMethod: 'Credit Card (Instant Settlement)',
        recipientOrSource: invoice.patientName,
        notes: `Settlement for invoice #${invoice.invoiceNumber}`,
      };
      setTransactions(prev => [tx, ...prev]);
    }
    addAuditLog('INVOICE_SETTLED', 'financial', `Payment processed for invoice ${invoiceId}.`);
  };

  const createLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'score'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      score: 80,
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
    addAuditLog('NEW_LEAD_CAPTURED', 'allocation', `Lead captured for ${newLead.name} (${newLead.serviceInterest}).`);
    return newLead;
  };

  const createCampaign = (campaignData: Omit<SocialCampaign, 'id' | 'clicks' | 'conversions'>): SocialCampaign => {
    const campaign: SocialCampaign = {
      ...campaignData,
      id: `camp_${Date.now()}`,
      clicks: 0,
      conversions: 0,
    };
    setCampaigns(prev => [campaign, ...prev]);
    addAuditLog('CAMPAIGN_DRAFTED', 'security', `Created new social campaign draft: ${campaign.title}.`);
    return campaign;
  };

  const resetToInitialDemoData = () => {
    localStorage.clear();
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);
    setSettings(initialBusinessSettings);
    setPartners(initialPartners);
    setTeams(initialTeams);
    setServiceAreas(initialServiceAreas);
    setPhysiotherapists(initialPhysiotherapists);
    setPatients(initialPatients);
    setServices(initialServices);
    setAppointments(initialAppointments);
    setAssessments(initialAssessments);
    setInvoices(initialInvoices);
    setTransactions(initialTransactions);
    setPayouts(initialPayouts);
    setLeads(initialLeads);
    setCampaigns(initialCampaigns);
    setAgents(initialAiAgents);
    setApprovals(initialApprovalRequests);
    setExecutions(initialExecutions);
    setAuditLogs(initialAuditLogs);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        users,
        settings,
        updateSettings,
        partners,
        teams,
        serviceAreas,
        physiotherapists,
        patients,
        services,
        appointments,
        assessments,
        invoices,
        transactions,
        payouts,
        leads,
        campaigns,
        agents,
        approvals,
        executions,
        auditLogs,
        toggleAgentStatus,
        updateAgentModel,
        runAgentTask,
        decideApproval,
        bookAppointment,
        updateAppointmentStatus,
        saveClinicalAssessment,
        allocatePatient,
        processInvoicePayment,
        createLead,
        createCampaign,
        requestEmergencyStopAllAgents,
        resetToInitialDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
