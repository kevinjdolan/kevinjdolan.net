import type { ArchiveItem, Profile } from "../types";

export const fallbackProfile: Profile = {
  name: "Kevin J. Dolan",
  title: "Agentic AI expert",
  location: "Los Angeles",
  summary: "Kevin J. Dolan is an Agentic AI expert based in Los Angeles.",
  version: "0.1"
};

export const fallbackArchive: ArchiveItem[] = [
  {
    date: "2026-04-22",
    title: "Notes on agent eval harnesses",
    meta: "8 min",
    preview: "What I keep relearning about deterministic replay, golden traces, and the cost of skipping them.",
    slug: "notes-on-agent-eval-harnesses"
  },
  {
    date: "2026-03-09",
    title: "The cheap-model floor",
    meta: "6 min",
    preview: "When a haiku-class model is enough, and how to know before you ship the expensive one.",
    slug: "the-cheap-model-floor"
  },
  {
    date: "2026-02-14",
    title: "Tool-calling has a UX problem",
    meta: "11 min",
    preview: "Why most tool-using agents feel uncanny, and a few patterns that helped.",
    slug: "tool-calling-has-a-ux-problem"
  },
  {
    date: "2025-12-30",
    title: "2025 in review: agents, mostly",
    meta: "14 min",
    preview: "A year of pretending agents would work, and the handful of times they did.",
    slug: "2025-in-review-agents-mostly"
  },
  {
    date: "2025-11-02",
    title: "Multi-agent loops without tears",
    meta: "9 min",
    preview: "Topologies I keep coming back to, and the ones that always end in flames.",
    slug: "multi-agent-loops-without-tears"
  },
  {
    date: "2025-09-18",
    title: "Eval datasets are a product surface",
    meta: "7 min",
    preview: "Treating your eval set like a product: versioning, ownership, taste.",
    slug: "eval-datasets-are-a-product-surface"
  },
  {
    date: "2025-07-04",
    title: "On leaving the framework behind",
    meta: "5 min",
    preview: "A short defense of writing the orchestration loop yourself.",
    slug: "on-leaving-the-framework-behind"
  }
];
