from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import time

router = APIRouter(prefix="/v1/tasks", tags=["Task Planner"])

class TaskPlanRequest(BaseModel):
    goal: str

class AdvanceStepRequest(BaseModel):
    task_id: str
    step_index: int
    permission_granted: bool = False

@router.post("/plan")
async def create_plan(body: TaskPlanRequest):
    goal = body.goal.strip()
    is_coding = any(k in goal.lower() for k in ["code", "build", "script", "api", "database"])
    
    steps = [
        {
            "step_number": 1,
            "title": "Parse Goal & Architectural Boundaries",
            "description": "Establish parameter constraints and execution invariants.",
            "requires_permission": False,
            "status": "completed",
        },
        {
            "step_number": 2,
            "title": "Query Specifications & External Citations",
            "description": "Retrieve live documentation and open-source references.",
            "requires_permission": True,
            "tool_name": "network_retrieval",
            "status": "paused",
        },
        {
            "step_number": 3,
            "title": "Synthesize Core Implementation",
            "description": "Generate clean, type-safe implementation code.",
            "requires_permission": False,
            "status": "pending",
        },
        {
            "step_number": 4,
            "title": "Isolated Sandbox Audit",
            "description": "Execute syntax validation inside restrained environment.",
            "requires_permission": True,
            "tool_name": "sandbox_runner",
            "status": "pending",
        }
    ]

    return {
        "success": True,
        "task_id": f"tsk_{int(time.time())}",
        "goal": goal,
        "status": "paused",
        "current_step": 1,
        "steps": steps
    }
