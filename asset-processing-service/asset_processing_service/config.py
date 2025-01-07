import os

from dotenv import load_dotenv

load_dotenv()


def get_required_env_var(key: str) -> str:
    value = os.getenv(key)
    if not value:
        raise ValueError(f"Missing required environment variable: {key}")
    return value.strip().strip('"')


class Config:
    API_BASE_URL = get_required_env_var("API_BASE_URL", "http://localhost:3000/api")
    SERVER_API_KEY = get_required_env_var("SERVER_API_KEY")
    STUCK_JOB_THRESHOLD_SECONDS = int(os.getenv("STUCK_JOB_THRESHOLD_SECONDS", "30"))
    MAX_JOB_ATTEMPTS = int(os.getenv("MAX_JOB_ATTEMPTS", "3"))


config = Config()

HEADERS = {
    "Authorization": f"Bearer {config.SERVER_API_KEY}",
}
