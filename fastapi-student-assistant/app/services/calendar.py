from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.calendar import Calendar
from app.schemas.calendar import CalendarCreate, CalendarUpdate

class CalendarService:
    def __init__(self, db: Session):
        self.db = db

    def create_event(self, event: CalendarCreate):
        db_event = Calendar(**event.dict())
        self.db.add(db_event)
        self.db.commit()
        self.db.refresh(db_event)
        return db_event

    def get_daily_events(self, user_id: int):
        return self.db.query(Calendar).filter(Calendar.user_id == user_id, Calendar.date == date.today()).all()

    def get_weekly_events(self, user_id: int):
        start_date = date.today() - timedelta(days=date.today().weekday())
        end_date = start_date + timedelta(days=7)
        return self.db.query(Calendar).filter(Calendar.user_id == user_id, Calendar.date >= start_date, Calendar.date < end_date).all()

    def update_event(self, event_id: int, event_update: CalendarUpdate):
        db_event = self.db.query(Calendar).filter(Calendar.id == event_id).first()
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")
        for key, value in event_update.dict(exclude_unset=True).items():
            setattr(db_event, key, value)
        self.db.commit()
        self.db.refresh(db_event)
        return db_event

    def delete_event(self, event_id: int):
        db_event = self.db.query(Calendar).filter(Calendar.id == event_id).first()
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")
        self.db.delete(db_event)
        self.db.commit()
        return {"detail": "Event deleted successfully"}