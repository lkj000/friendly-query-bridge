# Multimodal RAG Chat Application

A powerful chat application that supports multimodal interactions including text, audio, images, and documents. Built with React, TypeScript, and Supabase.

## Features

- Real-time chat with AI assistance
- Support for multiple file types:
  - Audio (wav, mp3)
  - Images (jpg, png, gif)
  - Documents (pdf, docx)
  - Spreadsheets (xlsx, csv)
- Secure authentication
- Message persistence
- File storage
- Responsive design

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Python 3.8+ (for backend)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install frontend dependencies
```bash
npm install
```

3. Set up backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

Start the development server:
```bash
npm run dev
```

### Production

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Architecture

- Frontend: React + TypeScript + Vite
- UI Components: shadcn/ui + Tailwind CSS
- State Management: React Query
- Backend: Supabase
- File Storage: Supabase Storage
- Authentication: Supabase Auth

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.