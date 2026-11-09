/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead, SocialCampaign } from '../types';
import {
  Share2,
  Sparkles,
  Users,
  Target,
  Send,
  Plus,
  MessageCircle,
  Instagram,
  Facebook,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

export const MarketingHub: React.FC = () => {
  const { leads, campaigns, createLead, createCampaign } = useApp();

  const [activeTab, setActiveTab] = useState<'leads' | 'social'>('leads');
  const [topicInput, setTopicInput] = useState('');
  const [channelInput, setChannelInput] = useState<'instagram' | 'facebook' | 'linkedin'>('instagram');
  const [audienceInput, setAudienceInput] = useState('Active adults 25-50, office workers with posture strain');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);

  const handleGenerateSocialPost = async () => {
    if (!topicInput.trim()) return;
    setIsGenerating(true);
    setGeneratedDraft(null);

    try {
      const response = await fetch('/api/ai/marketing-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput,
          channel: channelInput,
          targetAudience: audienceInput,
        }),
      });

      const data = await response.json();
      if (data.campaignDraft) {
        setGeneratedDraft(data.campaignDraft);
        // Automatically save as awaiting_approval draft
        createCampaign({
          title: topicInput,
          channel: channelInput,
          targetAudience: audienceInput,
          contentCopy: data.campaignDraft,
          hashtags: ['#Physiotherapy', '#ActiveRecovery', '#XPhysio'],
          status: 'awaiting_approval',
          scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        });
      }
    } catch {
      const fallback = `Evidence-based update on ${topicInput}:
Studies show early active rehabilitation speeds recovery by 35%. Consult our licensed physiotherapists at X Physiotherapy Services for a personalized evaluation. #EvidenceBasedPhysio #XPhysio`;
      setGeneratedDraft(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Marketing & Lead Conversion Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Agent 11 (Marketing Strategist) & Agent 12 (Lead Pipeline Nurturer).
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'leads'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Lead Funnel ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'social'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Social Campaigns ({campaigns.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Lead Pipeline */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leads.map(lead => (
              <div
                key={lead.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lead.name}
                    </h3>
                    <p className="text-xs text-slate-500">{lead.phone}</p>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">
                    Score: {lead.score}/100
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p>
                    <strong>Interest:</strong> {lead.serviceInterest}
                  </p>
                  <p>
                    <strong>Zone:</strong> {lead.zone}
                  </p>
                  <p className="text-slate-500 italic mt-1 bg-slate-50 dark:bg-slate-800/40 p-2 rounded">
                    "{lead.notes}"
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Via {lead.source}</span>
                  <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Social Campaigns & AI Post Generator */}
      {activeTab === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Generator Panel */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Agent 11 Post Creator
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drafts evidence-based clinical education posts. Queued for PRANKAX approval before public syndication.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Clinical Topic or Campaign Focus
                </label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  placeholder="e.g. Scapular dyskinesis & desk posture relief"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Social Channel
                </label>
                <div className="flex gap-2">
                  {(['instagram', 'facebook', 'linkedin'] as const).map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setChannelInput(ch)}
                      className={`flex-1 py-1.5 rounded-lg border capitalize transition-colors ${
                        channelInput === ch
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Demographic
                </label>
                <input
                  type="text"
                  value={audienceInput}
                  onChange={e => setAudienceInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleGenerateSocialPost}
                disabled={isGenerating || !topicInput.trim()}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Educational Post...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate & Queue for Approval</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Existing Campaigns List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Campaign Review Queue ({campaigns.length})
            </h2>

            <div className="space-y-3">
              {campaigns.map(camp => (
                <div
                  key={camp.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {camp.channel === 'instagram' ? (
                          <Instagram className="w-4 h-4 text-pink-500" />
                        ) : (
                          <Facebook className="w-4 h-4 text-blue-500" />
                        )}
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {camp.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Target: {camp.targetAudience}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                        camp.status === 'awaiting_approval'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {camp.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                    {camp.contentCopy}
                  </p>

                  <div className="flex flex-wrap gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-mono">
                    {camp.hashtags.map((tag, i) => (
                      <span key={i}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
