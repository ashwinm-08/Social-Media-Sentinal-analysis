# SentimentIQ: Social Media Sentiment Intelligence for Product Perception Modeling
> **B.E. (AI & ML) Capstone Project**  
> An end-to-end full-stack intelligence system for multi-aspect sentiment modeling, anomaly spike detection, and human-in-the-loop retraining.

---

## 🚀 One-Command Start (Docker Compose)

Start the entire stack (PostgreSQL, FastAPI Backend, and React Frontend) with one command:

```bash
docker-compose up --build
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 💻 Local Development Setup

### 1. Backend (FastAPI + SQLite/Postgres)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # Windows (or source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt

# Run migrations and seed 30 days of demo data
alembic upgrade head
python -m app.services.seed_data

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`

### 2. Frontend (React + Vite + TypeScript + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🔑 Demo Login Credentials
- **Email**: `demo@sentimentiq.ai`
- **Password**: `demo1234`

Protected operational views: Executive Dashboard, Root-Cause Alerts, Review Queue, and Batch CSV Analysis.  
Public views: Landing Page, Live Analyzer, Brand Compare, and About/Methodology.

---

## 🧠 Switching from Mock Model to Trained HuggingFace Model

The platform features a modular **Model Provider** layer. You can switch between deterministic rule/lexicon modeling and a custom fine-tuned transformer model with **one environment variable**:

In your `.env` (or `docker-compose.yml`):
```bash
# Set to 'hf' to load your fine-tuned model
MODEL_PROVIDER=hf

# Directory containing your local PyTorch / HuggingFace model weights and tokenizer
MODEL_DIR=./saved_models/sentiment_model
```

### Required Model Directory Format
Your `MODEL_DIR` should contain standard Hugging Face export files:
```text
saved_models/sentiment_model/
├── config.json
├── pytorch_model.bin  (or model.safetensors)
├── tokenizer.json
└── vocab.txt
```

When started with `MODEL_PROVIDER=hf`, SentimentIQ automatically:
1. Loads the PyTorch / Transformers classification pipeline.
2. Informs the UI badge: `Model: HuggingFace (sentiment_model)`.
3. Falls back gracefully to `mock (demo)` if local model files are absent.

---

## 🧪 Testing

Run automated tests:
```bash
# Backend pytest suite
cd backend
.\venv\Scripts\python.exe -m pytest -v tests
```
All tests verify `/api/predict` exact input/output contracts, confidence calibration, sarcasm handling, and per-aspect decomposition.
