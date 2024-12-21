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
from PIL import Image
import fitz  # PyMuPDF for PDF processing
import cv2
import pandas as pd
import csv
from io import StringIO

app = FastAPI()

origins = ["http://localhost:3000"]  # Update with your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = AutoProcessor.from_pretrained("your-processor")
model = AutoModel.from_pretrained("your-model")

def process_audio(audio_file: UploadFile) -> str:
    """Process audio file and extract features."""
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
        temp_audio.write(audio_file.file.read())
        temp_path = temp_audio.name

    try:
        waveform, sample_rate = librosa.load(temp_path, sr=16000)
        inputs = processor(waveform, sampling_rate=16000, return_tensors="pt")
        
        with torch.no_grad():
            outputs = model(**inputs)
            audio_features = outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
        
        return " ".join([f"feature_{i}:{val:.4f}" for i, val in enumerate(audio_features[:10])])
    finally:
        os.unlink(temp_path)

def process_image(image_file: UploadFile) -> str:
    """Process image file and extract features."""
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_img:
        temp_img.write(image_file.file.read())
        temp_path = temp_img.name

    try:
        image = Image.open(temp_path)
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        # Resize for consistency
        image = image.resize((224, 224))
        # Convert to numpy array and normalize
        img_array = np.array(image) / 255.0
        # Simple feature extraction (mean values per channel)
        features = np.mean(img_array, axis=(0, 1))
        return " ".join([f"channel_{i}:{val:.4f}" for i, val in enumerate(features)])
    finally:
        os.unlink(temp_path)

def process_video(video_file: UploadFile) -> str:
    """Process video file and extract features."""
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
        temp_video.write(video_file.file.read())
        temp_path = temp_video.name

    try:
        cap = cv2.VideoCapture(temp_path)
        frames_features = []
        frame_count = 0
        
        while cap.isOpened() and frame_count < 10:  # Process first 10 frames
            ret, frame = cap.read()
            if not ret:
                break
                
            # Convert to RGB and resize
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = cv2.resize(frame, (224, 224))
            # Extract simple features (mean values per channel)
            features = np.mean(frame, axis=(0, 1))
            frames_features.append(features)
            frame_count += 1
            
        cap.release()
        
        if frames_features:
            avg_features = np.mean(frames_features, axis=0)
            return " ".join([f"channel_{i}:{val:.4f}" for i, val in enumerate(avg_features)])
        return "No frames processed"
    finally:
        os.unlink(temp_path)

def process_pdf(pdf_file: UploadFile) -> str:
    """Process PDF file and extract text."""
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
        temp_pdf.write(pdf_file.file.read())
        temp_path = temp_pdf.name

    try:
        doc = fitz.open(temp_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text[:1000]  # Return first 1000 characters as context
    finally:
        os.unlink(temp_path)

def process_text(text_file: UploadFile) -> str:
    """Process text file and extract content."""
    content = text_file.file.read().decode('utf-8')
    return content[:1000]  # Return first 1000 characters as context

def process_csv(csv_file: UploadFile) -> str:
    """Process CSV file and extract summary."""
    content = csv_file.file.read().decode('utf-8')
    df = pd.read_csv(StringIO(content))
    summary = f"CSV Summary:\nColumns: {', '.join(df.columns)}\nRows: {len(df)}\nSample data: {df.head(3).to_string()}"
    return summary

@app.post("/api/upload-media")
async def upload_media(file: UploadFile = File(...)):
    try:
        content_type = file.content_type
        if content_type.startswith('audio/'):
            context = process_audio(file)
        elif content_type.startswith('image/'):
            context = process_image(file)
        elif content_type.startswith('video/'):
            context = process_video(file)
        elif content_type == 'application/pdf':
            context = process_pdf(file)
        elif content_type == 'text/plain':
            context = process_text(file)
        elif content_type == 'text/csv':
            context = process_csv(file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported media type")
            
        return {"media_context": context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing media: {str(e)}")

@app.post("/api/chat")
async def chat(message: str, media_context: Optional[str] = None):
    # Implement chat logic here
    return {"reply": "This is a placeholder response."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
