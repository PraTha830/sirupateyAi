# FastAPI Student Assistant

This project is a backend boilerplate for an AI-powered student assistant web application built using FastAPI. The application is designed to help students manage their academic and personal goals through various features such as tips and tricks, personal roadmaps, career planning, note-taking, reminders, and calendar management.

## Features

- **Tips & Tricks**: Access curated guides on various topics like driver licenses, visa transitions, banking, and healthcare.
- **Personal Roadmap**: Generate and track personal roadmaps based on user input.
- **Career Planner**: Manage career goals, track progress, and access resources for job preparation.
- **Note Taker**: Save and organize notes with metadata for easy retrieval.
- **Reminders**: Create and manage reminders for important deadlines.
- **Calendar**: Manage events and view daily and weekly planners.
- **Voice I/O**: Transcribe voice input and convert text to speech.

## Project Structure

```
fastapi-student-assistant
├── app
│   ├── __init__.py
│   ├── main.py
│   ├── api
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── v1
│   │       ├── __init__.py
│   │       ├── endpoints
│   │       │   ├── __init__.py
│   │       │   ├── health.py
│   │       │   ├── tips.py
│   │       │   ├── roadmap.py
│   │       │   ├── career.py
│   │       │   ├── notes.py
│   │       │   ├── reminders.py
│   │       │   ├── calendar.py
│   │       │   ├── followups.py
│   │       │   └── voice.py
│   │       └── api.py
│   ├── core
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── security.py
│   │   └── middleware.py
│   ├── db
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── database.py
│   │   └── session.py
│   ├── models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── tip.py
│   │   ├── roadmap.py
│   │   ├── career.py
│   │   ├── note.py
│   │   ├── reminder.py
│   │   └── calendar.py
│   ├── schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── tip.py
│   │   ├── roadmap.py
│   │   ├── career.py
│   │   ├── note.py
│   │   ├── reminder.py
│   │   └── calendar.py
│   └── services
│       ├── __init__.py
│       ├── tips.py
│       ├── roadmap.py
│       ├── career.py
│       ├── notes.py
│       ├── reminders.py
│       ├── calendar.py
│       └── voice.py
├── alembic
│   ├── versions
│   ├── env.py
│   ├── script.py.mako
│   └── alembic.ini
├── tests
│   ├── __init__.py
│   ├── conftest.py
│   └── api
│       ├── __init__.py
│       └── v1
│           ├── __init__.py
│           └── test_endpoints.py
├── requirements.txt
├── pyproject.toml
├── .env.example
├── .gitignore
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd fastapi-student-assistant
   ```

2. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set up the environment variables by copying `.env.example` to `.env` and modifying it as needed.

## Running the Application

To start the FastAPI application, run:
```
uvicorn app.main:app --reload
```

Visit `http://127.0.0.1:8000/docs` for the interactive API documentation.

## Testing

To run the tests, use:
```
pytest
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.