export type RouteKey = "chat" | "archive" | "contact";

export type Profile = {
  name: string;
  title: string;
  location: string;
  summary: string;
  version: string;
};

export type ArchiveItem = {
  date: string;
  title: string;
  meta: string;
  preview: string;
  slug: string;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};
