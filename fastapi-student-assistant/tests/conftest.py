from pytest import fixture
from fastapi.testclient import TestClient
from app.main import app

@fixture(scope="module")
def test_client():
    client = TestClient(app)
    yield client