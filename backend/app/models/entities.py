import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    industry = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    posts = relationship("Post", back_populates="brand", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="brand", cascade="all, delete-orphan")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=True, index=True)
    platform = Column(String(50), default="twitter", index=True)  # twitter, reddit, instagram, etc.
    author = Column(String(100), default="anonymous_user")
    content = Column(Text, nullable=False)
    posted_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    brand = relationship("Brand", back_populates="posts")
    sentiment = relationship("SentimentScore", back_populates="post", uselist=False, cascade="all, delete-orphan")
    aspect_scores = relationship("AspectScore", back_populates="post", cascade="all, delete-orphan")
    topic_assignment = relationship("TopicAssignment", back_populates="post", uselist=False, cascade="all, delete-orphan")
    review_queue_item = relationship("ReviewQueue", back_populates="post", uselist=False, cascade="all, delete-orphan")

class SentimentScore(Base):
    __tablename__ = "sentiment_scores"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, unique=True, index=True)
    label = Column(String(20), nullable=False)  # negative, neutral, positive
    negative_prob = Column(Float, nullable=False)
    neutral_prob = Column(Float, nullable=False)
    positive_prob = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    uncertain = Column(Boolean, default=False)
    sarcasm = Column(Boolean, default=False)
    model_version = Column(String(50), default="mock-v1.0")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    post = relationship("Post", back_populates="sentiment")

class AspectScore(Base):
    __tablename__ = "aspect_scores"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, index=True)
    aspect = Column(String(50), nullable=False)  # price, quality, packaging, service, delivery
    polarity = Column(String(20), nullable=False)  # negative, neutral, positive
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    post = relationship("Post", back_populates="aspect_scores")

class TopicAssignment(Base):
    __tablename__ = "topic_assignments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, unique=True, index=True)
    topic_id = Column(Integer, nullable=False)
    topic_label = Column(String(100), nullable=False)
    weight = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    post = relationship("Post", back_populates="topic_assignment")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False, index=True)
    window_start = Column(DateTime, nullable=False)
    window_end = Column(DateTime, nullable=False)
    negative_ratio = Column(Float, nullable=False)
    z_score = Column(Float, nullable=False)
    severity = Column(String(20), default="medium")  # low, medium, high, critical
    top_aspect = Column(String(50), nullable=True)
    top_topic = Column(String(100), nullable=True)
    explanation = Column(Text, nullable=False)
    status = Column(String(20), default="open")  # open, acknowledged, closed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    brand = relationship("Brand", back_populates="alerts")

class ReviewQueue(Base):
    __tablename__ = "review_queue"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, unique=True, index=True)
    flag_reason = Column(String(100), nullable=False)  # low_confidence, sarcasm
    original_label = Column(String(20), nullable=False)
    corrected_label = Column(String(20), nullable=True)  # negative, neutral, positive
    status = Column(String(20), default="pending")  # pending, reviewed, dismissed
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    post = relationship("Post", back_populates="review_queue_item")
