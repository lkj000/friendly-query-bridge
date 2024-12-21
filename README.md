# Multimodal RAG Chat Application

A comprehensive chat application that supports multiple types of media inputs including text, audio, images, video, PDF files, Excel spreadsheets, Word documents, and CSV files. The application implements Retrieval-Augmented Generation (RAG) to provide context-aware responses.

## Features

- 🎤 Live audio recording and processing
- 📸 Image upload and analysis
- 🎥 Video upload and processing
- 📄 Document processing (PDF, Word)
- 📊 Spreadsheet handling (Excel, CSV)
- 📝 Text file processing
- 💬 Real-time chat interface
- 🔄 Context-aware responses using RAG
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && pip install -r requirements.txt
   ```
3. Start the backend:
   ```bash
   cd backend && uvicorn main:app --reload
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Detailed Documentation

For detailed documentation about:
- Installation and setup
- API endpoints
- Component details
- Media processing
- Error handling
- Best practices
- Contributing guidelines

Visit our [Documentation](./docs/README.md)

## License

MIT License