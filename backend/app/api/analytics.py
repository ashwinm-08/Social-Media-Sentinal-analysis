from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.core.database import get_db
from app.models.entities import Brand, Post, SentimentScore, AspectScore, TopicAssignment, Alert, ReviewQueue

router = APIRouter(prefix="/api/analytics", tags=["Perception Analytics"])

@router.get("/brands")
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(Brand).all()
    return [{"id": b.id, "name": b.name, "slug": b.slug, "industry": b.industry} for b in brands]

@router.get("/dashboard")
def get_dashboard_metrics(
    brand_id: Optional[int] = Query(None),
    platform: Optional[str] = Query(None),
    days: int = Query(30, ge=1, le=90),
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    start_date = now - timedelta(days=days)

    query = db.query(Post).filter(Post.posted_at >= start_date)
    if brand_id:
        query = query.filter(Post.brand_id == brand_id)
    if platform and platform != "all":
        query = query.filter(Post.platform == platform)

    post_ids = [p.id for p in query.all()]
    total_posts = len(post_ids)

    if total_posts == 0:
        return {
            "total_posts": 0,
            "pct_positive": 0,
            "pct_negative": 0,
            "pct_neutral": 0,
            "perception_score": 50,
            "active_alerts": 0,
            "trend_data": [],
            "aspect_breakdown": [],
            "top_topics": [],
            "recent_alerts": [],
            "is_demo_data": True
        }

    # Sentiment distribution
    sentiments = db.query(SentimentScore.label, func.count(SentimentScore.id))\
        .filter(SentimentScore.post_id.in_(post_ids))\
        .group_by(SentimentScore.label).all()
    
    sent_dict = {label: count for label, count in sentiments}
    pos_count = sent_dict.get("positive", 0)
    neg_count = sent_dict.get("negative", 0)
    neu_count = sent_dict.get("neutral", 0)

    pct_pos = round((pos_count / total_posts) * 100, 1)
    pct_neg = round((neg_count / total_posts) * 100, 1)
    pct_neu = round((neu_count / total_posts) * 100, 1)

    # Perception Impact Score formula: 50 + (pos% - neg%) * 0.5 (scaled 0-100)
    perception_score = max(0, min(100, round(50 + (pct_pos - pct_neg) * 0.5, 1)))

    # Alerts Count
    alert_query = db.query(Alert).filter(Alert.status == "open")
    if brand_id:
        alert_query = alert_query.filter(Alert.brand_id == brand_id)
    active_alerts = alert_query.count()

    recent_alerts = [
        {
            "id": a.id,
            "brand_name": a.brand.name if a.brand else "Unknown",
            "negative_ratio": a.negative_ratio,
            "z_score": a.z_score,
            "severity": a.severity,
            "explanation": a.explanation,
            "status": a.status,
            "created_at": a.created_at.isoformat()
        }
        for a in alert_query.order_by(desc(Alert.created_at)).limit(5).all()
    ]

    # Daily sentiment trend
    daily_posts = db.query(
        func.date(Post.posted_at).label("day"),
        SentimentScore.label,
        func.count(SentimentScore.id)
    ).join(SentimentScore, Post.id == SentimentScore.post_id)\
     .filter(Post.id.in_(post_ids))\
     .group_by(func.date(Post.posted_at), SentimentScore.label)\
     .order_by("day").all()

    trend_map: Dict[str, Dict[str, Any]] = {}
    for day, label, count in daily_posts:
        day_str = str(day)
        if day_str not in trend_map:
            trend_map[day_str] = {"date": day_str, "positive": 0, "neutral": 0, "negative": 0}
        trend_map[day_str][label] = count

    trend_data = sorted(list(trend_map.values()), key=lambda x: x["date"])

    # Aspect Breakdown
    aspect_rows = db.query(
        AspectScore.aspect,
        AspectScore.polarity,
        func.count(AspectScore.id)
    ).filter(AspectScore.post_id.in_(post_ids))\
     .group_by(AspectScore.aspect, AspectScore.polarity).all()

    aspect_map: Dict[str, Dict[str, Any]] = {}
    for asp, pol, count in aspect_rows:
        if asp not in aspect_map:
            aspect_map[asp] = {"aspect": asp, "positive": 0, "neutral": 0, "negative": 0}
        aspect_map[asp][pol] = count

    aspect_breakdown = list(aspect_map.values())

    # Topic Themes
    topics = db.query(
        TopicAssignment.topic_label,
        func.count(TopicAssignment.id).label("volume"),
        func.avg(TopicAssignment.weight).label("avg_weight")
    ).filter(TopicAssignment.post_id.in_(post_ids))\
     .group_by(TopicAssignment.topic_label)\
     .order_by(desc("volume")).limit(5).all()

    top_topics = [
        {"topic": t[0], "volume": t[1], "relevance": round(t[2] or 0.85, 2)}
        for t in topics
    ]

    return {
        "total_posts": total_posts,
        "pct_positive": pct_pos,
        "pct_negative": pct_neg,
        "pct_neutral": pct_neu,
        "perception_score": perception_score,
        "active_alerts": active_alerts,
        "trend_data": trend_data,
        "aspect_breakdown": aspect_breakdown,
        "top_topics": top_topics,
        "recent_alerts": recent_alerts,
        "is_demo_data": True
    }

@router.get("/compare")
def compare_brands(brand_ids: str = Query(..., description="Comma separated brand IDs e.g. 1,2,3"), db: Session = Depends(get_db)):
    ids = [int(i.strip()) for i in brand_ids.split(",") if i.strip().isdigit()]
    if not ids or len(ids) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 brand IDs to compare.")

    brands = db.query(Brand).filter(Brand.id.in_(ids)).all()
    comparison_data = []

    for brand in brands:
        posts = db.query(Post).filter(Post.brand_id == brand.id).all()
        post_ids = [p.id for p in posts]
        total = len(post_ids)
        if total == 0:
            continue

        sentiments = db.query(SentimentScore.label, func.count(SentimentScore.id))\
            .filter(SentimentScore.post_id.in_(post_ids))\
            .group_by(SentimentScore.label).all()
        s_dict = {l: c for l, c in sentiments}

        pos = s_dict.get("positive", 0)
        neg = s_dict.get("negative", 0)
        pct_pos = round((pos / total) * 100, 1)
        pct_neg = round((neg / total) * 100, 1)
        score = max(0, min(100, round(50 + (pct_pos - pct_neg) * 0.5, 1)))

        # Aspect positive ratios
        aspect_ratios = {}
        for asp in ["price", "quality", "packaging", "service", "delivery"]:
            total_asp = db.query(AspectScore).filter(AspectScore.post_id.in_(post_ids), AspectScore.aspect == asp).count()
            pos_asp = db.query(AspectScore).filter(
                AspectScore.post_id.in_(post_ids),
                AspectScore.aspect == asp,
                AspectScore.polarity == "positive"
            ).count()
            aspect_ratios[asp] = round((pos_asp / total_asp * 100), 1) if total_asp > 0 else 50.0

        comparison_data.append({
            "brand_id": brand.id,
            "brand_name": brand.name,
            "industry": brand.industry,
            "total_posts": total,
            "pct_positive": pct_pos,
            "pct_negative": pct_neg,
            "perception_score": score,
            "aspect_strengths": aspect_ratios
        })

    return {"brands": comparison_data, "is_demo_data": True}
