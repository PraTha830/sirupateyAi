from fastapi import APIRouter
from app.api.v1.endpoints import health, tips, roadmap, career, notes, reminders, calendar, followups, voice

router = APIRouter()

router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(tips.router, prefix="/tips", tags=["tips"])
router.include_router(roadmap.router, prefix="/roadmap", tags=["roadmap"])
router.include_router(career.router, prefix="/career", tags=["career"])
router.include_router(notes.router, prefix="/notes", tags=["notes"])
router.include_router(reminders.router, prefix="/reminders", tags=["reminders"])
router.include_router(calendar.router, prefix="/calendar", tags=["calendar"])
router.include_router(followups.router, prefix="/followups", tags=["followups"])
router.include_router(voice.router, prefix="/voice", tags=["voice"])