from abc import ABC, abstractmethod
from typing import List, Dict, Any

class ModelProvider(ABC):
    @abstractmethod
    def predict(self, texts: List[str]) -> List[Dict[str, Any]]:
        """
        Takes a list of texts and returns a list of dictionaries with structure:
        {
            "text": str,
            "label": "negative" | "neutral" | "positive",
            "probabilities": [neg, neu, pos],
            "confidence": float (0-1),
            "uncertain": bool,
            "sarcasm": bool,
            "aspects": {
                "price": {"polarity": "...", "confidence": 0-1},
                "quality": {"polarity": "...", "confidence": 0-1},
                "packaging": {"polarity": "...", "confidence": 0-1},
                "service": {"polarity": "...", "confidence": 0-1},
                "delivery": {"polarity": "...", "confidence": 0-1}
            }
        }
        """
        pass

    @abstractmethod
    def get_info(self) -> Dict[str, Any]:
        """Returns model provider name, version, and whether it's mock"""
        pass
