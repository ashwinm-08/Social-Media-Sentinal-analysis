import csv
import io
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import Alert, ReviewQueue, Post, SentimentScore, Brand
from app.services.provider_factory import get_model_provider
from pydantic import BaseModel

router = APIRouter(prefix="/api/operations", tags=["Operations"])

class AlertStatusUpdate(BaseModel):
    status: str  # open, acknowledged, closed

class ReviewLabelUpdate(BaseModel):
    corrected_label: str  # negative, neutral, positive

@router.get("/alerts")
def list_alerts(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Alert)
    if status and status != "all":
        q = q.filter(Alert.status == status)
    alerts = q.order_by(Alert.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "brand_id": a.brand_id,
            "brand_name": a.brand.name if a.brand else "Unknown",
            "window_start": a.window_start.isoformat(),
            "window_end": a.window_end.isoformat(),
            "negative_ratio": round(a.negative_ratio * 100, 1),
            "z_score": round(a.z_score, 2),
            "severity": a.severity,
            "top_aspect": a.top_aspect,
            "top_topic": a.top_topic,
            "explanation": a.explanation,
            "status": a.status,
            "created_at": a.created_at.isoformat()
        }
        for a in alerts
    ]

@router.patch("/alerts/{alert_id}/status")
def update_alert_status(alert_id: int, payload: AlertStatusUpdate, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    if payload.status not in ["open", "acknowledged", "closed"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
    alert.status = payload.status
    db.commit()
    return {"id": alert.id, "status": alert.status}

@router.get("/review-queue")
def list_review_queue(db: Session = Depends(get_db)):
    items = db.query(ReviewQueue).filter(ReviewQueue.status == "pending").limit(50).all()
    return [
        {
            "id": item.id,
            "post_id": item.post_id,
            "content": item.post.content if item.post else "",
            "platform": item.post.platform if item.post else "web",
            "flag_reason": item.flag_reason,
            "original_label": item.original_label,
            "confidence": item.post.sentiment.confidence if (item.post and item.post.sentiment) else 0.5,
            "status": item.status,
            "created_at": item.created_at.isoformat()
        }
        for item in items
    ]

@router.post("/review-queue/{item_id}/label")
def submit_review_label(item_id: int, payload: ReviewLabelUpdate, db: Session = Depends(get_db)):
    item = db.query(ReviewQueue).filter(ReviewQueue.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Review item not found")
    if payload.corrected_label not in ["negative", "neutral", "positive"]:
        raise HTTPException(status_code=400, detail="Invalid sentiment label")
    
    item.corrected_label = payload.corrected_label
    item.status = "reviewed"
    db.commit()
    return {"message": "Feedback saved for future model retraining", "id": item.id, "corrected_label": item.corrected_label}

@router.post("/batch-analyze")
async def batch_analyze_csv(file: UploadFile = File(...)):
    # File validation: type and size
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:  # 2MB limit
        raise HTTPException(status_code=400, detail="File size exceeds limit (Max 2MB)")
    
    try:
        decoded = contents.decode("utf-8", errors="replace")
        csv_reader = csv.DictReader(io.StringIO(decoded))
        rows = list(csv_reader)
        if not rows:
            raise HTTPException(status_code=400, detail="CSV file contains no data")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV format: {str(e)}")
    
    # Locate text column
    fieldnames = csv_reader.fieldnames or []
    possible_cols = ["text", "content", "review", "post", "comment", "feedback"]
    matched_col = next((c for c in fieldnames if c.lower() in possible_cols), None)
    if not matched_col and fieldnames:
        matched_col = fieldnames[0]
    
    if not matched_col:
        raise HTTPException(status_code=400, detail="No readable text column found in CSV")

    # Limit to max 200 rows for real-time responsiveness
    rows = rows[:200]
    texts = [str(r.get(matched_col, "")).strip() for r in rows if r.get(matched_col)]

    provider = get_model_provider()
    predictions = provider.predict(texts)


    results = []
    for idx, p in enumerate(predictions):
        results.append({
            "id": idx + 1,
            "text": p["text"][:160],
            "label": p["label"],
            "confidence": round(p["confidence"], 2),
            "sarcasm": p["sarcasm"],
            "uncertain": p["uncertain"],
            "price_aspect": p["aspects"]["price"]["polarity"],
            "quality_aspect": p["aspects"]["quality"]["polarity"],
            "service_aspect": p["aspects"]["service"]["polarity"],
            "delivery_aspect": p["aspects"]["delivery"]["polarity"]
        })

    return {
        "total_rows": len(results),
        "results": results
    }
