from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import dspy
import uvicorn
import librosa
import soundfile as sf
import torch
from transformers import AutoProcessor, AutoModel
import numpy as np
from typing import List, Optional
import tempfile
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize dspy components
lm = dspy.OpenAI(max_tokens=500)
dspy.settings.configure(lm=lm)

# Initialize audio processor and model
processor = AutoProcessor.from_pretrained("facebook/wav2vec2-base-960h")
model = AutoModel.from_pretrained("facebook/wav2vec2-base-960h")

class ChatMessage(BaseModel):
    message: str
    audio_context: Optional[str] = None

class SecurityReport(BaseModel):
    type: str

def process_audio(audio_file: UploadFile) -> str:
    """Process audio file and extract features."""
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
        temp_audio.write(audio_file.file.read())
        temp_path = temp_audio.name

    try:
        # Load audio file
        waveform, sample_rate = librosa.load(temp_path, sr=16000)
        
        # Convert to tensor
        inputs = processor(waveform, sampling_rate=16000, return_tensors="pt")
        
        # Get audio features
        with torch.no_grad():
            outputs = model(**inputs)
            audio_features = outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
        
        # Convert features to text representation
        audio_context = " ".join([f"feature_{i}:{val:.4f}" for i, val in enumerate(audio_features[:10])])
        
        return audio_context
    finally:
        # Clean up temporary file
        os.unlink(temp_path)

@app.post("/api/chat")
async def chat(message: ChatMessage):
    try:
        # Initialize RAG pipeline with audio context if available
        retriever = dspy.ColBERTv2(url="http://localhost:8888")
        
        # Combine text and audio context if available
        query = message.message
        if message.audio_context:
            query = f"{message.message} [AUDIO_CONTEXT] {message.audio_context}"
        
        # Process with RAG
        rag = dspy.ChainOfThought() | retriever
        response = rag(query)
        
        return {"reply": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        audio_context = process_audio(file)
        return {"audio_context": audio_context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")

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