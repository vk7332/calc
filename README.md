# Financial Tools - Income Tax Calculator

A modern, comprehensive income tax calculation and audit portal built with React, TypeScript, and Vite. Features PWA capabilities, AI-powered assistance, Supabase cloud storage, and automated testing.

## 🚀 Features

- **Strategic Tax Audit Portal**: Compare old vs new tax regimes with detailed breakdowns
- **AI Assistant**: Get tax advice powered by OpenAI GPT
- **Client Database**: Store and manage client records in Supabase
- **PDF Reports**: Generate professional tax reports
- **PWA Ready**: Install as a desktop/mobile app
- **GST Penalty Calculator**: Calculate late filing penalties
- **Loan EMI Calculator**: Plan your loan repayments
- **Retirement Planning**: Project wealth accumulation at age 60

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 + TypeScript 5.5.3 + Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI API integration
- **PDF**: jsPDF with autoTable
- **Testing**: Playwright for E2E tests
- **PWA**: vite-plugin-pwa

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for cloud features)
- OpenAI API key (for AI assistant)

## 🚀 Quick Start (Dev Onboarding)

### 1. Clone and Install
```bash
git clone https://github.com/vk7332/calc.git
cd calc
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Add your API keys to .env:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 3. Database Setup
```bash
# Run Supabase migrations
# (Check supabase-setup.sql for table schemas)
```

### 4. Development Server
```bash
npm run dev
# Opens at http://localhost:5173
```

### 5. Testing
```bash
# Type check
npm run typecheck

# Lint code
npm run lint

# E2E tests (requires dev server running)
npm run test:e2e

# E2E tests with browser UI
npm run test:e2e:headed
```

### 6. Build for Production
```bash
npm run build
npm run preview  # Test production build locally
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Ui/             # Calculator grid and shared components
│   ├── layout/         # Header, sidebar, footer, etc.
├── context/            # React contexts (Auth, History, Settings)
├── engines/            # Tax calculation logic
├── pages/              # Main application pages
├── types/              # TypeScript type definitions
├── utils/              # Helper functions (PDF generator)
└── lib/                # External service configurations
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:headed` - Run E2E tests with browser UI
- `npm run test:e2e:report` - View test reports

## 🚀 Deployment

The app is configured for static hosting. Build outputs are optimized with:
- Code splitting by feature (engines, pages, components)
- PWA service worker for offline functionality
- Compressed assets and efficient bundling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run lint && npm run typecheck && npm run test:e2e`
5. Commit with conventional commits
6. Push and create a PR

## 📄 License

MIT License - see LICENSE file for details.