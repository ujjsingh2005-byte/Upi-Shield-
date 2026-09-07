import React, { useState, useRef } from 'react';
import { Upload, FileImage, AlertCircle, Loader2, FileText, CheckCircle2, X, Image as ImageIcon } from 'lucide-react';
import { analyzeImage } from '../api';
import { ImageAnalysisResponse } from '../types';
import { ThreatDashboard } from '../components/ThreatDashboard';

export default function ScreenshotScanner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const [statusStep, setStatusStep] = useState<'reading' | 'analyzing'>('reading');

  const handleAnalyze = async () => {
    if (!selectedFile || loading) {
      if (!selectedFile) setError('Please select an image file first.');
      return;
    }

    setError(null);
    setLoading(true);
    setStatusStep('reading');

    const timer = setTimeout(() => {
      setStatusStep('analyzing');
    }, 900);

    try {
      const res = await analyzeImage(selectedFile);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to process screenshot OCR. Ensure backend is operational.');
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm text-left space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold">
          <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Screenshot OCR Analyzer
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload a Screenshot to Check
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Upload an image of a suspicious message, WhatsApp chat, or payment receipt to scan for scam signs.
        </p>
      </div>

      {/* Upload Zone Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
          className="hidden"
          id="screenshot-file-input"
        />

        {!imagePreview ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition duration-150 bg-blue-50/40 hover:bg-blue-50/70 group"
          >
            <div className="mx-auto w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-105 transition duration-150 mb-3 border border-blue-100">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
              Click to upload or drag & drop image here
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, JPEG, WEBP (Max 10MB)</p>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={imagePreview}
              alt="Screenshot Preview"
              className="max-h-48 rounded-lg object-contain border border-slate-200 bg-white shadow-xs"
            />
            <div className="flex-1 space-y-2 text-left w-full">
              <div className="flex items-center gap-2">
                <FileImage className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-slate-900 truncate">
                  {selectedFile?.name}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Size: {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB
              </p>
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 pt-1 disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" /> Remove image
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shrink-0 transition cursor-pointer disabled:opacity-50"
            >
              Retry
            </button>
          </div>
        )}

        {imagePreview && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition duration-150 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {statusStep === 'reading' ? 'Reading screenshot...' : 'Checking for scam signs...'}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Analyze Screenshot
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* OCR Text Output & Results */}
      {result && (
        <div className="space-y-6">
          {/* Extracted Text Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Extracted Screenshot Text
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  result.ocr_success
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {result.ocr_success 
                  ? `OCR Engine: Active ${result.process_time_ms ? `(${(result.process_time_ms / 1000).toFixed(2)}s)` : ''}` 
                  : 'OCR Engine: Unavailable / Fallback'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
              {result.extracted_text || 'No text extracted from image.'}
            </div>

            {result.ocr_error && (
              <p className="text-xs text-amber-700 italic">Note: {result.ocr_error}</p>
            )}
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
