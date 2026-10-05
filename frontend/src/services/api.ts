import type { PredictResponse, ModelInfo } from '../types/sentiment';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function predictSentiment(texts: string[]): Promise<PredictResponse> {
  const response = await fetch(`${API_BASE}/api/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
  if (!response.ok) {
    throw new Error('Failed to fetch model info');
  }
  return response.json();
}
