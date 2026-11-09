/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClinicalAssessment, Patient } from '../types';
import {
  FileText,
  Activity,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PenTool,
  Save,
  RotateCw,
  Sliders,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';

export const ClinicalHub: React.FC = () => {
  const {
    patients,
    assessments,
    saveClinicalAssessment,
    currentUser,
    physiotherapists,
    appointments,
  } = useApp();

  const [selectedPatient, setSelectedPatient] = useState<Patient>(patients[0]);
  const existingAssessment = assessments.find(a => a.patientId === selectedPatient.id);

  // Form states
  const [subjective, setSubjective] = useState(
    existingAssessment?.soap.subjective ||
      'Patient reports aching discomfort aggravated by prolonged sitting and stairs (VAS 4/10). No radicular signs.'
  );
  const [objective, setObjective] = useState(
    existingAssessment?.soap.objective ||
      'AROM Flexion: 120 deg, Extension: 0 deg. Palpation tenderness at medial joint line. MMT Quad: 4/5.'
  );
  const [assessmentText, setAssessmentText] = useState(
    existingAssessment?.soap.assessment ||
      'Patient demonstrates progressive motor recovery and reduced swelling. Ready for eccentric strengthening.'
  );
  const [planText, setPlanText] = useState(
    existingAssessment?.soap.plan ||
      '1. Quadriceps closed-chain loading 3x10. 2. Hamstring stretches 3x30s. 3. Cryotherapy 15 min. Frequency: 2x/wk.'
  );
  const [vasPain, setVasPain] = useState<number>(existingAssessment?.metrics.vasPainScore || 3);
  const [romFlexion, setRomFlexion] = useState<number>(existingAssessment?.metrics.romFlexionDeg || 118);
  const [mmtGrade, setMmtGrade] = useState<string>(existingAssessment?.metrics.mmtStrengthGrade || '4-/5');
  const [isSigned, setIsSigned] = useState<boolean>(existingAssessment?.therapistSignature || false);

  // AI SOAP Assistant state
  const [shorthandInput, setShorthandInput] = useState('');
  const [isFormattingAi, setIsFormattingAi] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleAiFormat = async () => {
    if (!shorthandInput.trim()) return;
    setIsFormattingAi(true);

    try {
      const response = await fetch('/api/ai/soap-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shorthandNotes: shorthandInput,
          patientName: selectedPatient.fullName,
          diagnosis: selectedPatient.primaryDiagnosis,
          jointRegion: selectedPatient.primaryDiagnosis.split(' ')[0] || 'Musculoskeletal',
        }),
      });

      const data = await response.json();
      if (data.formattedSoap) {
        // Parse or inject into fields
        const raw = data.formattedSoap;
        setSubjective(extractSection(raw, 'SUBJECTIVE') || raw.slice(0, 200));
        setObjective(extractSection(raw, 'OBJECTIVE') || 'AROM and special tests formatted by AI Assistant.');
        setAssessmentText(extractSection(raw, 'ASSESSMENT') || 'Clinical impression verified.');
        setPlanText(extractSection(raw, 'PLAN') || 'Therapeutic interventions and HEP updated.');
      }
    } catch {
      // Fallback
      setSubjective(`Patient notes improvement in daily functional tasks with mild stiffness in the mornings (VAS ${vasPain}/10).`);
      setObjective(`Active ROM: ${romFlexion}° flexion, 0° extension. MMT Strength grade: ${mmtGrade}.`);
      setAssessmentText(`Advancing favorably along protocol with no adverse swelling or compensation patterns.`);
      setPlanText(`Continue progressive resistance drills and proprioceptive balance. Re-evaluate in 2 weeks.`);
    } finally {
      setIsFormattingAi(false);
    }
  };

  const extractSection = (text: string, section: string): string => {
    const regex = new RegExp(`\\[${section}\\]([\\s\\S]*?)(?=\\[|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const handleSave = () => {
    const payload = {
      patientId: selectedPatient.id,
      therapistId: selectedPatient.assignedTherapistId || 'physio_01',
      appointmentId: 'apt_01',
      assessmentDate: new Date().toISOString().split('T')[0],
      soap: {
        subjective,
        objective,
        assessment: assessmentText,
        plan: planText,
      },
      metrics: {
        vasPainScore: vasPain,
        affectedJointOrRegion: selectedPatient.primaryDiagnosis,
        romFlexionDeg: romFlexion,
        romExtensionDeg: 0,
        mmtStrengthGrade: mmtGrade,
        functionalOutcomeMeasure: 'IKDC Score: 72/100',
      },
      prescribedExercises: [
        { name: 'Terminal Knee Extension with Band', sets: 3, reps: 15, frequency: 'Daily' },
        { name: 'Straight Leg Raise', sets: 3, reps: 12, frequency: 'Daily' },
        { name: 'Single-Leg Balance Board', sets: 3, reps: 30, frequency: '3x weekly' },
      ],
      therapistSignature: isSigned,
      reviewedByLead: isSigned,
      isDraft: !isSigned,
    };

    saveClinicalAssessment(payload, existingAssessment?.id);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <strong>CLINICAL SAFETY DIRECTIVE (AGENT 09):</strong> All AI-generated clinical documentation is generated as a structured DRAFT. Attending licensed physiotherapists must review, verify goniometric measurements, and apply electronic sign-off. AI agents never independently diagnose or alter care plans.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Selection Column */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Active Patients
          </h2>
          <div className="space-y-2">
            {patients.map(p => {
              const active = selectedPatient.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPatient(p);
                    const match = assessments.find(a => a.patientId === p.id);
                    if (match) {
                      setSubjective(match.soap.subjective);
                      setObjective(match.soap.objective);
                      setAssessmentText(match.soap.assessment);
                      setPlanText(match.soap.plan);
                      setVasPain(match.metrics.vasPainScore);
                      setRomFlexion(match.metrics.romFlexionDeg || 110);
                      setMmtGrade(match.metrics.mmtStrengthGrade || '4/5');
                      setIsSigned(match.therapistSignature);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    active
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {p.fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {p.primaryDiagnosis}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {p.mrn} · {p.totalSessionsCompleted} sessions completed
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main SOAP Documentation Area */}
        <div className="lg:col-span-3 space-y-5">
          {/* AI Rapid Shorthand Intake Box */}
          <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  AI Clinical Scribe (Agent 09)
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Dictate or paste clinician shorthand bullets
              </span>
            </div>

            <textarea
              value={shorthandInput}
              onChange={e => setShorthandInput(e.target.value)}
              placeholder="e.g. Pt reports knee feels stable today, pain 2/10 after 15m bike. AROM 0 to 122 deg. Quad strength 4+/5. Add single leg squats and band walks. Cryotherapy."
              rows={2}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <div className="flex justify-end">
              <button
                onClick={handleAiFormat}
                disabled={isFormattingAi || !shorthandInput.trim()}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1.5 shadow-sm"
              >
                {isFormattingAi ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Structuring SOAP Note...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Transform to Standard SOAP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Objective Biomechanical Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {/* VAS Pain Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">VAS Pain Scale (0-10)</span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                  {vasPain} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={vasPain}
                onChange={e => setVasPain(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <span className="text-[10px] text-slate-400">
                {vasPain === 0 ? 'No Pain' : vasPain <= 3 ? 'Mild Ache' : vasPain <= 6 ? 'Moderate Pain' : 'Severe Distress'}
              </span>
            </div>

            {/* Goniometric ROM */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Active Flexion ROM</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {romFlexion}°
                </span>
              </div>
              <input
                type="range"
                min="45"
                max="150"
                value={romFlexion}
                onChange={e => setRomFlexion(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-[10px] text-slate-400">
                Goniometer measurement
              </span>
            </div>

            {/* MMT Strength Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Manual Muscle Test (MMT)
              </label>
              <select
                value={mmtGrade}
                onChange={e => setMmtGrade(e.target.value)}
                className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="5/5">5/5 - Normal (Complete ROM vs full resistance)</option>
                <option value="4+/5">4+/5 - Good Plus (Strong resistance)</option>
                <option value="4/5">4/5 - Good (Moderate resistance)</option>
                <option value="4-/5">4-/5 - Good Minus (Mild resistance)</option>
                <option value="3+/5">3+/5 - Fair Plus (Minimal resistance)</option>
                <option value="3/5">3/5 - Fair (Full ROM against gravity only)</option>
                <option value="2/5">2/5 - Poor (Full ROM gravity eliminated)</option>
              </select>
            </div>
          </div>

          {/* 4 SOAP Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-1">
                [S] Subjective (Patient Report, Symptoms & Functional Limitations)
              </label>
              <textarea
                value={subjective}
                onChange={e => setSubjective(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-1">
                [O] Objective (Physical Examination, Palpation & Orthopedic Tests)
              </label>
              <textarea
                value={objective}
                onChange={e => setObjective(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-1">
                [A] Assessment (Clinical Diagnosis, Impairments & Functional Status)
              </label>
              <textarea
                value={assessmentText}
                onChange={e => setAssessmentText(e.target.value)}
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-1">
                [P] Plan (Therapeutic Modalities, Interventions & Home Exercise Program)
              </label>
              <textarea
                value={planText}
                onChange={e => setPlanText(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Electronic Signature & Save Bar */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isSigned}
                onChange={e => setIsSigned(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Attending Physiotherapist Digital Verification & Electronic Signature applied.
              </span>
            </label>

            <div className="flex items-center gap-3">
              {saveSuccessNotice && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Assessment Saved
                </span>
              )}

              <button
                onClick={handleSave}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save SOAP Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
