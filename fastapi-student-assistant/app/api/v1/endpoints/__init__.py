from fastapi import APIRouter

router = APIRouter()

from .health import router as health_router
from .tips import router as tips_router
from .roadmap import router as roadmap_router
from .career import router as career_router
from .notes import router as notes_router
from .reminders import router as reminders_router
from .calendar import router as calendar_router
from .followups import router as followups_router
from .voice import router as voice_router

router.include_router(health_router, prefix="/health", tags=["health"])
router.include_router(tips_router, prefix="/tips", tags=["tips"])
router.include_router(roadmap_router, prefix="/roadmap", tags=["roadmap"])
router.include_router(career_router, prefix="/career", tags=["career"])
router.include_router(notes_router, prefix="/notes", tags=["notes"])
router.include_router(reminders_router, prefix="/reminders", tags=["reminders"])
router.include_router(calendar_router, prefix="/calendar", tags=["calendar"])
router.include_router(followups_router, prefix="/followups", tags=["followups"])
router.include_router(voice_router, prefix="/voice", tags=["voice"])