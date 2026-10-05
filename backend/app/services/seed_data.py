import random
import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.models.entities import (
    User, Brand, Post, SentimentScore, AspectScore, TopicAssignment, Alert, ReviewQueue
)
from app.services.mock_provider import MockModelProvider
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

BRANDS_DATA = [
    {"name": "NovaTech", "slug": "novatech", "industry": "Consumer Electronics"},
    {"name": "AuraAudio", "slug": "auraaudio", "industry": "Audio & Acoustics"},
    {"name": "PulseWear", "slug": "pulsewear", "industry": "Wearable Tech"},
]

TOPICS = [
    {"id": 1, "label": "Battery Life & Heating"},
    {"id": 2, "label": "Pricing & Discounts"},
    {"id": 3, "label": "Customer Support Response"},
    {"id": 4, "label": "Shipping & Package Damage"},
    {"id": 5, "label": "Build Quality & Materials"},
]

SAMPLE_TEMPLATES = {
    "positive": [
        "Absolutely loving my new {brand} gadget! Build quality is top tier and delivery was right on time.",
        "Best purchase of the month. {brand} service rep was courteous and resolved my query fast.",
        "The sound quality and craftsmanship from {brand} exceeded all my expectations. Worth every dollar!",
        "Stunning packaging and lightning fast courier shipping from {brand}.",
        "Impressed with the battery endurance and solid finish on this {brand} unit.",
    ],
    "neutral": [
        "Received the {brand} package today. Average packaging, will test the performance this weekend.",
        "Considering getting the new {brand} device. Does anyone know if shipping delay is common?",
        "Standard price for standard specs. Nothing crazy from {brand}, does the job okay.",
        "{brand} customer support asked for invoice copy before checking warranty status.",
    ],
    "negative": [
        "Extremely disappointed with {brand}. Broken screen after two days and customer support refuses refund!",
        "Terrible packaging, the box arrived completely crushed and delivery was delayed by a week.",
        "Overpriced waste of money. The build quality feels flimsy and cheap. Avoid {brand}!",
        "Customer service at {brand} is atrocious. Waited 45 minutes just to be disconnected.",
    ],
    "spike_negative": [
        "HORRIBLE! My {brand} device started overheating dangerously while charging. Cheap materials!",
        "Beware everyone: {brand} build quality is defective. Overheats within 15 minutes of use!",
        "Total garbage quality from {brand}. Burning plastic smell and rude customer service agents.",
        "Major safety hazard: {brand} battery swollen after one charge cycle. Refund immediately!",
        "Never buying {brand} again. Flawless marketing but terrible defective product.",
    ]
}

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Clear existing demo data to keep seed idempotent
    db.query(ReviewQueue).delete()
    db.query(Alert).delete()
    db.query(TopicAssignment).delete()
    db.query(AspectScore).delete()
    db.query(SentimentScore).delete()
    db.query(Post).delete()
    db.query(Brand).delete()
    db.query(User).delete()
    db.commit()

    print("[*] Creating Demo Users...")
    demo_user = User(
        email="demo@sentimentiq.ai",
        hashed_password=pwd_context.hash("demo1234"),
        full_name="Dr. Alex Morgan (Lead AI Researcher)",
        is_active=True
    )
    db.add(demo_user)

    print("[*] Creating Fictional Brands...")
    created_brands = []
    for b in BRANDS_DATA:
        brand_obj = Brand(name=b["name"], slug=b["slug"], industry=b["industry"])
        db.add(brand_obj)
        created_brands.append(brand_obj)
    db.commit()

    provider = MockModelProvider()
    now = datetime.datetime.utcnow()
    platforms = ["twitter", "reddit", "youtube", "reviews"]

    print("[*] Generating 30 days of synthetic posts across 3 brands...")
    # Inject spike on NovaTech around day 22-25
    for brand in created_brands:
        for day_offset in range(30, 0, -1):
            date_of_post = now - datetime.timedelta(days=day_offset)
            
            # Decide volume and sentiment distribution
            is_novatech_spike = (brand.slug == "novatech" and 6 <= day_offset <= 9)
            post_count = 25 if is_novatech_spike else random.randint(8, 14)

            for _ in range(post_count):
                if is_novatech_spike:
                    sentiment_pool = ["spike_negative"] * 7 + ["negative"] * 2 + ["neutral"] * 1
                else:
                    sentiment_pool = ["positive"] * 5 + ["neutral"] * 3 + ["negative"] * 2

                chosen_type = random.choice(sentiment_pool)
                template = random.choice(SAMPLE_TEMPLATES[chosen_type])
                post_text = template.format(brand=brand.name)

                # Random time during that day
                posted_time = date_of_post + datetime.timedelta(
                    hours=random.randint(0, 23),
                    minutes=random.randint(0, 59)
                )

                post = Post(
                    brand_id=brand.id,
                    platform=random.choice(platforms),
                    author=f"user_{random.randint(1000, 9999)}",
                    content=post_text,
                    posted_at=posted_time
                )
                db.add(post)
                db.flush()

                # Model Prediction
                pred = provider.predict([post_text])[0]
                sent_score = SentimentScore(
                    post_id=post.id,
                    label=pred["label"],
                    negative_prob=pred["probabilities"][0],
                    neutral_prob=pred["probabilities"][1],
                    positive_prob=pred["probabilities"][2],
                    confidence=pred["confidence"],
                    uncertain=pred["uncertain"],
                    sarcasm=pred["sarcasm"],
                    model_version="mock-v1.0"
                )
                db.add(sent_score)

                # Aspect Scores
                for aspect_name, aspect_val in pred["aspects"].items():
                    asp = AspectScore(
                        post_id=post.id,
                        aspect=aspect_name,
                        polarity=aspect_val["polarity"],
                        confidence=aspect_val["confidence"]
                    )
                    db.add(asp)

                # Topic Assignment
                topic = random.choice(TOPICS)
                if is_novatech_spike:
                    topic = TOPICS[0]  # Battery Life & Heating
                ta = TopicAssignment(
                    post_id=post.id,
                    topic_id=topic["id"],
                    topic_label=topic["label"],
                    weight=0.92
                )
                db.add(ta)

                # Add to review queue if low confidence or sarcasm
                if pred["uncertain"] or pred["sarcasm"]:
                    rq = ReviewQueue(
                        post_id=post.id,
                        flag_reason="sarcasm" if pred["sarcasm"] else "low_confidence",
                        original_label=pred["label"],
                        status="pending"
                    )
                    db.add(rq)

    # Inject Explicit Spike Alert on NovaTech
    print("[*] Creating Spike Alert for NovaTech...")
    novatech = next(b for b in created_brands if b.slug == "novatech")
    alert = Alert(
        brand_id=novatech.id,
        window_start=now - datetime.timedelta(days=8),
        window_end=now - datetime.timedelta(days=6),
        negative_ratio=0.74,
        z_score=3.82,
        severity="critical",
        top_aspect="quality",
        top_topic="Battery Life & Heating",
        explanation="Statistical spike detected (z=3.82). Negative sentiment surged to 74% driven by severe quality complaints regarding overheating during charging and battery swelling.",
        status="open",
        created_at=now - datetime.timedelta(days=6)
    )
    db.add(alert)

    # Moderate Alert for AuraAudio on Delivery
    auraaudio = next(b for b in created_brands if b.slug == "auraaudio")
    alert2 = Alert(
        brand_id=auraaudio.id,
        window_start=now - datetime.timedelta(days=14),
        window_end=now - datetime.timedelta(days=12),
        negative_ratio=0.48,
        z_score=2.15,
        severity="medium",
        top_aspect="delivery",
        top_topic="Shipping & Package Damage",
        explanation="Localized negative ratio elevation (z=2.15) attributed to courier transit delays and crushed external boxes.",
        status="acknowledged",
        created_at=now - datetime.timedelta(days=12)
    )
    db.add(alert2)

    db.commit()
    db.close()
    print("[OK] Database successfully populated with 30 days of synthetic demo data!")


if __name__ == "__main__":
    seed_database()
