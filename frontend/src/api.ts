import { AnalysisResponse, UPIAnalysisResponse, ImageAnalysisResponse } from './types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://upi-shield-2qwq.onrender.com').replace(/\/$/, '');

/**
 * Helper to fetch with automatic retries and extended timeout for backend cold-starts (e.g., Render free tier).
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  delayMs = 3000
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout for cold start

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok || attempt === retries) {
        return res;
      }
    } catch (err: any) {
      if (attempt === retries) {
        throw err;
      }
      // Wait before retrying (Render takes ~15-30s to wake up from cold start)
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
  throw new Error('Network request failed after retries.');
}

export async function analyzeText(text: string): Promise<AnalysisResponse> {
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'API Request failed' }));
      throw new Error(errorData.detail || 'Failed to analyze text.');
    }

    return await res.json();
  } catch (err: any) {
    if (err.name === 'AbortError' || (err.name === 'TypeError' && err.message?.includes('fetch'))) {
      throw new Error('Cannot reach backend server. The Render backend may be waking up from a cold start (takes ~30s). Please wait a moment and click Retry.');
    }
    throw err;
  }
}

export async function analyzeUPI(uri: string): Promise<UPIAnalysisResponse> {
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/analyze/upi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'UPI API Request failed' }));
      throw new Error(errorData.detail || 'Failed to analyze UPI URI.');
    }

    return await res.json();
  } catch (err: any) {
    if (err.name === 'AbortError' || (err.name === 'TypeError' && err.message?.includes('fetch'))) {
      throw new Error('Cannot reach backend server. The Render backend may be waking up from a cold start (takes ~30s). Please wait a moment and click Retry.');
    }
    throw err;
  }
}

async function resizeImageFile(file: File, maxDim = 1000): Promise<File> {
  if (typeof window === 'undefined' || !window.createImageBitmap) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    if (Math.max(width, height) <= maxDim) {
      bitmap.close();
      return file;
    }
    const scale = maxDim / Math.max(width, height);
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85)
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

export async function analyzeImage(file: File): Promise<ImageAnalysisResponse> {
  const optimizedFile = await resizeImageFile(file, 1000);
  const formData = new FormData();
  formData.append('file', optimizedFile);

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/analyze/image`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'OCR API Request failed' }));
      throw new Error(errorData.detail || 'Failed to process screenshot.');
    }

    return await res.json();
  } catch (err: any) {
    if (err.name === 'AbortError' || (err.name === 'TypeError' && err.message?.includes('fetch'))) {
      throw new Error('Cannot reach backend server. The Render backend may be waking up from a cold start (takes ~30s). Please wait a moment and click Retry.');
    }
    throw err;
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

