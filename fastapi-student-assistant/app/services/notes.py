from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate

class NoteService:
    def __init__(self, db: Session):
        self.db = db

    def create_note(self, note: NoteCreate, user_id: int) -> Note:
        db_note = Note(**note.dict(), user_id=user_id)
        self.db.add(db_note)
        self.db.commit()
        self.db.refresh(db_note)
        return db_note

    def get_notes(self, user_id: int, tag: str = None):
        query = self.db.query(Note).filter(Note.user_id == user_id)
        if tag:
            query = query.filter(Note.tag == tag)
        return query.all()

    def update_note(self, note_id: int, note: NoteUpdate, user_id: int) -> Note:
        db_note = self.db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
        if not db_note:
            raise HTTPException(status_code=404, detail="Note not found")
        for key, value in note.dict(exclude_unset=True).items():
            setattr(db_note, key, value)
        self.db.commit()
        self.db.refresh(db_note)
        return db_note

    def delete_note(self, note_id: int, user_id: int):
        db_note = self.db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
        if not db_note:
            raise HTTPException(status_code=404, detail="Note not found")
        self.db.delete(db_note)
        self.db.commit()
        return {"detail": "Note deleted successfully"}