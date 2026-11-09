/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  FileCheck,
  CreditCard,
  Building2,
  Stethoscope,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const FinanceHub: React.FC = () => {
  const {
    invoices,
    transactions,
    payouts,
    partners,
    physiotherapists,
    processInvoicePayment,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'commissions' | 'transactions' | 'payouts'>('invoices');

  // Deterministic metrics calculation
  const totalRevenueSettled = transactions
    .filter(t => t.type === 'patient_payment' && t.status === 'settled')
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingInvoicesTotal = invoices
    .filter(i => i.status === 'unpaid')
    .reduce((acc, i) => acc + i.totalAmount, 0);

  const totalCommissionsEarned = partners.reduce((acc, p) => acc + (p.totalRevenue * p.commissionRate) / 100, 0);

  const handleExportCsv = () => {
    const csvRows = [
      ['Transaction ID', 'Type', 'Amount', 'Date', 'Status', 'Recipient/Source', 'Payment Method'],
      ...transactions.map(t => [
        t.id,
        t.type,
        t.amount.toString(),
        t.date,
        t.status,
        t.recipientOrSource,
        t.paymentMethod,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `x_physio_financial_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Settled Patient Revenue (MTD)</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ${totalRevenueSettled.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            100% Deterministic reconciliation
          </span>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Outstanding Invoices</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ${pendingInvoicesTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Agent 14 automated reminders active
          </span>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Partner Commission Accruals</span>
            <Building2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ${totalCommissionsEarned.toLocaleString()}
          </div>
          <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
            Contractual partner splits
          </span>
        </div>
      </div>

      {/* Tabs & CSV Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'invoices'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'commissions'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Partner Splits
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'payouts'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Payout Requests
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'transactions'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Audit Ledger
          </button>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Tab 1: Invoices */}
      {activeTab === 'invoices' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice Number</th>
                <th className="px-4 py-3 font-semibold">Patient</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
                <th className="px-4 py-3 font-semibold">Due Date</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono font-medium text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-semibold">
                    {inv.patientName}
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                    {inv.items[0]?.description || 'Physiotherapy Treatment'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    ${inv.totalAmount}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono">
                    {inv.dueDate}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {inv.status === 'unpaid' ? (
                      <button
                        onClick={() => processInvoicePayment(inv.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800"
                      >
                        Settle Payment
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        Ref: {inv.paymentGatewayRef || 'Settled'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Partner Splits */}
      {activeTab === 'commissions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {partners.map(partner => {
            const calculatedCommission = (partner.totalRevenue * partner.commissionRate) / 100;

            return (
              <div
                key={partner.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {partner.name}
                    </h3>
                    <p className="text-xs text-slate-500">{partner.entityName}</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300">
                    {partner.commissionRate}% Contractual Split
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gross Clinic Billing (MTD):</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                      ${partner.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Accrued Partner Share:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                      ${calculatedCommission.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Unpaid Net Payout Balance:</span>
                    <span className="font-mono tabular-nums">
                      ${partner.unpaidCommission.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  Deterministic calculation verified by Agent 10. Transfers require PRANKAX authorization in the Approval Centre.
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Payout Requests */}
      {activeTab === 'payouts' && (
        <div className="space-y-3">
          {payouts.map(payout => (
            <div
              key={payout.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {payout.beneficiaryName}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                    {payout.beneficiaryType}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Period: {payout.periodStart} to {payout.periodEnd} · {payout.totalServicesCount} verified sessions
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Net Amount</p>
                  <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${payout.netPayoutAmount.toLocaleString()}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded capitalize ${
                    payout.status === 'pending_approval'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  {payout.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Audit Ledger */}
      {activeTab === 'transactions' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-b border-slate-200 dark:border-slate-800 font-sans">
              <tr>
                <th className="px-4 py-3 font-semibold">TX ID</th>
                <th className="px-4 py-3 font-semibold">Classification</th>
                <th className="px-4 py-3 font-semibold">Entity / Patient</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-slate-400">{t.id}</td>
                  <td className="px-4 py-3 font-sans capitalize text-slate-700 dark:text-slate-300">
                    {t.type.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 font-sans font-semibold text-slate-900 dark:text-white">
                    {t.recipientOrSource}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                    ${t.amount}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[11px] font-sans font-semibold text-emerald-600 dark:text-emerald-400">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
