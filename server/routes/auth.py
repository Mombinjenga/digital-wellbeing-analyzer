from fastapi import APIRouter
from pydantic import BaseModel
from utils.database import supabase

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
    try:
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {"full_name": user.full_name},
                "email_redirect_to": None
            }
        })
        if response.user:
            return {"message": "Registration successful", "user": response.user.email}
        else:
            return {"message": "Registration failed", "error": "No user returned"}
    except Exception as e:
        return {"message": "Registration failed", "error": str(e)}


# --- Login ---
@router.post("/login")
def login(user: LoginUser):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {
            "message": "Login successful",
            "access_token": response.session.access_token,
            "user": response.user.email
        }
    except Exception as e:
        return {"message": "Login failed", "error": str(e)}


# --- Logout ---
@router.post("/logout")
def logout():
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        return {"message": "Logout failed", "error": str(e)}