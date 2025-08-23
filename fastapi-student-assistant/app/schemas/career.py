from pydantic import BaseModel
from typing import List, Optional

class CareerGoal(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    progress: float = 0.0
    resources: List[str] = []

class CareerGoalCreate(BaseModel):
    title: str
    description: Optional[str] = None

class CareerGoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    progress: Optional[float] = None
    resources: Optional[List[str]] = None