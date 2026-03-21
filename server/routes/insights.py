from fastapi import APIRouter, Header
from pydantic import BaseModel
from utils.database import supabase
from typing import Optional

router = APIRouter()

# --- Model ---
class Insight(BaseModel):
    category: str
    message: str

# --- Create an insight ---
@router.post("/")
def create_insight(insight: Insight, user_id: str = Header(...)):
    try:
        response = supabase.table("insights").insert({
            "user_id": user_id,
            "category": insight.category,
            "message": insight.message
        }).execute()
        return {"message": "Insight saved successfully ✅", "data": response.data}
    except Exception as e:
        return {"message": "Insight save failed ❌", "error": str(e)}

# --- Get all insights for a user ---
@router.get("/")
def get_insights(user_id: str = Header(...)):
    try:
        response = supabase.table("insights").select("*").eq("user_id", user_id).order("generated_at", desc=True).execute()
        return {"message": "Insights retrieved ✅", "data": response.data}
    except Exception as e:
        return {"message": "Failed to retrieve insights ❌", "error": str(e)}

# --- Get unread insights ---
@router.get("/unread")
def get_unread_insights(user_id: str = Header(...)):
    try:
        response = supabase.table("insights").select("*").eq("user_id", user_id).eq("is_read", False).order("generated_at", desc=True).execute()
        return {"message": "Unread insights retrieved ✅", "data": response.data}
    except Exception as e:
        return {"message": "Failed to retrieve unread insights ❌", "error": str(e)}

# --- Mark insight as read ---
@router.patch("/{insight_id}/read")
def mark_as_read(insight_id: str, user_id: str = Header(...)):
    try:
        response = supabase.table("insights").update({"is_read": True}).eq("id", insight_id).eq("user_id", user_id).execute()
        return {"message": "Insight marked as read ✅"}
    except Exception as e:
        return {"message": "Failed to mark insight as read ❌", "error": str(e)}

# --- Delete an insight ---
@router.delete("/{insight_id}")
def delete_insight(insight_id: str, user_id: str = Header(...)):
    try:
        response = supabase.table("insights").delete().eq("id", insight_id).eq("user_id", user_id).execute()
        return {"message": "Insight deleted ✅"}
    except Exception as e:
        return {"message": "Failed to delete insight ❌", "error": str(e)}