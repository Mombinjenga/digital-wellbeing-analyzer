from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.database import get_supabase

router = APIRouter()

# --- Models ---
class RegisterUser(BaseModel):
    email: str
    password: str
    full_name: str

class LoginUser(BaseModel):
    email: str
    password: str


# --- Register ---
@router.post("/register")
def register(user: RegisterUser):
    supabase = get_supabase()
    try:
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })

        if getattr(response, "error", None):
            raise HTTPException(status_code=400, detail=str(response.error))

        if response.user:
            return {"message": "Registration successful", "user": response.user.email}

        raise HTTPException(status_code=400, detail="Registration failed: No user returned")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Login ---
@router.post("/login")
def login(user: LoginUser):
    supabase = get_supabase()
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {
            "message": "Login successful",
            "access_token": response.session.access_token,
            "user": response.user.email,
            "user_id": str(response.user.id)
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

# --- Logout ---
@router.post("/logout")
def logout():
    supabase = get_supabase()
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))