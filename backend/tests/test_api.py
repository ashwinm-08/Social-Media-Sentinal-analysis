import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.mock_provider import MockModelProvider

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_model_info():
    response = client.get("/api/model/info")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert data["is_mock"] is True

def test_predict_positive():
    payload = {
        "texts": ["I absolutely love this smartphone! The quality is amazing and delivery was super fast."]
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) == 1
    item = data["results"][0]
    assert item["label"] == "positive"
    assert len(item["probabilities"]) == 3
    assert item["confidence"] > 0.5
    assert "aspects" in item
    assert "quality" in item["aspects"]
    assert "delivery" in item["aspects"]
    assert item["aspects"]["quality"]["polarity"] == "positive"

def test_predict_negative():
    payload = {
        "texts": ["Terrible customer service and broken screen! Total waste of money."]
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    item = data["results"][0]
    assert item["label"] == "negative"
    assert item["confidence"] > 0.5
    assert item["aspects"]["service"]["polarity"] == "negative"
    assert item["aspects"]["price"]["polarity"] == "negative"

def test_predict_sarcasm_detection():
    payload = {
        "texts": ["Oh great, another package delayed by 2 weeks. Total genius courier /s"]
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    item = data = response.json()["results"][0]
    assert item["sarcasm"] is True
    assert item["label"] == "negative"

def test_predict_aspect_structure():
    payload = {
        "texts": ["The price is high and overpriced, but packaging was good."]
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    item = response.json()["results"][0]
    for required_aspect in ["price", "quality", "packaging", "service", "delivery"]:
        assert required_aspect in item["aspects"]
        assert "polarity" in item["aspects"][required_aspect]
        assert "confidence" in item["aspects"][required_aspect]

def test_predict_validation_empty():
    response = client.post("/api/predict", json={"texts": []})
    assert response.status_code == 422 or response.status_code == 400
