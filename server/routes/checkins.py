from fastapi import APIRouter, Header
from pydantic import BaseModel
from utils.database import supabase
from typing import Optional

router = APIRouter()

# --- Model ---
class MoodCheckin(BaseModel):
    mood_score: int
    note: Optional[str] = None
    platform: Optional[str] = None

# --- Create a check-in ---
@router.post("/")
def create_checkin(checkin: MoodCheckin, user_id: str = Header(...)):
    try:
        response = supabase.table("mood_checkins").insert({
            "user_id": user_id,
            "mood_score": checkin.mood_score,
            "note": checkin.note,
            "platform": checkin.platform
        }).execute()
        return {"message": "Check-in saved successfully ✅", "data": response.data}
    except Exception as e:
        return {"message": "Check-in failed ❌", "error": str(e)}

# --- Get all check-ins for a user ---
@router.get("/")
def get_checkins(user_id: str = Header(...)):
    try:
        response = supabase.table("mood_checkins").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return {"message": "Check-ins retrieved ✅", "data": response.data}
    except Exception as e:
        return {"message": "Failed to retrieve check-ins ❌", "error": str(e)}

# --- Get a single check-in ---
@router.get("/{checkin_id}")
def get_checkin(checkin_id: str, user_id: str = Header(...)):
    try:
        response = supabase.table("mood_checkins").select("*").eq("id", checkin_id).eq("user_id", user_id).execute()
        return {"message": "Check-in retrieved ✅", "data": response.data}
    except Exception as e:
        return {"message"}