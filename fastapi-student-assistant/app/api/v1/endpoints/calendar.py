from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.calendar import Calendar
from app.schemas.calendar import CalendarCreate, CalendarResponse
from app.services.calendar import create_event, get_daily_events, get_weekly_events

router = APIRouter()

@router.post("/events", response_model=CalendarResponse)
def add_event(event: CalendarCreate, db: Session = Depends(get_db)):
    return create_event(db=db, event=event)

@router.get("/daily/{user_id}", response_model=list[CalendarResponse])
def fetch_daily_planner(user_id: int, db: Session = Depends(get_db)):
    events = get_daily_events(db=db, user_id=user_id)
    if not events:
        raise HTTPException(status_code=404, detail="No events found for the day.")
    return events

@router.get("/weekly/{user_id}", response_model=list[CalendarResponse])
def fetch_weekly_planner(user_id: int, db: Session = Depends(get_db)):
    events = get_weekly_events(db=db, user_id=user_id)
    if not events:
        raise HTTPException(status_code=404, detail="No events found for the week.")
    return events