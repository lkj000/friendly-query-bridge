# Multimodal RAG Chat Application Documentation

## Installation

### Frontend Setup
```bash
npm install
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## API Endpoints

### POST /api/upload-media
Handles various types of media uploads:
- Audio files (wav, mp3)
- Images (jpg, png, gif)
- Videos (mp4, webm)
- PDFs
- Text files
- CSV files
- Excel files (xlsx, xls)
- Word documents (docx, doc)

Returns processed context from the media.

### POST /api/chat
Handles chat messages with optional media context.

## Component Details

### AudioRecorder
- Live audio recording functionality
- MediaRecorder API integration
- Recording status feedback
- Audio blob creation and upload

### MediaUpload
- Multiple file type support
- Upload status feedback
- File validation
- Processing feedback

### ChatMessage
- Media rendering
- Code block support
- Message threading
- Media preview

## Media Processing

### Audio Processing
- Uses librosa for feature extraction
- Supports various audio formats

### Document Processing
- PDF text extraction with PyMuPDF
- Word document processing with python-docx
- Excel/CSV handling with pandas and openpyxl

## Best Practices

1. File size limits
2. Type validation
3. Error handling
4. Security considerations

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.