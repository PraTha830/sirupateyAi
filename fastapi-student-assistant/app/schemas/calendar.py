from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class CalendarEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    category: Optional[str] = None

class CalendarEventCreate(CalendarEventBase):
    pass

class CalendarEventUpdate(CalendarEventBase):
    pass

class CalendarEvent(CalendarEventBase):
    id: int

    class Config:
        orm_mode = True

class DailyPlannerResponse(BaseModel):
    date: datetime
    events: List[CalendarEvent]

class WeeklyPlannerResponse(BaseModel):
    week_start: datetime
    week_end: datetime
    events: List[CalendarEvent]