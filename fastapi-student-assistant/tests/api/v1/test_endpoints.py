from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_ready_check():
    response = client.get("/ready")
    assert response.status_code == 200

def test_version_check():
    response = client.get("/version")
    assert response.status_code == 200
    assert "version" in response.json()

def test_get_tips():
    response = client.get("/tips?topic=driver_license")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_post_roadmap():
    response = client.post("/roadmap", json={"user_id": 1, "goals": ["Learn Python", "Get a job"]})
    assert response.status_code == 201
    assert "roadmap" in response.json()

def test_get_roadmap():
    response = client.get("/roadmap/1")
    assert response.status_code == 200
    assert "goals" in response.json()

def test_post_career_goals():
    response = client.post("/career/goals", json={"user_id": 1, "goal": "Become a Data Scientist"})
    assert response.status_code == 201

def test_get_career_goals():
    response = client.get("/career/goals")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_post_notes():
    response = client.post("/notes", json={"user_id": 1, "note": "Remember to study for exams"})
    assert response.status_code == 201

def test_get_notes():
    response = client.get("/notes?tag=visa")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_post_reminders():
    response = client.post("/reminders", json={"user_id": 1, "reminder": "Submit assignment", "date": "2023-10-01"})
    assert response.status_code == 201

def test_get_reminders():
    response = client.get("/reminders/1")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_post_calendar_event():
    response = client.post("/calendar/events", json={"user_id": 1, "event": "Study session", "date": "2023-10-01"})
    assert response.status_code == 201

def test_get_daily_calendar():
    response = client.get("/calendar/daily/1")
    assert response.status_code == 200

def test_get_weekly_calendar():
    response = client.get("/calendar/weekly/1")
    assert response.status_code == 200

def test_get_followups():
    response = client.get("/followups/1")
    assert response.status_code == 200

def test_post_followups_log():
    response = client.post("/followups/log", json={"user_id": 1, "task": "Completed assignment"})
    assert response.status_code == 201

def test_post_voice_speech_to_text():
    response = client.post("/voice/speech-to-text", json={"audio": "audio_data"})
    assert response.status_code == 200

def test_post_voice_text_to_speech():
    response = client.post("/voice/text-to-speech", json={"text": "Hello"})
    assert response.status_code == 200