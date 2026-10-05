from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field

class AspectDetail(BaseModel):
    polarity: Literal["negative", "neutral", "positive"]
    confidence: float = Field(ge=0.0, le=1.0)

class PredictionItem(BaseModel):
    text: Optional[str] = None
    label: Literal["negative", "neutral", "positive"]
    probabilities: List[float] = Field(..., description="[negative, neutral, positive]")
    confidence: float = Field(ge=0.0, le=1.0)
    uncertain: bool
    sarcasm: bool
    aspects: Dict[str, AspectDetail]

class PredictRequest(BaseModel):
    texts: List[str] = Field(..., min_length=1, max_length=100, description="List of texts to analyze")

class PredictResponse(BaseModel):
    results: List[PredictionItem]
    model_name: str
    model_version: str
    is_mock: bool
