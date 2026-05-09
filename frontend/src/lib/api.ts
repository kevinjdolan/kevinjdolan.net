import type { ArchiveItem, ChatMessage, Profile } from "../types";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getProfile(): Promise<Profile> {
  return requestJson<Profile>("/api/profile");
}

export function getArchive(): Promise<ArchiveItem[]> {
  return requestJson<ArchiveItem[]>("/api/archive");
}

export async function sendChat(messages: ChatMessage): Promise<ChatMessage>;
export async function sendChat(messages: ChatMessage[]): Promise<ChatMessage>;
export async function sendChat(messages: ChatMessage | ChatMessage[]): Promise<ChatMessage> {
  const payload = Array.isArray(messages) ? messages : [messages];
  const reply = await requestJson<ChatMessage>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages: payload })
  });

  return reply;
}
