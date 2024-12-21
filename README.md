# OKO Security Reports Extension for VS Code

🛡️ Elevate your development workflow with real-time security insights and quality metrics, right where you code.

## Overview

The OKO VS Code Extension seamlessly integrates critical security and quality reports from Veracode, Sonar, and Prisma directly into your development environment. Stay informed, secure, and efficient without leaving your editor.

## 🌟 Key Features

### 🔐 Comprehensive Security Integration
- **Veracode Security Reports**: Real-time vulnerability assessments and security metrics
- **Sonar Code Quality Analysis**: Instant access to code quality metrics and best practices
- **Prisma Cloud Security**: Cloud security posture management at your fingertips

### 💬 Interactive AI Assistant
- Natural language queries about security findings
- Context-aware responses using RAG technology
- Code-specific security recommendations
- Real-time chat interface for immediate support

### 🎯 Developer-Centric Design
- Intuitive sidebar interface
- One-click access to critical metrics
- Customizable report views
- Seamless VPN integration

### 🔒 Enterprise-Grade Security
- Secure authentication via Platform Dashboard
- VPN-exclusive operation
- Row-level security for data protection
- Protected incident data access

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   cd backend && pip install -r requirements.txt
   ```

2. Configure Supabase:
   - Enable Email authentication in Supabase Authentication settings
   - For development, disable email verification in Authentication settings
   - Set up the required environment variables

3. Start the backend:
   ```bash
   cd backend && uvicorn main:app --reload
   ```

4. Start the frontend:
   ```bash
   npm run dev
   ```

## 📊 Data Access

Access comprehensive security metrics including:
- Total incidents overview (with default fallback values)
- Incident state tracking
- Major incident management
- Change-related incidents
- Problem-related incidents

## 🛠️ Development Setup

### Authentication Configuration
1. Enable Email authentication in Supabase Console:
   - Navigate to Authentication > Providers
   - Enable Email provider
   - Disable email verification for faster testing

### Platform Integration
Use the Supabase Dashboard to manage:
- User authentication
- Database access
- RLS policies
- API access

## 🎯 Views

| View ID | Name | Description |
|---------|------|-------------|
| oko-sidebar-chat-view | Ask Me | AI-powered security assistant |
| oko-sidebar-prismaReport-view | Prisma Report | Cloud security insights |
| oko-sidebar-sonarReport-view | Sonar Report | Code quality metrics |
| oko-sidebar-veracodeReport-view | Veracode Report | Security vulnerability analysis |

## 🛡️ Error Handling

Robust error handling for:
- Authentication failures
- Data fetching errors
- Empty data states
- API response validation

## 📚 Documentation

For detailed documentation about:
- Installation and setup
- API endpoints
- Component details
- Media processing
- Error handling
- Best practices
- Contributing guidelines

Visit our [Documentation](./docs/README.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

## 📄 License

MIT License

---

> "Security is not a product, but a process." - Bruce Schneier

Made with ❤️ by the OKO Security Team