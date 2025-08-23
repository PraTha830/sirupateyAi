from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.v1.api import api_router
from app.core.middleware import setup_middleware

# Initialize FastAPI app
app = FastAPI(title="AI-Powered Student Assistant")

# Setup middleware
setup_middleware(app)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Health check endpoints
@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/ready")
async def readiness_check():
    return {"status": "ready"}

@app.get("/version")
async def version():
    return {"version": "1.0.0"}

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down the application...")