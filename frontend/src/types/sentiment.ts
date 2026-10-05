export type SentimentLabel = 'negative' | 'neutral' | 'positive';

export interface AspectDetail {
  polarity: SentimentLabel;
  confidence: number;
}

export interface PredictionResult {
  text?: string;
  label: SentimentLabel;
  probabilities: [number, number, number]; // [neg, neu, pos]
  confidence: number;
  uncertain: boolean;
  sarcasm: boolean;
  aspects: {
    price: AspectDetail;
    quality: AspectDetail;
    packaging: AspectDetail;
    service: AspectDetail;
    delivery: AspectDetail;
    [key: string]: AspectDetail;
  };
}

export interface PredictResponse {
  results: PredictionResult[];
  model_name: string;
  model_version: string;
  is_mock: boolean;
}

export interface ModelInfo {
  model_name: string;
  model_version: string;
  is_mock: boolean;
}
