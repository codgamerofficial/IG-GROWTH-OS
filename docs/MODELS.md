# ♾️ NUVEXA AI — Supported Open-Weight Models & Licensing Matrix

NUVEXA AI prioritizes permissively licensed open-source and open-weight models. Every model supported by the platform has its exact license and resource requirements documented below.

---

## 1. Supported Open-Weight Models

| Model Name | Parameter Size | Ollama Tag | License | Min RAM / VRAM | Recommended Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Meta Llama 3.2** | 3 Billion | `llama3.2` | Llama 3.2 Community License | 4GB RAM | Fast edge chat, mobile devices, general dialogue |
| **Mistral Instruct** | 7 Billion | `mistral` | Apache 2.0 (Fully Permissive) | 8GB RAM / 6GB VRAM | Instruction following, structured reasoning, summarization |
| **Qwen 2.5 Coder** | 7 Billion | `qwen2.5-coder:7b` | Apache 2.0 (Fully Permissive) | 8GB RAM / 6GB VRAM | Software architecture, debugging, multi-file refactoring |
| **DeepSeek R1 Distill** | 8 Billion | `deepseek-r1:8b` | MIT License (Fully Permissive) | 8GB RAM / 6GB VRAM | Chain-of-thought mathematical reasoning, logic proofs |
| **Google Gemma 2** | 9 Billion | `gemma2:9b` | Gemma Open Terms | 10GB RAM / 8GB VRAM | Academic research, factual synthesis, report writing |

---

## 2. Pull & Run Commands

```bash
# General Daily Driver (Fastest, 3B parameters)
ollama run llama3.2

# Permissive Apache 2.0 Benchmark Model
ollama run mistral

# Elite Coding Copilot
ollama run qwen2.5-coder:7b

# Deep Chain-of-Thought Reasoning
ollama run deepseek-r1:8b
```

---

## 3. Custom OpenAI-Compatible Endpoints

NUVEXA supports connecting to any cluster-hosted or local OpenAI-compatible inference server:
- **vLLM** (`http://cluster-ip:8000/v1`)
- **LMStudio** (`http://localhost:1234/v1`)
- **LocalAI** (`http://localhost:8080/v1`)
- **llama.cpp server** (`http://localhost:8080/v1`)

Configure the endpoint URL directly inside the **Settings & Privacy** panel.
