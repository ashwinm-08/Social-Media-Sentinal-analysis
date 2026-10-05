import type { PredictResponse, ModelInfo } from '../types/sentiment';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export async function predictSentiment(texts: string[]): Promise<PredictResponse> {
  const response = await fetch(`${API_BASE}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to predict sentiment');
  }
  return response.json();
}

export async function getModelInfo(): Promise<ModelInfo> {
  const response = await fetch(`${API_BASE}/api/model/info`);
  if (!response.ok) throw new Error('Failed to fetch model info');
  return response.json();
}

export async function getBrands(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/api/analytics/brands`);
  if (!response.ok) throw new Error('Failed to fetch brands');
  return response.json();
}

export async function getDashboardData(brandId?: number, platform?: string, days: number = 30): Promise<any> {
  const params = new URLSearchParams();
  if (brandId) params.append('brand_id', brandId.toString());
  if (platform) params.append('platform', platform);
  params.append('days', days.toString());

  const response = await fetch(`${API_BASE}/api/analytics/dashboard?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
  return response.json();
}

export async function getBrandComparison(brandIds: number[]): Promise<any> {
  const response = await fetch(`${API_BASE}/api/analytics/compare?brand_ids=${brandIds.join(',')}`);
  if (!response.ok) throw new Error('Failed to compare brands');
  return response.json();
}

export async function getAlerts(status?: string): Promise<any[]> {
  const url = status && status !== 'all' 
    ? `${API_BASE}/api/operations/alerts?status=${status}` 
    : `${API_BASE}/api/operations/alerts`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch alerts');
  return response.json();
}

export async function updateAlertStatus(alertId: number, status: string): Promise<any> {
  const response = await fetch(`${API_BASE}/api/operations/alerts/${alertId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update alert');
  return response.json();
}

export async function getReviewQueue(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/api/operations/review-queue`);
  if (!response.ok) throw new Error('Failed to fetch review queue');
  return response.json();
}

export async function submitReviewCorrection(itemId: number, correctedLabel: string): Promise<any> {
  const response = await fetch(`${API_BASE}/api/operations/review-queue/${itemId}/label`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ corrected_label: correctedLabel }),
  });
  if (!response.ok) throw new Error('Failed to submit label');
  return response.json();
}

export async function batchAnalyzeCsv(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE}/api/operations/batch-analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Batch analysis failed');
  }
  return response.json();
}

export async function loginUser(email: string, password: string): Promise<any> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Invalid login credentials');
  }
  return response.json();
}
