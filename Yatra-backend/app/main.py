from fastapi import FastAPI

app = FastAPI(title="YATRA Backend")


@app.get("/")
def root():
    return {
        "message": "YATRA backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }