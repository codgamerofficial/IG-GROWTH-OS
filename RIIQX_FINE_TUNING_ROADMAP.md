# RIIQX Fine-Tuning & Model Training Roadmap
**Document Version:** 2.0.0  
**Phase:** Architectural Planning & Dataset Specification  
**Current Execution State:** Roadmap & Data Framework Ready (No unverified downloads or costly runs)

---

## 1. Executive Strategy

Fine-tuning in RIIQX is treated with extreme engineering discipline. The platform adopts the rule:  
**"Use RAG, system memory, tool calling, and prompt engineering first; only fine-tune when behavioral alignment cannot be achieved with existing weights."**

RIIQX will not download multi-gigabyte checkpoints automatically or initiate unbudgeted cloud training jobs.

---

## 2. Target Base Models for Future Fine-Tuning

| Base Model | Architecture | Parameter Scale | Target Modality | License | Fine-Tuning Method |
|---|---|---|---|---|---|
| **Qwen 2.5 Coder** | Dense Transformer | 7B / 14B | Code & AST Validation | Apache 2.0 | QLoRA (4-bit quantization) |
| **Llama 3.2** | Dense Transformer | 1B / 3B | On-Device Creator Copilot | Llama 3.2 Community | LoRA (Rank 16, Alpha 32) |
| **Aya Expanse** | Dense Transformer | 8B / 32B | Bengali Cultural Nuance | Open Weights | Supervised Fine-Tuning (SFT) |
| **Nemotron Mini** | Hybrid Transformer | 4B | Agent Tool Calling & Planner | NVIDIA Open Model | NeMo Framework Alignment |

---

## 3. Dataset Collection & Quality Pipeline

1. **RIIQX Instruction & Agent Dataset**:
   - 10,000 verified multi-turn creator workflows.
   - Pacing, 3-second hook formulation, audio ducking commands, and 9:16 layout constraints.
2. **Bengali Multimodal & Conversational Dataset**:
   - High-fidelity colloquial and formal Bengali creator prompts.
   - Cultural event narratives (Durga Puja, Kolkata tech ecosystem, Bengali literature).
3. **Safety & Permission Barrier Dataset**:
   - Examples reinforcing human-in-the-loop approval brakes for social publishing and destructive operations.
   - Negative examples training the model to reject prompt injections in user-uploaded documents.

---

## 4. Compute & Execution Requirements

- **Local Hardware Gating**: Fine-tuning requires an NVIDIA GPU with at least 16GB VRAM (for QLoRA 7B) or 24GB VRAM (for LoRA 14B).
- **Zero Simulation Rule**: RIIQX will not label any model "Fine-Tuned" until an actual training run has completed, loss curves have converged, and post-training eval benchmarks have passed.

