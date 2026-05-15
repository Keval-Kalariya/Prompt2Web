# 🎨 Prompt2Web

**Prompt2Web** is a modern, AI-powered web page generator that transforms simple text descriptions into production-ready HTML pages. Built with a robust **FastAPI** backend and a premium **React** frontend, it leverages Google's Gemini AI to expand design specs and generate high-quality code in seconds.

## 🚀 Key Features

- **AI-Driven Pipeline**: Two-stage generation process (Expand Spec → Generate HTML).
- **Modern Tech Stack**: React + Vite for the frontend, FastAPI for the backend.
- **Premium Design**: Dark mode UI with smooth animations (Framer Motion) and custom design tokens.
- **Token Management**: Integrated token usage tracking and remaining balance monitoring.
- **Responsive Previews**: Real-time preview of generated pages directly in the app.
- **One-Click Download**: Instantly download your generated HTML files.

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS v4** (Advanced styling)
- **Framer Motion** (Micro-interactions)
- **Lucide React** (Iconography)
- **Axios** (API communication)

### Backend
- **FastAPI** (Python 3.10+)
- **Google GenAI SDK** (Gemini Models)
- **Uvicorn** (ASGI Server)
- **Pydantic** (Data validation)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/Keval-Kalariya/Prompt2Web.git
cd Prompt2Web
```

### 2. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```
The backend will start at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_DEFAULT_GEMINI_KEY=your_api_key_here
```

## 📖 Usage

1. **Enter API Key**: Paste your Gemini API key in the sidebar.
2. **Select Model**: Choose between `gemini-3.1-flash-lite`, `gemini-2.5-flash`, etc.
3. **Write Prompt**: Describe the page you want to build (e.g., "A dark portfolio for a photographer").
4. **Generate**: Click "Generate" and watch the AI expand your spec and build the code.
5. **Preview & Download**: View the live preview and download the code if you're happy!

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

---
Built with ❤️ by [Keval Kalariya](https://github.com/Keval-Kalariya)