# Prompt2Web - AI Powered Web Generation

This project consists of a FastAPI backend and a React (Vite) frontend that allows users to generate web pages from simple prompts using Google Gemini.

## Project Structure
- `backend/`: FastAPI server handling Gemini API calls and token usage tracking.
- `frontend/`: React application providing a premium UI for the generation process.

## Quick Start

### 1. Setup Backend
```bash
cd backend
pip install -r requirements.txt
python api.py
```
The backend runs on `http://localhost:8000`.

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`.

### 3. Usage
- Open `http://localhost:5173` in your browser.
- Enter your Gemini API Key (or use the default if configured in `.env`).
- Type a description of the web page you want.
- Click **Generate**.
- Download or preview the resulting HTML.

## Original Backend Note
The original `main.py` (Streamlit version) is kept for reference but has been refactored into `api.py` for better integration with React.
