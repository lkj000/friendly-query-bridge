# Multimodal RAG Chat Application

A comprehensive chat application that supports multiple types of media inputs including text, audio, images, video, and PDF files. The application implements Retrieval-Augmented Generation (RAG) to provide context-aware responses.

## Features

- 🎤 Live audio recording and processing
- 📸 Image upload and analysis
- 🎥 Video upload and processing
- 📄 PDF document processing
- 💬 Real-time chat interface
- 🔄 Context-aware responses using RAG
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## Technology Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Tanstack Query for data fetching
- Lucide React for icons

### Backend
- FastAPI
- Python 3.8+
- Various ML libraries for media processing

## Prerequisites

1. Node.js (v16+)
2. Python 3.8+
3. pip (Python package manager)

## Installation

### Frontend Setup

```bash
# Install Node.js dependencies
npm install
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix or MacOS:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

## Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

2. Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Code Structure

### Frontend Structure

```
src/
├── components/
│   ├── AudioRecorder.tsx    # Live audio recording component
│   ├── MediaUpload.tsx      # Media file upload component
│   ├── ChatMessage.tsx      # Message display component
│   ├── ChatInput.tsx        # Chat input with media controls
│   └── views/
│       └── ChatView.tsx     # Main chat interface
├── services/
│   └── api.ts              # API service functions
└── hooks/
    └── use-toast.ts        # Toast notification hook
```

### Backend Structure

```
backend/
├── main.py                 # FastAPI application and endpoints
└── requirements.txt        # Python dependencies
```

## API Endpoints

### POST /api/upload-media
Handles various types of media uploads:
- Audio files (wav, mp3)
- Images (jpg, png, gif)
- Videos (mp4, webm)
- PDFs

Returns processed context from the media for use in chat.

### POST /api/chat
Handles chat messages with optional media context.

## Component Details

### AudioRecorder
- Implements live audio recording functionality
- Uses the MediaRecorder API
- Provides recording status feedback
- Handles audio blob creation and upload

### MediaUpload
- Supports multiple file types
- Provides upload status feedback
- Integrates with AudioRecorder
- Handles file validation and processing

### ChatMessage
- Renders different types of media
- Supports code blocks with syntax highlighting
- Handles message threading
- Provides media preview capabilities

### ChatView
- Manages chat state and history
- Handles message sending and receiving
- Integrates all media components
- Manages API communication

## Media Processing

### Audio Processing
- Uses librosa for feature extraction
- Supports various audio formats
- Extracts relevant audio features for context

### Image Processing
- Processes images using PIL
- Extracts image features and metadata
- Supports common image formats

### Video Processing
- Uses OpenCV for video processing
- Extracts key frames and features
- Supports MP4 and WebM formats

### PDF Processing
- Uses PyMuPDF for text extraction
- Processes document structure
- Extracts relevant text content

## Error Handling

The application implements comprehensive error handling:
- Media upload validation
- Processing errors
- API communication errors
- User feedback through toast notifications

## Best Practices

1. Always handle media uploads with proper validation
2. Implement error handling for all API calls
3. Use appropriate media formats:
   - Audio: WAV, MP3
   - Images: JPG, PNG, GIF
   - Video: MP4, WebM
   - Documents: PDF

## Security Considerations

1. Implement file size limits
2. Validate file types
3. Sanitize user inputs
4. Handle sensitive information appropriately

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For support, please open an issue in the repository or contact the maintainers.