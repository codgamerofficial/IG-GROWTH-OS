from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import hashlib
import secrets
import time

router = APIRouter(prefix="/v1/auth", tags=["Non-Firebase Authentication"])

class AuthRequest(BaseModel):
    email: str
    password: str

# In-memory storage for demonstration & testing
USER_REGISTRY = {}

def hash_passphrase(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 10000).hex()

@router.post("/register")
async def register_user(body: AuthRequest):
    email = body.email.lower()
    if email in USER_REGISTRY:
        raise HTTPException(status_code=400, detail="Account already exists")

    salt = secrets.token_hex(16)
    p_hash = hash_passphrase(body.password, salt)
    user_id = f"usr_{secrets.token_hex(8)}"

    USER_REGISTRY[email] = {
        "id": user_id,
        "email": email,
        "salt": salt,
        "hash": p_hash,
        "created_at": time.time(),
    }

    token = f"nvx_token_{secrets.token_hex(20)}"
    return {
        "success": True,
        "user_id": user_id,
        "email": email,
        "token": token,
        "auth_engine": "PBKDF2-HMAC-SHA256 (Non-Firebase)"
    }

@router.post("/login")
async def login_user(body: AuthRequest):
    email = body.email.lower()
    record = USER_REGISTRY.get(email)
    if not record:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    computed = hash_passphrase(body.password, record["salt"])
    if not secrets.compare_digest(computed, record["hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = f"nvx_token_{secrets.token_hex(20)}"
    return {
        "success": True,
        "user_id": record["id"],
        "email": email,
        "token": token
    }
