from sqlalchemy.orm import Session
from app.models.tip import Tip
from app.schemas.tip import TipCreate, TipResponse

class TipService:
    def __init__(self, db: Session):
        self.db = db

    def get_tips(self, topic: str):
        tips = self.db.query(Tip).filter(Tip.topic == topic).all()
        return tips

    def create_tip(self, tip_data: TipCreate):
        new_tip = Tip(**tip_data.dict())
        self.db.add(new_tip)
        self.db.commit()
        self.db.refresh(new_tip)
        return TipResponse.from_orm(new_tip)