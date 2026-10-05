import os
from typing import List, Dict, Any
from app.services.base_provider import ModelProvider

class HuggingFaceProvider(ModelProvider):
    """
    Loads local HuggingFace / PyTorch model weights from MODEL_DIR.
    Provides standard fallback or direct pipeline prediction.
    """
    def __init__(self, model_dir: str):
        self.model_dir = model_dir
        self.pipeline = None
        self.loaded = False
        self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_dir):
            return
        try:
            from transformers import pipeline
            self.pipeline = pipeline("text-classification", model=self.model_dir, return_all_scores=True)
            self.loaded = True
        except Exception:
            self.loaded = False

    def predict(self, texts: List[str]) -> List[Dict[str, Any]]:
        if not self.loaded or not self.pipeline:
            # Fallback to Mock if model weights not found in local dir yet
            from app.services.mock_provider import MockModelProvider
            mock = MockModelProvider()
            res = mock.predict(texts)
            return res

        results = []
        raw_outputs = self.pipeline(texts)
        # Standardize HF output to negative, neutral, positive and aspect map
        for idx, out in enumerate(raw_outputs):
            # Map labels
            score_map = {item['label'].lower(): item['score'] for item in out}
            neg = score_map.get('negative', score_map.get('label_0', 0.1))
            neu = score_map.get('neutral', score_map.get('label_1', 0.1))
            pos = score_map.get('positive', score_map.get('label_2', 0.8))
            total = neg + neu + pos or 1.0
            probs = [round(neg/total, 2), round(neu/total, 2), round(pos/total, 2)]
            best_idx = probs.index(max(probs))
            label = ["negative", "neutral", "positive"][best_idx]
            conf = probs[best_idx]

            # Use heuristic aspect extraction on top of the text
            from app.services.mock_provider import MockModelProvider
            aspects = MockModelProvider()._extract_aspects(texts[idx], label)

            results.append({
                "text": texts[idx],
                "label": label,
                "probabilities": probs,
                "confidence": conf,
                "uncertain": conf < 0.60,
                "sarcasm": False,
                "aspects": aspects
            })
        return results

    def get_info(self) -> Dict[str, Any]:
        return {
            "model_name": f"HuggingFace ({os.path.basename(self.model_dir) if self.loaded else 'HF-Placeholder'})",
            "model_version": "v1.0-hf",
            "is_mock": not self.loaded
        }
