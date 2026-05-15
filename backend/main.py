from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import os
import json
import hashlib
import time
from pathlib import Path
from typing import Optional, List

app = FastAPI(title="Prompt2Web API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Token Limits & Pricing Constants ──────────────────────────
FREE_TIER_LIMIT   = 100_000   # tokens per user
USAGE_FILE        = "token_usage.json"
ADMIN_PASSWORD    = "Admin@07"

# ── Models ───────────────────────────────────────────────────
class PromptRequest(BaseModel):
    prompt: str
    model: str = "gemini-3.1-flash-lite"
    use_smart: bool = True
    api_key: str

class GenerateRequest(BaseModel):
    design_spec: str
    model: str = "gemini-3.1-flash-lite"
    api_key: str

class UsageResponse(BaseModel):
    input: int
    output: int
    total: int
    requests: int
    remaining: int
    limit: int

# ── Token Usage Helpers ──────────────────────────────────────

def _make_user_id(api_key: str) -> str:
    return hashlib.sha256(api_key.encode()).hexdigest()[:16]

def _load_usage() -> dict:
    if Path(USAGE_FILE).exists():
        try:
            with open(USAGE_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def _save_usage(usage: dict) -> None:
    with open(USAGE_FILE, "w") as f:
        json.dump(usage, f, indent=2)

def get_user_usage(api_key: str) -> dict:
    uid = _make_user_id(api_key)
    usage = _load_usage()
    if uid not in usage:
        usage[uid] = {"input": 0, "output": 0, "total": 0,
                      "requests": 0, "last_reset": time.time()}
        _save_usage(usage)
    return usage[uid]

def add_tokens(api_key: str, input_tokens: int, output_tokens: int) -> dict:
    uid = _make_user_id(api_key)
    usage = _load_usage()
    rec = usage.get(uid, {"input": 0, "output": 0, "total": 0,
                          "requests": 0, "last_reset": time.time()})
    rec["input"]    += input_tokens
    rec["output"]   += output_tokens
    rec["total"]    += input_tokens + output_tokens
    rec["requests"] += 1
    usage[uid] = rec
    _save_usage(usage)
    return rec

def reset_user_usage(api_key: str) -> None:
    uid = _make_user_id(api_key)
    usage = _load_usage()
    usage[uid] = {"input": 0, "output": 0, "total": 0,
                  "requests": 0, "last_reset": time.time()}
    _save_usage(usage)

def tokens_remaining(api_key: str) -> int:
    rec = get_user_usage(api_key)
    return max(0, FREE_TIER_LIMIT - rec["total"])

# ── Gemini Logic ─────────────────────────────────────────────

EXPANDER_SYSTEM_PROMPT = """You are a senior UI/UX designer and brand expert.
A developer will give you a SHORT description of a webpage or email they want to build.
Your job is to expand it into a DETAILED, pixel-perfect design specification.
Output ONLY the design specification — no preamble, no code, no markdown headers."""

HTML_GENERATOR_SYSTEM_PROMPT = """You are a world-class frontend developer and UI/UX designer.
Generate a complete, production-ready HTML page exactly as the design specification describes.
STRICT OUTPUT RULES: ONE self-contained HTML file, All CSS in <style>, All JS in <script>, Vanilla JS only."""

def _extract_tokens(response, fallback_prompt: str = "", fallback_output: str = "") -> tuple:
    try:
        meta = getattr(response, "usage_metadata", None)
        if meta is not None:
            inp = int(getattr(meta, "prompt_token_count",     0) or 0)
            out = int(getattr(meta, "candidates_token_count", 0) or 0)
            if inp > 0 or out > 0:
                return inp, out
    except Exception:
        pass
    return len(fallback_prompt) // 4, len(fallback_output) // 4

def _clean_html(raw: str) -> str:
    html = raw.strip()
    if html.startswith("```"):
        lines = html.split("\n")[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        html = "\n".join(lines).strip()
    return html

# ── Endpoints ────────────────────────────────────────────────

@app.post("/api/expand-prompt")
async def api_expand_prompt(request: PromptRequest):
    client = genai.Client(api_key=request.api_key)
    try:
        response = client.models.generate_content(
            model=request.model,
            contents=EXPANDER_SYSTEM_PROMPT + "\n\n=== DEVELOPER'S SHORT PROMPT ===\n" + request.prompt
        )
        expanded = response.text.strip()
        inp, out = _extract_tokens(response, request.prompt, expanded)
        add_tokens(request.api_key, inp, out)
        return {"expanded": expanded, "usage": {"input": inp, "output": out, "total": inp + out}}
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-html")
async def api_generate_html(request: GenerateRequest):
    client = genai.Client(api_key=request.api_key)
    try:
        prompt = HTML_GENERATOR_SYSTEM_PROMPT + "\n\n=== DESIGN SPEC ===\n" + request.design_spec
        response = client.models.generate_content(model=request.model, contents=prompt)
        html = _clean_html(response.text)
        inp, out = _extract_tokens(response, prompt, html)
        add_tokens(request.api_key, inp, out)
        return {"html": html, "usage": {"input": inp, "output": out, "total": inp + out}}
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/usage", response_model=UsageResponse)
async def api_get_usage(api_key: str):
    rec = get_user_usage(api_key)
    return {
        "input": rec["input"], "output": rec["output"], "total": rec["total"],
        "requests": rec["requests"], "remaining": max(0, FREE_TIER_LIMIT - rec["total"]),
        "limit": FREE_TIER_LIMIT
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)