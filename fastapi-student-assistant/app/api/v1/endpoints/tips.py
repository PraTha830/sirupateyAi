from fastapi import APIRouter, HTTPException
from app.schemas.tip import TipResponse
from app.services.tips import get_tips_by_topic

router = APIRouter()

@router.get("/tips", response_model=list[TipResponse])
async def fetch_tips(topic: str):
    tips = await get_tips_by_topic(topic)
    if not tips:
        raise HTTPException(status_code=404, detail="Tips not found")
    return tips