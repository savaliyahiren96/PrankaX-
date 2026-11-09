/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  Calendar,
  CheckCircle,
  Clock,
  Dumbbell,
  ShieldCheck,
  User,
  Sparkles,
  RotateCw,
  AlertCircle,
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { patients, appointments, assessments, services, bookAppointment } = useApp();

  // Pick current patient
  const patient = patients[0]; // Emily Davis
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientAssessment = assessments.find(a => a.patientId === patient.id);

  // Chat State
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        'Hello! I am the AI Receptionist for X Physiotherapy Services. I can help you explore our clinical treatments, answer clinic FAQs, or guide you through scheduling your next appointment. How can I assist you today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    if (!textToSend) setChatInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          patientContext: {
            patientName: patient.fullName,
            diagnosis: patient.primaryDiagnosis,
            sessionsCompleted: patient.totalSessionsCompleted,
          },
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            'Thank you for reaching out! Our clinic hours are Monday through Saturday, 7:00 AM to 8:00 PM. A representative will be delighted to confirm your visit, or you can select an appointment slot directly in the portal.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const faqChips = [
    'How do in-home physiotherapy visits work?',
    'What should I prepare for my knee rehabilitation?',
    'Are home visit fees reimbursable by insurance?',
    'How do I reschedule my upcoming appointment?',
  ];

  return (
    <div className="space-y-6">
      {/* Patient Welcome Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <span>{patient.mrn}</span>
            <span>·</span>
            <span>Active Care Plan</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight mt-1">
            Welcome back, {patient.fullName}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {patient.primaryDiagnosis}
          </p>
          <p className="text-xs text-sky-300 font-semibold mt-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Target Goal: {patient.treatmentGoal}</span>
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Rehabilitation Progress</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
            {patient.totalSessionsCompleted} Sessions
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">
            Stage 2 Loading Phase
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Prescribed HEP Exercises & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Home Exercise Program (HEP) */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Prescribed Home Exercise Program (HEP)
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Prescribed by Attending PT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patientAssessment?.prescribedExercises.map((ex, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {ex.name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-mono">
                    <span>
                      {ex.sets} Sets × {ex.reps} Reps
                    </span>
                    <span className="text-sky-600 dark:text-sky-400 font-sans font-medium">
                      {ex.frequency}
                    </span>
                  </div>
                  {ex.notes && (
                    <p className="text-[11px] text-slate-500 italic">
                      Note: {ex.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Patient Visits */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Upcoming & Recent Appointments
                </h2>
              </div>
            </div>

            <div className="space-y-2.5">
              {patientAppointments.map(apt => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {apt.serviceName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {apt.date} at {apt.startTime} · Attending: {apt.therapistName}
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                      apt.status === 'completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                    }`}
                  >
                    {apt.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Receptionist Chatbot (Agent 04) */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[650px] shadow-xs">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs">
                A04
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  AI Receptionist Concierge
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Live Service Intake · Agent 04
                </span>
              </div>
            </div>
          </div>

          {/* Quick FAQ Chips */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto bg-slate-50/50 dark:bg-slate-900/30">
            {faqChips.slice(0, 2).map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] text-xs p-3 rounded-xl leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs p-3 rounded-xl rounded-bl-none flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Receptionist is drafting a response...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about treatments, pricing, or bookings..."
              className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isSending || !chatInput.trim()}
              className="p-2.5 rounded-lg bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
