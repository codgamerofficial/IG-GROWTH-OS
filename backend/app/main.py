"""
NUVEXA AI — Master Python FastAPI Service
One Assistant. Many Possibilities.
Open-source • Multi-Model • Zero-Firebase • Pure Python & Async
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time

from .routers import models, search, documents, tasks, auth

app = FastAPI(
    title="NUVEXA AI Core Engine",
    description="Production-oriented, open-source multi-model AI assistant backend service.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All Feature Routers
app.include_router(models.router)
app.include_router(search.router)
app.include_router(documents.router)
app.include_router(tasks.router)
app.include_router(auth.router)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    response.headers["X-Nuvexa-Engine"] = "Production-v1.0"
    return response

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "engine": "NUVEXA AI Python Core",
        "timestamp": time.time(),
        "zero_firebase": True,
        "open_weight_first": True,
    }

@app.get("/")
async def root():
    return {
        "name": "NUVEXA AI",
        "tagline": "One Assistant. Many Possibilities.",
        "documentation": "/docs",
        "status": "active",
    }
