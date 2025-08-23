from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.roadmap import RoadmapCreate, RoadmapResponse
from app.services.roadmap import RoadmapService

router = APIRouter()

@router.post("/", response_model=RoadmapResponse)
def create_roadmap(roadmap: RoadmapCreate, db: Session = Depends(get_db)):
    return RoadmapService.create_roadmap(db=db, roadmap=roadmap)

@router.get("/{user_id}", response_model=RoadmapResponse)
def get_roadmap(user_id: int, db: Session = Depends(get_db)):
    roadmap = RoadmapService.get_roadmap(db=db, user_id=user_id)
    if roadmap is None:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap