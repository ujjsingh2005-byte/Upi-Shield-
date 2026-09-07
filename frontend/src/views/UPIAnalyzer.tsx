import React, { useState } from 'react';
import { QrCode, Sparkles, Trash2, AlertCircle, Loader2, UserCheck, DollarSign, FileText, CreditCard, Link as LinkIcon } from 'lucide-react';
import { analyzeUPI } from '../api';
import { UPIAnalysisResponse } from '../types';
import { ThreatDashboard } from '../components/ThreatDashboard';

const SAMPLE_UPI_URIS = [
  {
    label: 'Refund Scam Link',
    badge: 'Scam Intent',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    uri: 'upi://pay?pa=claim-refund-service@ybl&pn=UPI%20Refund%20Verification&am=4999.00&cu=INR&tn=Verification%20Fee%20Refund',
  },
  {
    label: 'Reward / Cashback Link',
    badge: 'Reward Scam',
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    uri: 'upi://pay?pa=cashback-bonus99@paytm&pn=GooglePay%20Reward&am=1500.00&cu=INR&tn=Click%20PIN%20to%20receive%20cashback',
  },
  {
    label: 'Legitimate Merchant Link',
    badge: 'Safe Intent',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    uri: 'upi://pay?pa=swiggy@icici&pn=Swiggy%20Order&am=350.00&cu=INR&tr=SWG982371982&tn=Food%20Order%20Payment',
  },
];

export default function UPIAnalyzer() {
  const [upiUri, setUpiUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UPIAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (uriToAnalyze?: string) => {
    const uri = uriToAnalyze !== undefined ? uriToAnalyze : upiUri;
    if (!uri.trim()) {
      setError('Please enter a UPI link (e.g. upi://pay?pa=...) or select an example below.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await analyzeUPI(uri);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to parse UPI intent URI. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUpiUri('');
    setResult(null);
    setError(null);
  };

  const handleSampleClick = (uri: string) => {
    setUpiUri(uri);
    handleAnalyze(uri);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm text-left space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold">
          <CreditCard className="w-3.5 h-3.5 text-blue-600" /> UPI Payment Intent Analyzer
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Check a UPI Link or QR Code
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Paste a `upi://pay` URI or QR code payment string to verify recipient details and transaction risk.
        </p>
      </div>

      {/* Sample Scenario Selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Try Sample UPI Links</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_UPI_URIS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSampleClick(sample.uri)}
              disabled={loading}
              className="flex flex-col text-left p-3.5 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition duration-150 shadow-xs hover:shadow-md group disabled:opacity-50 space-y-1.5"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {sample.label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${sample.badgeStyle}`}>
                  {sample.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate leading-relaxed">
                {sample.uri}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md space-y-4">
        <div>
          <label htmlFor="upi-input" className="block text-sm font-bold text-slate-900 mb-1">
            Paste UPI Link or QR Data
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Example format: <code className="text-blue-600 font-mono">upi://pay?pa=payee@vpa&pn=Name&am=1000...</code>
          </p>
          <input
            id="upi-input"
            type="text"
            value={upiUri}
            onChange={(e) => setUpiUri(e.target.value)}
            placeholder="upi://pay?pa=payee@vpa&pn=PayeeName&am=1000.00&cu=INR..."
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-sm text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition duration-150"
          />
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
            disabled={loading || (!upiUri && !result)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition duration-150 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>

          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={loading || !upiUri.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition duration-150 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Parsing UPI Link...
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                Analyze UPI Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Dashboard & Parsed UPI Parameters */}
      {result && (
        <div className="space-y-6">
          {/* Parsed UPI Intent Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Parsed Payment Parameters
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-3 py-0.5 rounded-full ${
                  result.is_valid
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {result.is_valid ? 'Valid UPI Payment Link' : 'Invalid / Non-standard URI'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                <div className="text-[10px] text-blue-800 uppercase font-bold flex items-center gap-1.5 mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Payee VPA (`pa`)
                </div>
                <div className="text-xs font-mono font-bold text-slate-900 truncate">
                  {result.payee_vpa || 'N/A'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                <div className="text-[10px] text-blue-800 uppercase font-bold flex items-center gap-1.5 mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Payee Name (`pn`)
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {result.payee_name || 'N/A'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                <div className="text-[10px] text-blue-800 uppercase font-bold flex items-center gap-1.5 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Requested Amount (`am`)
                </div>
                <div className="text-xs font-mono font-bold text-emerald-700">
                  {result.amount ? `₹${result.amount}` : 'N/A'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                <div className="text-[10px] text-blue-800 uppercase font-bold flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" /> Note (`tn`)
                </div>
                <div className="text-xs font-medium text-slate-800 truncate">
                  {result.transaction_note || 'N/A'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                <div className="text-[10px] text-blue-800 uppercase font-bold flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" /> Currency (`cu`)
                </div>
                <div className="text-xs font-mono font-bold text-slate-800 truncate">
                  {result.currency || 'INR'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                <div className="text-[10px] text-blue-800 uppercase font-bold flex items-center gap-1.5 mb-1">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-600" /> Raw Link
                </div>
                <div className="text-xs font-mono text-slate-600 truncate">
                  {result.raw_uri}
                </div>
              </div>
            </div>
          </div>

          {/* Threat Dashboard */}
          {result.risk_analysis && (
            <ThreatDashboard data={result.risk_analysis} />
          )}
        </div>
      )}
    </div>
  );
}
