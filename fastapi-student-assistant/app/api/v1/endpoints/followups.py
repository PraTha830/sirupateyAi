from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderOut
from app.services.reminders import ReminderService

router = APIRouter()

@router.get("/{user_id}", response_model=list[ReminderOut])
def get_followups(user_id: int, db: Session = Depends(get_db)):
    followups = ReminderService.get_followups(db, user_id)
    if not followups:
        raise HTTPException(status_code=404, detail="No follow-ups found")
    return followups

@router.post("/", response_model=ReminderOut)
def log_followup(reminder: ReminderCreate, db: Session = Depends(get_db)):
    return ReminderService.create_followup(db, reminder)