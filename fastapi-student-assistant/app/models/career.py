from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    goal = Column(String, index=True)
    progress = Column(String, default="Not Started")
    resources = Column(String, default="[]")  # JSON string for resources

    user = relationship("User", back_populates="careers")