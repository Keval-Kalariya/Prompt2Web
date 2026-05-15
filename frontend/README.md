# Prompt2Web Frontend

A modern React frontend for the Prompt2Web AI generation engine.

## Features
- **Smart Expansion**: Automatically expands short prompts into detailed design specifications.
- **HTML Generation**: Creates production-ready, self-contained HTML files.
- **Live Preview**: Real-time preview of the generated web pages.
- **Token Tracking**: Monitor your Gemini API token usage.
- **Premium UI**: Sleek dark mode design with modern animations.

## Tech Stack
- React 18+ (Vite)
- Axios (API Communication)
- Framer Motion (Animations)
- Lucide React (Icons)
- Vanilla CSS with modern best practices

## Getting Started

### Prerequisites
- Node.js (v16+)
- A running backend (see `../backend`)

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file from `.env.example`:
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_DEFAULT_GEMINI_KEY=YOUR_GEMINI_API_KEY
```

### Running the App
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.
