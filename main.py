from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
import sqlite3
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#CORS is used because it helps frontend and backend talk which are on different ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ONLY allow your frontend origin
    allow_methods=["*"],                      # allow GET, POST, etc.
    allow_headers=["*"],                      # allow all headers (e.g. Content-Type)
)

#database (SQLite) setup
conn = sqlite3.connect("moods.db", check_same_thread= False)
cur = conn.cursor()
cur.execute("""
            CREATE TABLE IF NOT EXISTS moods(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            mood TEXT,
            timestamp TEXT
            )
            """)
conn.commit()

#create a pydantic model - so that fastapi can understand what json data format to accept as input
class MoodEntry(BaseModel):
    name : str
    mood : str

@app.post("/mood")
def save_mood(entry : MoodEntry):
    now = datetime.utcnow().isoformat()
    cur.execute("INSERT INTO moods (name, mood, timestamp) VALUES (?,?,?)", (entry.name, entry.mood, now))
    conn.commit()
    return {"name" : entry.name, "mood" : entry.mood, "timestamp" : now, "message" : "mood saved"}

@app.get("/mood")
def get_moods():
    cur.execute("SELECT name, mood, timestamp FROM moods ORDER BY timestamp DESC LIMIT 10")
    rows = cur.fetchall()
    return [{ "name" : name, "mood" : mood, "timestamp" : tp } for name, mood, tp in rows]

@app.delete("/mood")
def delete_history():
    cur.execute("DELETE from moods")
    conn.commit()
    return {"message" : "History deleted"}