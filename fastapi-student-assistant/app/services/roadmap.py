from sqlalchemy.orm import Session
from app.models.roadmap import Roadmap
from app.schemas.roadmap import RoadmapCreate, RoadmapResponse

class RoadmapService:
    def __init__(self, db: Session):
        self.db = db

    def create_roadmap(self, roadmap_data: RoadmapCreate) -> RoadmapResponse:
        roadmap = Roadmap(**roadmap_data.dict())
        self.db.add(roadmap)
        self.db.commit()
        self.db.refresh(roadmap)
        return RoadmapResponse.from_orm(roadmap)

    def get_roadmap(self, user_id: int) -> RoadmapResponse:
        roadmap = self.db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
        if roadmap:
            return RoadmapResponse.from_orm(roadmap)
        return None

    def update_roadmap(self, user_id: int, roadmap_data: RoadmapCreate) -> RoadmapResponse:
        roadmap = self.db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
        if roadmap:
            for key, value in roadmap_data.dict().items():
                setattr(roadmap, key, value)
            self.db.commit()
            self.db.refresh(roadmap)
            return RoadmapResponse.from_orm(roadmap)
        return None

    def delete_roadmap(self, user_id: int) -> bool:
        roadmap = self.db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
        if roadmap:
            self.db.delete(roadmap)
            self.db.commit()
            return True
        return False