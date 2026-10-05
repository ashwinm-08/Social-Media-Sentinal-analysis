from app.core.config import settings
from app.services.base_provider import ModelProvider
from app.services.mock_provider import MockModelProvider
from app.services.hf_provider import HuggingFaceProvider

_provider_instance: ModelProvider = None

def get_model_provider() -> ModelProvider:
    global _provider_instance
    if _provider_instance is None:
        if settings.MODEL_PROVIDER.lower() == "hf":
            _provider_instance = HuggingFaceProvider(settings.MODEL_DIR)
        else:
            _provider_instance = MockModelProvider()
    return _provider_instance
