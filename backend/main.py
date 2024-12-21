from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import dspy
import uvicorn

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize dspy components
lm = dspy.OpenAI(max_tokens=500)
dspy.settings.configure(lm=lm)

class ChatMessage(BaseModel):
    message: str

class SecurityReport(BaseModel):
    type: str

@app.post("/api/chat")
async def chat(message: ChatMessage):
    try:
        # Initialize RAG pipeline
        retriever = dspy.ColBERTv2(url="http://localhost:8888")
        rag = dspy.ChainOfThought() | retriever

        # Process message using RAG
        response = rag(message.message)
        
        return {"reply": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reports/{report_type}")
async def get_security_report(report_type: str):
    try:
        # Mock data for now - replace with actual security scanning logic
        return {
            "highSeverity": 2,
            "mediumSeverity": 5,
            "lastUpdated": "2024-03-20",
            "details": [
                {
                    "id": "1",
                    "title": "Sample Security Issue",
                    "severity": "high",
                    "description": "This is a sample security issue"
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)