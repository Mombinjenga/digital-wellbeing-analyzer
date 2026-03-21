from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from utils.database import supabase
from routes.auth import router as auth_router
from routes.checkins import router as checkins_router
from routes.usage import router as usage_router
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Digital Well-Being Analyzer API",
    description="Backend API for monitoring and managing social media comparison effects",
    version="1.0.0"
)

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(checkins_router, prefix="/checkins", tags=["Mood Checkins"])
app.include_router(usage_router, prefix="/usage", tags=["Usage Logs"])

# Health check route
@app.get("/")
def root():
    return {"message": "Digital Well-Being Analyzer API is running 🚀"}

# Test database connection
@app.get("/test-db")
def test_db():
    try:
        response = supabase.table("profiles").select("*").limit(1).execute()
        return {"message": "Database connected successfully ✅", "data": response.data}
    except Exception as e:
        return {"message": "Database connection failed ❌", "error": str(e)}