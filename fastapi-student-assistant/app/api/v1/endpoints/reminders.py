from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderOut
from app.services.reminders import ReminderService

router = APIRouter()

@router.post("/", response_model=ReminderOut)
def create_reminder(reminder: ReminderCreate, db: Session = Depends(get_db)):
    return ReminderService.create_reminder(db=db, reminder=reminder)

@router.get("/{user_id}", response_model=list[ReminderOut])
def get_reminders(user_id: int, db: Session = Depends(get_db)):
    reminders = ReminderService.get_reminders_by_user(db=db, user_id=user_id)
    if not reminders:
        raise HTTPException(status_code=404, detail="No reminders found")
    return reminders

@router.delete("/{id}", response_model=dict)
def delete_reminder(id: int, db: Session = Depends(get_db)):
    result = ReminderService.delete_reminder(db=db, reminder_id=id)
    if not result:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return {"detail": "Reminder deleted successfully"}