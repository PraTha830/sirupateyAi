from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ReminderBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: datetime
    user_id: int

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(ReminderBase):
    completed: Optional[bool] = False

class Reminder(ReminderBase):
    id: int
    completed: bool = False

    class Config:
        orm_mode = True

class ReminderList(BaseModel):
    reminders: List[Reminder]