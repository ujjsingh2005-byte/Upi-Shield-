import React, { useState } from 'react';
import { Send, Trash2, AlertCircle, Sparkles, Loader2, ShieldCheck, Zap, Lock, Search, Clock, Eye, CheckCircle2, ShieldAlert } from 'lucide-react';
import { analyzeText } from '../api';
import { AnalysisResponse } from '../types';
import { ThreatDashboard } from '../components/ThreatDashboard';

const SAMPLE_MESSAGES = [
  {
    label: 'Refund Scam',
    badge: 'CC-GFG-02 Demo',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    preview: 'URGENT: Your refund of ₹4,999 is pending verification...',
    text: 'URGENT: Your refund of ₹4,999 is pending verification. Your UPI account will be suspended if you don\'t complete verification immediately. Click the link below and enter your OTP to receive the refund. http://upi-verify-refund.top',
  },
  {
    label: 'Electricity Bill Scam',
    badge: 'High Threat',
    badgeStyle: 'bg-orange-50 text-orange-700 border-orange-200',
    preview: 'Your electricity connection will be disconnected tonight...',
    text: 'DEAR CUSTOMER YOUR ELECTRICITY POWER WILL BE DISCONNECTED NIGHT 9.30 PM FROM ELECTRICITY OFFICE BECAUSE YOUR PREVIOUS MONTH BILL WAS NOT UPDATED PLEASE IMMEDIATELY CONTACT OUR ELECTRICITY OFFICER AT 9876543210. THANK YOU.',
  },
  {
    label: 'Account Blocked',
    badge: 'Credential Theft',
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    preview: 'Your UPI account will be blocked. Share your OTP...',
    text: 'Your UPI account will be blocked within 2 hours due to unverified KYC. Share your 6-digit OTP with our agent to prevent suspension immediately.',
  },
  {
    label: 'Normal Payment',
    badge: 'Safe Demo',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    preview: 'I\'ll send you ₹500 tomorrow for dinner.',
    text: 'I\'ll send you ₹500 tomorrow for dinner.',
  },
];

export default function MessageScanner() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : message;
    if (!text.trim()) {
      setError('Please type or paste a message to analyze.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await analyzeText(text);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze message. Ensure the FastAPI backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessage('');
    setResult(null);
    setError(null);
  };

  const handleSampleClick = (sampleText: string) => {
    setMessage(sampleText);
    handleAnalyze(sampleText);
  };

  return (
    <div className="space-y-8">

      {/* Main Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Digital Payment Safety Assistant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Check Before You <span className="text-blue-600">Pay</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Check messages, screenshots, and UPI links for scam signs before you pay.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-blue-100 text-slate-700 text-xs font-semibold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Detect Scams
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-blue-100 text-slate-700 text-xs font-semibold shadow-xs">
              <Zap className="w-3.5 h-3.5 text-blue-600" /> Quick Results
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-blue-100 text-slate-700 text-xs font-semibold shadow-xs">
              <Lock className="w-3.5 h-3.5 text-blue-600" /> Simple & Safe
            </span>
          </div>
        </div>

        {/* Right Hero CSS Illustration Card */}
        <div className="w-full md:w-72 shrink-0 bg-white p-5 rounded-2xl border border-blue-100 shadow-md flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-6 -mt-6" />
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">100% In-Memory Scan</div>
            <div className="text-xs text-slate-500 mt-0.5">Scam Signals • Bilingual Guidance</div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Zero Data Saved
          </div>
        </div>
      </div>

      {/* "Try These Examples" Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Try These Examples</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_MESSAGES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSampleClick(sample.text)}
              disabled={loading}
              className="flex flex-col text-left p-4 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-300 transition duration-150 shadow-xs hover:shadow-md group disabled:opacity-50 space-y-2"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {sample.label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${sample.badgeStyle}`}>
                  {sample.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {sample.preview}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Message Scanner Main Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Paste a Message to Check
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Paste an SMS, WhatsApp message, or payment message below.
          </p>
        </div>

        <div className="relative">
          <textarea
            id="message-input"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type or paste the message you want to check..."
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition duration-150 leading-relaxed font-medium"
          />
          <div className="absolute bottom-3 right-3 text-[11px] font-medium text-slate-400">
            {message.length} characters
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => handleAnalyze()}
              disabled={loading}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shrink-0 transition cursor-pointer disabled:opacity-50"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleClear}
            disabled={loading || (!message && !result)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition duration-150 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>

          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={loading || !message.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Message...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Analyze Message
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Dashboard */}
      {result && <ThreatDashboard data={result} />}

      {/* Bottom Feature Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Fast Analysis</h3>
            <p className="text-[11px] text-slate-500">Get results in seconds</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Find Scam Signs</h3>
            <p className="text-[11px] text-slate-500">Spot common warning signs</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Easy to Use</h3>
            <p className="text-[11px] text-slate-500">Simple and clear</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Stay Safe</h3>
            <p className="text-[11px] text-slate-500">Make safer payment decisions</p>
          </div>
        </div>
      </div>

    </div>
  );
}
