from pydantic import BaseModel
from typing import Optional

class TipBase(BaseModel):
    topic: str
    content: str

class TipCreate(TipBase):
    pass

class Tip(TipBase):
    id: int

    class Config:
        orm_mode = True