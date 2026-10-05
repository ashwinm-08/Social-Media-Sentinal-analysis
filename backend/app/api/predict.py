from fastapi import APIRouter, Request, HTTPException
from app.schemas.sentiment import PredictRequest, PredictResponse
from app.services.provider_factory import get_model_provider
from app.core.rate_limiter import limiter

router = APIRouter(prefix="/api", tags=["Sentiment Analysis"])

@router.post("/predict", response_model=PredictResponse)
@limiter.limit("60/minute")
def predict_sentiment(request: Request, body: PredictRequest):
    """
    Analyze text sentiments and aspects.
    Matches exact required interface:
    POST /api/predict body: {"texts": ["..."]}
    Returns label, probabilities, confidence, uncertain, sarcasm, aspects.
    """
    if not body.texts:
        raise HTTPException(status_code=400, detail="Texts list cannot be empty")

    provider = get_model_provider()
    results = provider.predict(body.texts)
    info = provider.get_info()

    return PredictResponse(
        results=results,
        model_name=info["model_name"],
        model_version=info["model_version"],
        is_mock=info["is_mock"]
    )

@router.get("/model/info")
def get_model_status():
    """Returns the current active model provider and metadata"""
    provider = get_model_provider()
    return provider.get_info()
