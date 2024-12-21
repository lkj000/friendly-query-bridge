# Multimodal RAG Chat Application

A comprehensive chat application that supports multiple types of media inputs including text, audio, images, video, PDF files, Excel spreadsheets, Word documents, and CSV files. The application implements Retrieval-Augmented Generation (RAG) to provide context-aware responses.

## Features

- 🔐 User Authentication with Supabase
- 🛡️ Row Level Security (RLS) for Data Protection
- 🎤 Live audio recording and processing
- 📸 Image upload and analysis
- 🎥 Video upload and processing
- 📄 Document processing (PDF, Word)
- 📊 Spreadsheet handling (Excel, CSV)
- 📝 Text file processing
- 💬 Real-time chat interface
- 🔄 Context-aware responses using RAG
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## Security Features

### Authentication
- Secure user authentication powered by Supabase
- Protected routes for authenticated users only
- Email/password authentication
- Seamless login/logout functionality

### Row Level Security (RLS)
- Enabled RLS on all database tables
- Authenticated read access policies
- Secure data access control
- Protected incident data access

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

## Data Access

The application provides secure access to various incident-related data:
- Total incidents overview
- Incident state tracking
- Major incident management
- Change-related incidents
- Problem-related incidents

## Development Notes

For development purposes:
1. Disable email verification in Supabase Console for faster testing
2. Use the Supabase Dashboard to manage:
   - User authentication
   - Database access
   - RLS policies
   - API access

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