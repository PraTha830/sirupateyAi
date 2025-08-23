from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Note(Base):
    __tablename__ = 'notes'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    tags = Column(String, index=True)  # Comma-separated tags for filtering
    created_at = Column(Integer)  # Timestamp for creation
    updated_at = Column(Integer)  # Timestamp for last update