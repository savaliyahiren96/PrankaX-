/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'main_admin' | 'partner' | 'team_head' | 'physiotherapist' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  partnerId?: string; // If partner or affiliated
  teamId?: string;    // If team head or member
  physiotherapistId?: string;
  patientId?: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin?: string;
}

export interface Partner {
  id: string;
  name: string;
  entityName: string;
  contactEmail: string;
  contactPhone: string;
  commissionRate: number; // e.g. 15%
  assignedZones: string[];
  totalRevenue: number;
  unpaidCommission: number;
  activeTherapistsCount: number;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  partnerId: string;
  teamHeadId: string;
  serviceAreaId: string;
  coverageZones: string[];
  activePatients: number;
  completedVisitsThisMonth: number;
  status: 'active' | 'inactive';
}

export interface ServiceArea {
  id: string;
  name: string;
  city: string;
  zipCodes: string[];
  lat: number;
  lng: number;
  radiusKm: number;
  partnerId?: string;
}

export interface Physiotherapist {
  id: string;
  userId: string;
  name: string;
  title: string;
  licenseNumber: string;
  specializations: string[];
  qualifications: string[];
  teamId: string;
  partnerId: string;
  primaryZone: string;
  homeVisitsEnabled: boolean;
  clinicVisitsEnabled: boolean;
  rating: number;
  totalVisits: number;
  hourlyRate: number;
  currentWorkload: number; // 0 - 100%
  status: 'active' | 'on_leave' | 'busy';
  phone: string;
  email: string;
}

export interface Patient {
  id: string;
  userId?: string;
  mrn: string; // Medical Record Number
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    zone: string;
    postalCode: string;
    lat?: number;
    lng?: number;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  primaryDiagnosis: string;
  assignedTherapistId?: string;
  assignedTeamId?: string;
  partnerId?: string;
  status: 'active' | 'evaluating' | 'discharged' | 'inactive';
  consentSigned: boolean;
  totalSessionsCompleted: number;
  treatmentGoal: string;
  allergies?: string[];
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'Musculoskeletal' | 'Sports Rehab' | 'Neurological' | 'Post-Surgical' | 'Geriatric' | 'Pediatric' | 'Ergonomics & Home Care';
  durationMinutes: number;
  price: number;
  mode: 'clinic' | 'home_visit' | 'hybrid' | 'telehealth';
  description: string;
  prerequisites?: string;
  active: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  therapistId: string;
  therapistName: string;
  teamId: string;
  serviceId: string;
  serviceName: string;
  type: 'home_visit' | 'clinic' | 'telehealth';
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  locationAddress: string;
  zone: string;
  fee: number;
  status: 'scheduled' | 'in_transit' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  notes?: string;
  clinicalAssessmentId?: string;
}

export interface ClinicalAssessment {
  id: string;
  patientId: string;
  therapistId: string;
  appointmentId: string;
  assessmentDate: string;
  soap: {
    subjective: string; // Chief complaint, pain rating (0-10 VAS), functional limits
    objective: string;  // ROM angles, MMT strength grades, palpation, special tests
    assessment: string; // Clinical diagnosis, progress status, impairments
    plan: string;        // Modalities, manual therapy, home exercise program (HEP)
  };
  metrics: {
    vasPainScore: number; // 0 - 10
    affectedJointOrRegion: string;
    romFlexionDeg?: number;
    romExtensionDeg?: number;
    mmtStrengthGrade?: string; // "3+/5", "4/5", etc.
    functionalOutcomeMeasure?: string; // e.g. "DASH Score: 28%", "Berg Balance: 46/56"
  };
  prescribedExercises: Array<{
    name: string;
    sets: number;
    reps: number;
    frequency: string;
    notes?: string;
  }>;
  therapistSignature: boolean;
  reviewedByLead: boolean;
  isDraft: boolean;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'overdue' | 'refunded';
  dueDate: string;
  issuedDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  paymentGatewayRef?: string;
}

export interface Transaction {
  id: string;
  type: 'patient_payment' | 'partner_payout' | 'therapist_payout' | 'refund' | 'operational_expense';
  referenceId: string;
  amount: number;
  date: string;
  status: 'settled' | 'pending' | 'failed';
  paymentMethod: string;
  recipientOrSource: string;
  approvedBy?: string;
  notes?: string;
}

export interface Payout {
  id: string;
  beneficiaryType: 'partner' | 'therapist';
  beneficiaryId: string;
  beneficiaryName: string;
  periodStart: string;
  periodEnd: string;
  totalServicesCount: number;
  grossAmount: number;
  commissionOrDeductions: number;
  netPayoutAmount: number;
  status: 'pending_approval' | 'approved' | 'processed' | 'rejected';
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: 'website_chat' | 'whatsapp' | 'instagram' | 'referral' | 'google_search';
  serviceInterest: string;
  zone: string;
  status: 'new' | 'contacted' | 'consultation_scheduled' | 'converted' | 'lost';
  lostReason?: string;
  notes: string;
  score: number; // 0 - 100 Lead Quality
  createdAt: string;
}

export interface SocialCampaign {
  id: string;
  title: string;
  channel: 'instagram' | 'facebook' | 'whatsapp_broadcast' | 'linkedin';
  targetAudience: string;
  contentCopy: string;
  hashtags: string[];
  status: 'draft' | 'awaiting_approval' | 'scheduled' | 'published';
  scheduledDate?: string;
  clicks?: number;
  conversions?: number;
}

export type AgentDepartment = 
  | 'A: Business Management'
  | 'B: Patient Management'
  | 'C: Staff & Clinical Management'
  | 'D: Finance & Marketing'
  | 'E: Quality, Communication & Reporting';

export interface AIAgent {
  id: string; // e.g. "agent_01"
  code: string; // e.g. "AGENT 01"
  name: string;
  role: string;
  department: AgentDepartment;
  responsibilities: string[];
  systemInstructions: string;
  model: string;
  status: 'active' | 'paused' | 'emergency_stop' | 'needs_attention';
  tools: string[];
  databasePermissions: string[];
  requiresApprovalFor: string[];
  totalExecutions: number;
  successRate: number;
  avgLatencyMs: number;
  lastExecutedAt?: string;
  lastExecutionSummary?: string;
}

export interface AIAgentExecution {
  id: string;
  agentId: string;
  agentName: string;
  taskTitle: string;
  triggerEvent: 'scheduled_cron' | 'manual_admin' | 'patient_action' | 'appointment_status' | 'system_alert';
  inputSummary: string;
  outputSummary: string;
  executionTimeMs: number;
  tokensUsed: number;
  status: 'completed' | 'failed' | 'requires_approval';
  approvalId?: string;
  timestamp: string;
}

export interface AIApprovalRequest {
  id: string;
  agentId: string;
  agentName: string;
  actionType: 'patient_transfer' | 'refund_request' | 'partner_payout' | 'staff_payout' | 'exceptional_allocation' | 'public_marketing' | 'settings_change';
  title: string;
  description: string;
  payload: any;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  requestedAt: string;
  decisionBy?: string;
  decisionAt?: string;
  decisionReason?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  category: 'clinical' | 'financial' | 'allocation' | 'security' | 'agent' | 'user_management';
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface BusinessSettings {
  companyName: string;
  platformName: string;
  mainAdminName: string;
  supportPhone: string;
  supportEmail: string;
  currency: string;
  currencySymbol: string;
  autoAllocationEnabled: boolean;
  maxTravelDistanceKm: number;
  strictApprovalForPayouts: boolean;
  strictApprovalForRefunds: boolean;
  strictApprovalForPublicPosts: boolean;
  defaultAiModel: string;
  enableWhatsAppNotifications: boolean;
  enableEmailReminders: boolean;
}
