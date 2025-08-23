from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class CalendarEvent(Base):
    __tablename__ = 'calendar_events'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    category = Column(String, nullable=True)  # For color-coded categories
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)