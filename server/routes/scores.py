from fastapi import APIRouter, Header
from pydantic import BaseModel
from utils.database import supabase
from typing import Optional

router = APIRouter()

# --- Model ---
class ComparisonScore(BaseModel):
    upward_score: float
    downward_score: float
    neutral_score: float
    comparison_index: float
    risk_level: str
    score_date: Optional[str] = None

# --- Create a score ---
@router.post("/")
def create_score(score: ComparisonScore, user_id: str = Header(...)):
    try:
        response = supabase.table("comparison_scores").insert({
            "user_id": user_id,
            "upward_score": score.upward_score,
            "downward_score": score.downward_score,
            "neutral_score": score.neutral_score,
            "comparison_index": score.comparison_index,
            "risk_level": score.risk_level,
            "score_date": score.score_date
        }).execute()
        return {"message": "Score saved successfully ✅", "data": response.data}
    except Exception as e:
        return {"message": "Score save failed ❌", "error": str(e)}

# --- Get all scores for a user ---
@router.get("/")
def get_scores(user_id: str = Header(...)):
    try:
        response = supabase.table("comparison_scores").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return {"message": "Scores retrieved ✅", "data": response.data}
    except Exception as e:
        return {"message": "Failed to retrieve scores ❌", "error": str(e)}

# --- Get latest score for a user ---
@router.get("/latest")
def get_latest_score(user_id: str = Header(...)):
    try:
        response = supabase.table("comparison_scores").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
        return {"message": "Latest score retrieved ✅", "data": response.data}
    except Exception as e:
        return {"message": "Failed to retrieve latest score ❌", "error": str(e)}

# --- Get scores by risk level ---
@router.get("/risk/{risk_level}")
def get_scores_by_risk(risk_level: str, user_id: str = Header(...)):
    try:
        response = supabase.table("comparison_scores").select("*").eq("user_id", user_id).eq("risk_level", risk_level).order("created_at", desc=True).execute()
        return {"message": f"{risk_level} risk scores retrieved ✅", "data": response.data}
    except Exception as e:
        return {"message": "Failed to retrieve scores ❌", "error": str(e)}

# --- Delete a score ---
@router.delete("/{score_id}")
def delete_score(score_id: str, user_id: str = Header(...)):
    try:
        response = supabase.table("comparison_scores").delete().eq("id", score_id).eq("user_id", user_id).execute()
        return {"message": "Score deleted ✅"}
    except Exception as e:
        return {"message": "Failed to delete score ❌", "error": str(e)}