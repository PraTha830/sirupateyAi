from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.get("/ready")
async def readiness_check():
    # Implement readiness logic if needed
    return {"status": "ready"}

@router.get("/version")
async def version():
    return {"version": "1.0.0"}  # Update with actual versioning logic if necessary