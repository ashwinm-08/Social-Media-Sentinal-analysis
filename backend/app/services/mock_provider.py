import re
from typing import List, Dict, Any
from app.services.base_provider import ModelProvider

class MockModelProvider(ModelProvider):
    """
    Deterministic mock provider based on transparent rules, lexicons, and aspect heuristics.
    Clearly marks whether results are demo/mock.
    """

    POSITIVE_WORDS = {
        "love", "great", "excellent", "amazing", "awesome", "fantastic", "good", "best",
        "superb", "brilliant", "impressed", "worth", "durable", "fast", "helpful", "friendly",
        "smooth", "flawless", "perfect", "stunning", "solid", "recommend", "satisfied"
    }

    NEGATIVE_WORDS = {
        "hate", "terrible", "awful", "horrible", "bad", "worst", "broken", "poor",
        "disappointed", "waste", "useless", "slow", "delayed", "rude", "scam", "damaged",
        "fllimsy", "overpriced", "garbage", "trash", "crashed", "fails", "fail", "unacceptable"
    }

    ASPECT_KEYWORDS = {
        "price": ["price", "cost", "expensive", "cheap", "overpriced", "worth", "money", "deal", "value", "dollar"],
        "quality": ["quality", "material", "durable", "broken", "flimsy", "build", "sturdy", "performance", "defect", "craftsmanship"],
        "packaging": ["packaging", "box", "package", "pack", "wrapped", "unboxing", "bubble wrap", "seal", "container"],
        "service": ["service", "support", "agent", "staff", "rep", "representative", "helpdesk", "customer service", "rude", "polite"],
        "delivery": ["delivery", "shipping", "shipped", "arrived", "late", "delay", "courier", "package arrived", "transit", "ontime"]
    }

    SARCASM_PATTERNS = [
        r"oh (great|wonderful|fantastic|joy)",
        r"just what i needed",
        r"love waiting",
        r"love how.*(broken|fails|crashes|delays)",
        r"best.*ever\s*([.!?]*\s*)(not|never|lol|haha)",
        r"thanks for nothing",
        r"total genius",
        r"(/s|#sarcasm)"
    ]

    def _detect_sarcasm(self, text: str) -> bool:
        lower = text.lower()
        for pat in self.SARCASM_PATTERNS:
            if re.search(pat, lower):
                return True
        # Contradiction heuristic: positive words alongside explicitly strong negative situations
        has_pos = any(w in lower for w in ["love", "best", "great", "amazing"])
        has_neg_scenario = any(w in lower for w in ["broke after 1 day", "crashed again", "waited 3 weeks", "lost my money"])
        return has_pos and has_neg_scenario

    def _extract_aspects(self, text: str, overall_label: str) -> Dict[str, Dict[str, Any]]:
        lower = text.lower()
        aspect_results = {}

        for aspect, keywords in self.ASPECT_KEYWORDS.items():
            matches = [kw for kw in keywords if kw in lower]
            if matches:
                # Local window polarity check around matched keywords
                pos_hits = sum(1 for w in self.POSITIVE_WORDS if w in lower)
                neg_hits = sum(1 for w in self.NEGATIVE_WORDS if w in lower)
                if pos_hits > neg_hits:
                    pol = "positive"
                    conf = min(0.95, 0.70 + 0.05 * len(matches))
                elif neg_hits > pos_hits:
                    pol = "negative"
                    conf = min(0.95, 0.70 + 0.05 * len(matches))
                else:
                    pol = "neutral"
                    conf = 0.65
            else:
                pol = "neutral"
                conf = 0.50

            aspect_results[aspect] = {
                "polarity": pol,
                "confidence": round(conf, 2)
            }
        return aspect_results

    def predict(self, texts: List[str]) -> List[Dict[str, Any]]:
        results = []
        for text in texts:
            clean = text.strip()
            lower = clean.lower()
            tokens = set(re.findall(r"\w+", lower))

            pos_count = len(tokens.intersection(self.POSITIVE_WORDS))
            neg_count = len(tokens.intersection(self.NEGATIVE_WORDS))
            is_sarcasm = self._detect_sarcasm(clean)

            if is_sarcasm:
                # Invert positive sentiment if sarcastic
                neg_count += 3

            score = pos_count - neg_count
            total_matches = pos_count + neg_count

            if total_matches == 0:
                probs = [0.20, 0.60, 0.20]
                label = "neutral"
                confidence = 0.60
                uncertain = True
            elif score > 0:
                neg_p = round(max(0.05, 0.15 - 0.03 * score), 2)
                neu_p = round(max(0.10, 0.25 - 0.02 * score), 2)
                pos_p = round(1.0 - neg_p - neu_p, 2)
                probs = [neg_p, neu_p, pos_p]
                label = "positive"
                confidence = pos_p
                uncertain = confidence < 0.65
            elif score < 0:
                pos_p = round(max(0.05, 0.15 - 0.03 * abs(score)), 2)
                neu_p = round(max(0.10, 0.25 - 0.02 * abs(score)), 2)
                neg_p = round(1.0 - pos_p - neu_p, 2)
                probs = [neg_p, neu_p, pos_p]
                label = "negative"
                confidence = neg_p
                uncertain = confidence < 0.65
            else:
                probs = [0.33, 0.34, 0.33]
                label = "neutral"
                confidence = 0.45
                uncertain = True

            aspects = self._extract_aspects(clean, label)

            results.append({
                "text": clean,
                "label": label,
                "probabilities": probs,
                "confidence": round(confidence, 2),
                "uncertain": uncertain,
                "sarcasm": is_sarcasm,
                "aspects": aspects
            })
        return results

    def get_info(self) -> Dict[str, Any]:
        return {
            "model_name": "mock (demo)",
            "model_version": "v1.0-rule-lexicon",
            "is_mock": True
        }
