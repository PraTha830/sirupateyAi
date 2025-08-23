from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteRead
from app.services.notes import NoteService

router = APIRouter()

@router.post("/", response_model=NoteRead)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    return NoteService.create_note(db=db, note=note)

@router.get("/", response_model=list[NoteRead])
def get_notes(tag: str = None, db: Session = Depends(get_db)):
    return NoteService.get_notes(db=db, tag=tag)

@router.get("/{note_id}", response_model=NoteRead)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = NoteService.get_note_by_id(db=db, note_id=note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.delete("/{note_id}", response_model=dict)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    result = NoteService.delete_note(db=db, note_id=note_id)
    if not result:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"detail": "Note deleted successfully"}