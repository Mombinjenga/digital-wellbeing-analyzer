from fastapi import APIRouter, Header
from pydantic import BaseModel
from utils.database import supabase
from ml.sentiment import analyze_sentiment, detect_comparison, calculate_comparison_index, get_risk_level, get_recommendations
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
        # Run ML analysis on the note
        sentiment = analyze_sentiment(checkin.note)
        comparison = detect_comparison(checkin.note)
        comparison_index = calculate_comparison_index(
            checkin.mood_score,
            sentiment["sentiment_score"],
            comparison["upward_score"]
        )
        risk_level = get_risk_level(comparison_index)
        recommendations = get_recommendations(risk_level, comparison["upward_score"], sentiment["sentiment_label"])

        # Save check-in with sentiment results
        checkin_response = supabase.table("mood_checkins").insert({
            "user_id": user_id,
            "mood_score": checkin.mood_score,
            "note": checkin.note,
            "platform": checkin.platform,
            "sentiment_label": sentiment["sentiment_label"],
            "sentiment_score": sentiment["sentiment_score"]
        }).execute()

        # Save comparison score
        supabase.table("comparison_scores").insert({
            "user_id": user_id,
            "upward_score": comparison["upward_score"],
            "downward_score": comparison["downward_score"],
            "neutral_score": comparison["neutral_score"],
            "comparison_index": comparison_index,
            "risk_level": risk_level
        }).execute()

        # Save recommendations as insights
        for rec in recommendations:
            supabase.table("insights").insert({
                "user_id": user_id,
                "category": rec["category"],
                "message": rec["message"]
            }).execute()

        return {
            "message": "Check-in saved successfully ✅",
            "data": checkin_response.data,
            "analysis": {
                "sentiment": sentiment,
                "comparison": comparison,
                "comparison_index": comparison_index,
                "risk_level": risk_level,
                "recommendations": recommendations
            }
        }
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
        return {"message": "Failed to retrieve check-in ❌", "error": str(e)}

# --- Delete a check-in ---
@router.delete("/{checkin_id}")
def delete_checkin(checkin_id: str, user_id: str = Header(...)):
    try:
        response = supabase.table("mood_checkins").delete().eq("id", checkin_id).eq("user_id", user_id).execute()
        return {"message": "Check-in deleted ✅"}
    except Exception as e:
        return {"message": "Failed to delete check-in ❌", "error": str(e)}