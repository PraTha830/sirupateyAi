from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate

class ReminderService:
    def __init__(self, db: Session):
        self.db = db

    def create_reminder(self, reminder: ReminderCreate, user_id: int) -> Reminder:
        db_reminder = Reminder(**reminder.dict(), user_id=user_id)
        self.db.add(db_reminder)
        self.db.commit()
        self.db.refresh(db_reminder)
        return db_reminder

    def get_reminders(self, user_id: int):
        return self.db.query(Reminder).filter(Reminder.user_id == user_id).all()

    def delete_reminder(self, reminder_id: int):
        reminder = self.db.query(Reminder).filter(Reminder.id == reminder_id).first()
        if reminder is None:
            raise HTTPException(status_code=404, detail="Reminder not found")
        self.db.delete(reminder)
        self.db.commit()

    def update_reminder(self, reminder_id: int, reminder_update: ReminderUpdate):
        reminder = self.db.query(Reminder).filter(Reminder.id == reminder_id).first()
        if reminder is None:
            raise HTTPException(status_code=404, detail="Reminder not found")
        for key, value in reminder_update.dict(exclude_unset=True).items():
            setattr(reminder, key, value)
        self.db.commit()
        self.db.refresh(reminder)
        return reminder