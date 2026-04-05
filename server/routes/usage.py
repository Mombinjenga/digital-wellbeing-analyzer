from fastapi import APIRouter, Header
from pydantic import BaseModel
from utils.database import get_supabase
from typing import Optional

router = APIRouter()

# --- Model ---
class UsageLog(BaseModel):
    platform: str
    duration_minutes: int
    session_date: Optional[str] = None

# --- Log usage ---
@router.post("/")
def create_usage_log(log: UsageLog, user_id: str = Header(...)):
    supabase = get_supabase()
    try:
        response = supabase.table("usage_logs").insert({
            "user_id": user_id,
            "platform": log.platform,
            "duration_minutes": log.duration_minutes,
            "session_date": log.session_date
        }).execute()
        return {"message": "Usage logged successfully ✅", "data": response.data}
    except Exception as e:
        return {"message": "Usage log failed ❌", "error": str(e)}

# --- Get all usage logs for a user ---
@router.get("/")
def get_usage_logs(user_id: str = Header(...)):
    supabase = get_supabase()
    try:
        response = supabase.table("usage_logs").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return {"message": "Usage logs retrieved ✅", "data": response.data}
    except Exception as e:
        return {"message": "Failed to retrieve usage logs ❌", "error": str(e)}

# --- Get usage logs by platform ---
@router.get("/{platform}")
def get_usage_by_platform(platform: str, user_id: str = Header(...)):
    supabase = get_supabase()
    try:
        response = supabase.table("usage_logs").select("*").eq("user_id", user_id).eq("platform", platform).order("created_at", desc=True).execute()
        return {"message": f"{platform} usage logs retrieved ✅", "data": response.data}
    except Exception as e:
        return {"message": "Failed to retrieve usage logs ❌", "error": str(e)}

# --- Delete a usage log ---
@router.delete("/{log_id}")
def delete_usage_log(log_id: str, user_id: str = Header(...)):
    supabase = get_supabase()
    try:
        response = supabase.table("usage_logs").delete().eq("id", log_id).eq("user_id", user_id).execute()
        return {"message": "Usage log deleted ✅"}
    except Exception as e:
        return {"message": "Failed to delete usage log ❌", "error": str(e)}