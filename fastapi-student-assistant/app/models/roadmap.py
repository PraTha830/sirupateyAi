from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    description = Column(String)
    milestones = Column(String)  # This could be a JSON string or a separate model
    created_at = Column(Integer)  # Timestamp for creation
    updated_at = Column(Integer)  # Timestamp for last update

    user = relationship("User", back_populates="roadmaps")  # Assuming a User model exists with a relationship defined

    def __repr__(self):
        return f"<Roadmap(id={self.id}, title={self.title}, user_id={self.user_id})>"