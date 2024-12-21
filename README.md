# OKO Extension for VS Code

🛡️ Elevate your development workflow with real-time security insights and quality metrics, right where you code.

## Overview

The OKO VS Code Extension seamlessly integrates critical security and quality reports from Veracode, Sonar, and Prisma directly into your development environment. Stay informed, secure, and efficient without leaving your editor.

## 🌟 Key Features

- **Security Integration**: Real-time vulnerability assessments from Veracode, Sonar, and Prisma
- **AI Assistant**: Natural language queries with context-aware responses using RAG technology
- **Developer-Centric**: Intuitive sidebar interface with one-click access to metrics
- **Enterprise Security**: Secure VPN-based authentication via Platform Dashboard

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   cd backend && pip install -r requirements.txt
   ```

2. Configure Supabase:
   - Enable Email authentication
   - Set required environment variables

3. Start the services:
   ```bash
   cd backend && uvicorn main:app --reload
   npm run dev
   ```

## 📊 Views

| View | Description |
|------|-------------|
| Ask Me | AI-powered security assistant |
| Prisma Report | Cloud security insights |
| Sonar Report | Code quality metrics |
| Veracode Report | Security vulnerability analysis |

## 🛠️ Development

### Authentication
1. Enable Email auth in Supabase Console
2. Disable email verification for testing

### Platform Integration
- User authentication
- Database access
- RLS policies
- API access

## 📚 Documentation

For detailed information about installation, API endpoints, components, and best practices, visit our [Documentation](./docs/README.md).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md).

## 📄 License

Copyright © 2024 Okovanggoai. All rights reserved.

MIT License

---

> "Security is not a product, but a process." - Bruce Schneier

Made with ❤️ by Okovanggoai (okovanggoai.com)