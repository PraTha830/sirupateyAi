from sqlalchemy.orm import Session
from app.models.career import Career
from app.schemas.career import CareerCreate, CareerUpdate

class CareerService:
    def __init__(self, db: Session):
        self.db = db

    def create_career_goal(self, career_goal: CareerCreate):
        db_career = Career(**career_goal.dict())
        self.db.add(db_career)
        self.db.commit()
        self.db.refresh(db_career)
        return db_career

    def get_career_goals(self, user_id: int):
        return self.db.query(Career).filter(Career.user_id == user_id).all()

    def update_career_goal(self, career_id: int, career_update: CareerUpdate):
        db_career = self.db.query(Career).filter(Career.id == career_id).first()
        if db_career:
            for key, value in career_update.dict(exclude_unset=True).items():
                setattr(db_career, key, value)
            self.db.commit()
            self.db.refresh(db_career)
            return db_career
        return None

    def delete_career_goal(self, career_id: int):
        db_career = self.db.query(Career).filter(Career.id == career_id).first()
        if db_career:
            self.db.delete(db_career)
            self.db.commit()
            return db_career
        return None