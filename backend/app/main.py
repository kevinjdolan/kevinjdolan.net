from __future__ import annotations

import os
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class Profile(BaseModel):
    name: str
    title: str
    location: str
    summary: str
    version: str


class ArchiveItem(BaseModel):
    date: str
    title: str
    meta: str
    preview: str
    slug: str


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(default_factory=list, max_length=24)


class ChatResponse(BaseModel):
    role: Literal["assistant"] = "assistant"
    content: str


PROFILE = Profile(
    name="Kevin J. Dolan",
    title="Agentic AI expert",
    location="Los Angeles",
    summary="Kevin J. Dolan is an Agentic AI expert based in Los Angeles.",
    version="0.1",
)

ARCHIVE: list[ArchiveItem] = [
    ArchiveItem(
        date="2026-04-22",
        title="Notes on agent eval harnesses",
        meta="8 min",
        preview="What I keep relearning about deterministic replay, golden traces, and the cost of skipping them.",
        slug="notes-on-agent-eval-harnesses",
    ),
    ArchiveItem(
        date="2026-03-09",
        title="The cheap-model floor",
        meta="6 min",
        preview="When a haiku-class model is enough, and how to know before you ship the expensive one.",
        slug="the-cheap-model-floor",
    ),
    ArchiveItem(
        date="2026-02-14",
        title="Tool-calling has a UX problem",
        meta="11 min",
        preview="Why most tool-using agents feel uncanny, and a few patterns that helped.",
        slug="tool-calling-has-a-ux-problem",
    ),
    ArchiveItem(
        date="2025-12-30",
        title="2025 in review: agents, mostly",
        meta="14 min",
        preview="A year of pretending agents would work, and the handful of times they did.",
        slug="2025-in-review-agents-mostly",
    ),
    ArchiveItem(
        date="2025-11-02",
        title="Multi-agent loops without tears",
        meta="9 min",
        preview="Topologies I keep coming back to, and the ones that always end in flames.",
        slug="multi-agent-loops-without-tears",
    ),
    ArchiveItem(
        date="2025-09-18",
        title="Eval datasets are a product surface",
        meta="7 min",
        preview="Treating your eval set like a product: versioning, ownership, taste.",
        slug="eval-datasets-are-a-product-surface",
    ),
    ArchiveItem(
        date="2025-07-04",
        title="On leaving the framework behind",
        meta="5 min",
        preview="A short defense of writing the orchestration loop yourself.",
        slug="on-leaving-the-framework-behind",
    ),
]


def cors_origins() -> list[str]:
    raw = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


app = FastAPI(
    title="Kevin J. Dolan API",
    version=PROFILE.version,
    description="Small API backing the kevinjdolan.net React application.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/profile", response_model=Profile)
def profile() -> Profile:
    return PROFILE


@app.get("/api/archive", response_model=list[ArchiveItem])
def archive() -> list[ArchiveItem]:
    return ARCHIVE


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    latest = next((m.content for m in reversed(request.messages) if m.role == "user"), "")
    return ChatResponse(content=compose_reply(latest))


def compose_reply(message: str) -> str:
    text = message.lower()

    if any(term in text for term in ("eval", "evaluation", "harness", "test")):
        return (
            "For agent evals, I would start with deterministic replay and a small set of golden traces. "
            "Then I would add messy, real user journeys once the harness can explain failures without turning "
            "every debugging session into fog."
        )

    if any(term in text for term in ("agent", "multi-agent", "tool", "workflow")):
        return (
            "I think agent systems work best when the loop is boring on purpose: clear state, explicit tools, "
            "observable decisions, and narrow autonomy until the behavior earns more room."
        )

    if any(term in text for term in ("contact", "email", "reach", "hire")):
        return (
            "I do not have Kevin's private contact details here. Share a little context about what you want to "
            "build or discuss, and I can help shape a crisp note to send his way."
        )

    if any(term in text for term in ("kevin", "who are you", "about")):
        return (
            "I am KevinBot, a small stand-in for Kevin J. Dolan. Kevin works around Agentic AI in Los Angeles, "
            "especially the practical parts: tools, evals, orchestration, and production behavior."
        )

    return (
        "Good question. My default move would be to make the system observable first, then improve the clever "
        "parts. With AI work, the fastest path is usually knowing exactly why a run succeeded or failed."
    )
