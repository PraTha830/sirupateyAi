from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.career import CareerCreate, CareerRead
from app.services.career import CareerService

router = APIRouter()

@router.post("/goals", response_model=CareerRead)
def create_career_goal(goal: CareerCreate, db: Session = Depends(get_db)):
    return CareerService.create_goal(db=db, goal=goal)

@router.get("/goals", response_model=list[CareerRead])
def list_career_goals(db: Session = Depends(get_db)):
    return CareerService.get_goals(db=db)