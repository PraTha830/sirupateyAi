from fastapi import FastAPI

app = FastAPI()

from .api.v1.api import api_router

app.include_router(api_router)