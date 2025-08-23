from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Tip(Base):
    __tablename__ = "tips"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, index=True)
    content = Column(String, nullable=False)