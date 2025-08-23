from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import logging

logger = logging.getLogger("uvicorn.error")

def add_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Adjust this in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def log_requests(request, call_next):
        logger.info(f"Request: {request.method} {request.url}")
        response = await call_next(request)
        logger.info(f"Response: {response.status_code}")
        return response

    @app.exception_handler(Exception)
    async def exception_handler(request, exc):
        logger.error(f"Unhandled error: {exc}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error"},
        )