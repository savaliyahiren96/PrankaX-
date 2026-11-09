/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Home,
  Building,
  CheckCircle,
  Plus,
  Filter,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

export const AppointmentsHub: React.FC = () => {
  const {
    appointments,
    physiotherapists,
    patients,
    services,
    bookAppointment,
    updateAppointmentStatus,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Booking Form State
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedTherapistId, setSelectedTherapistId] = useState(physiotherapists[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [bookingDate, setBookingDate] = useState('2026-11-10');
  const [bookingTime, setBookingTime] = useState('11:00');
  const [bookingType, setBookingType] = useState<'home_visit' | 'clinic' | 'telehealth'>('home_visit');
  const [bookingNotes, setBookingNotes] = useState('');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const filteredAppointments = appointments.filter(apt => {
    const matchesType = filterType === 'all' || apt.type === filterType;
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    // Conflict check (Agent 06 logic)
    const conflict = appointments.find(
      a =>
        a.therapistId === selectedTherapistId &&
        a.date === bookingDate &&
        a.startTime === bookingTime &&
        a.status !== 'cancelled'
    );

    if (conflict) {
      setConflictWarning(
        `Conflict Detected: Therapist already booked for ${conflict.patientName} at ${bookingTime} on ${bookingDate}. Select another slot to avoid double-booking.`
      );
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    const therapist = physiotherapists.find(p => p.id === selectedTherapistId);
    const service = services.find(s => s.id === selectedServiceId);

    if (!patient || !therapist || !service) return;

    bookAppointment({
      patientId: patient.id,
      patientName: patient.fullName,
      therapistId: therapist.id,
      therapistName: therapist.name,
      teamId: therapist.teamId,
      serviceId: service.id,
      serviceName: service.name,
      type: bookingType,
      date: bookingDate,
      startTime: bookingTime,
      endTime: '12:00',
      locationAddress:
        bookingType === 'home_visit'
          ? patient.address.street + ', ' + patient.address.city
          : 'Apex Physiotherapy Clinic, Metropolis',
      zone: patient.address.zone,
      fee: service.price,
      status: 'scheduled',
      paymentStatus: 'pending',
      notes: bookingNotes,
    });

    setShowBookingModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Appointments & In-Home Schedule
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Agent 06 Conflict-Free Dispatcher · Real-time transit telemetry and scheduling.
          </p>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule New Appointment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Type:
          </span>
          {['all', 'home_visit', 'clinic', 'telehealth'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                filterType === type
                  ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1">Status:</span>
          {['all', 'scheduled', 'in_transit', 'in_progress', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppointments.map(apt => (
          <div
            key={apt.id}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3.5 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {apt.type === 'home_visit' ? (
                    <Car className="w-4 h-4 text-sky-500" />
                  ) : (
                    <Building className="w-4 h-4 text-indigo-500" />
                  )}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {apt.patientName}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {apt.serviceName}
                </p>
              </div>

              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                  apt.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : apt.status === 'in_transit'
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {apt.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{apt.date} · {apt.startTime}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{apt.zone}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Attending Clinician: <strong>{apt.therapistName}</strong>
            </p>

            {apt.notes && (
              <p className="text-xs p-2 rounded bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 italic">
                "{apt.notes}"
              </p>
            )}

            {/* Quick Status Stepper */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                Fee: ${apt.fee}
              </span>

              <div className="flex items-center gap-1.5">
                {apt.status === 'scheduled' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'in_transit')}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900 hover:bg-sky-100"
                  >
                    Start Transit
                  </button>
                )}
                {apt.status === 'in_transit' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100"
                  >
                    Begin Session
                  </button>
                )}
                {apt.status === 'in_progress' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    Complete Visit
                  </button>
                )}
                {apt.status === 'completed' && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Visit Finished
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Schedule New Appointment
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {conflictWarning && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{conflictWarning}</span>
              </div>
            )}

            <form onSubmit={handleCreateBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.primaryDiagnosis})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Physiotherapist
                </label>
                <select
                  value={selectedTherapistId}
                  onChange={e => setSelectedTherapistId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {physiotherapists.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.primaryZone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Service Modality
                </label>
                <select
                  value={selectedServiceId}
                  onChange={e => setSelectedServiceId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (${s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Appointment Setting
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingType('home_visit')}
                    className={`flex-1 py-1.5 rounded-lg border transition-colors ${
                      bookingType === 'home_visit'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    In-Home Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('clinic')}
                    className={`flex-1 py-1.5 rounded-lg border transition-colors ${
                      bookingType === 'clinic'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    In-Clinic Session
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Clinical / Arrival Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ring Apt 6B, bring resistance bands"
                  value={bookingNotes}
                  onChange={e => setBookingNotes(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 font-bold shadow-sm"
                >
                  Confirm Booking (Zero-Conflict)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
