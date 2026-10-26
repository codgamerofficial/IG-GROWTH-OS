from fastapi import APIRouter
import httpx
import os

router = APIRouter(prefix="/v1/models", tags=["Models & Providers"])

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

MODELS_REGISTRY = [
    {
        "id": "llama-3.2-3b",
        "name": "Llama 3.2 (3B Instruct)",
        "provider": "ollama",
        "model_string": "llama3.2",
        "context_window": 128000,
        "license": "Llama 3.2 Community License",
        "is_local": True,
        "is_open_weight": True,
    },
    {
        "id": "mistral-7b",
        "name": "Mistral 7B (Instruct v0.3)",
        "provider": "ollama",
        "model_string": "mistral",
        "context_window": 32768,
        "license": "Apache 2.0",
        "is_local": True,
        "is_open_weight": True,
    },
    {
        "id": "qwen-2.5-coder-7b",
        "name": "Qwen 2.5 Coder (7B)",
        "provider": "ollama",
        "model_string": "qwen2.5-coder:7b",
        "context_window": 32768,
        "license": "Apache 2.0",
        "is_local": True,
        "is_open_weight": True,
    },
    {
        "id": "deepseek-r1-distill-8b",
        "name": "DeepSeek R1 Distill (8B)",
        "provider": "ollama",
        "model_string": "deepseek-r1:8b",
        "context_window": 65536,
        "license": "MIT",
        "is_local": True,
        "is_open_weight": True,
    },
]

@router.get("/")
async def list_models():
    # Probe Ollama directly
    ollama_status = "offline"
    available_tags = []
    
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            res = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if res.status_code == 200:
                ollama_status = "online"
                data = res.json()
                available_tags = [m.get("name") for m in data.get("models", [])]
    except Exception:
        ollama_status = "offline"

    return {
        "success": True,
        "models": MODELS_REGISTRY,
        "provider_health": {
            "ollama": {
                "status": ollama_status,
                "endpoint": OLLAMA_BASE_URL,
                "installed_models": available_tags,
            }
        }
    }
