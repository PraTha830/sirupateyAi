from pydantic import BaseModel
from typing import List, Optional

class Milestone(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class RoadmapCreate(BaseModel):
    user_id: int
    title: str
    milestones: List[Milestone]

class RoadmapResponse(BaseModel):
    id: int
    user_id: int
    title: str
    milestones: List[Milestone]

class RoadmapUpdate(BaseModel):
    title: Optional[str] = None
    milestones: Optional[List[Milestone]] = None