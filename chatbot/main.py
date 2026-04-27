from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from graph import build_graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:8080"],
    allow_methods=["*"],
    allow_headers=["*"],
)

graph = build_graph()

class HistoryMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    message: str
    user_role: str = "ADMIN"
    user_id: Optional[int] = None
    history: list[HistoryMessage] = []

@app.post("/chat")
async def chat(req: ChatRequest):
    formatted_history = [
        {"role": m.role, "content": m.text}
        for m in req.history
    ]

    result = graph.invoke({
        "question": req.message,
        "user_role": req.user_role,
        "user_id": req.user_id,
        "history": formatted_history,
        "sql_query": "",
        "query_result": None,
        "error": None,
        "final_answer": "",
        "visualization_code": None,
        "is_in_scope": None,
        "iteration_count": 0
    })
    return {
        "answer": result["final_answer"],
        "chart": result.get("visualization_code")
    }