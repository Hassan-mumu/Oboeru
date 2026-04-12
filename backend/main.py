import os
from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    mon_secret = os.getenv("SECRET_TEST")
    return {"message": "Hello depuis FastAPI Oboeru!", "secret": mon_secret}