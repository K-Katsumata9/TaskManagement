import type { Card, TaskList } from "./types";

const API_BASE = "http://localhost:8080";

export type CardInput = {
  title: string;
  description: string | null;
  priority: string;
  dueDate: string | null;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`${path} の取得に失敗しました (status: ${response.status})`);
  }
  return response.json() as Promise<T>;
}

async function sendJson<T>(path: string, method: "POST" | "PUT", body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`${path} への送信に失敗しました (status: ${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function fetchLists(): Promise<TaskList[]> {
  return fetchJson<TaskList[]>("/api/lists");
}

export function fetchCards(): Promise<Card[]> {
  return fetchJson<Card[]>("/api/cards");
}

export function createList(title: string): Promise<TaskList> {
  return sendJson<TaskList>("/api/lists", "POST", { title });
}

export function createCard(listId: number, input: CardInput): Promise<Card> {
  return sendJson<Card>("/api/cards", "POST", { listId, ...input });
}

export function updateList(id: number, title: string): Promise<TaskList> {
  return sendJson<TaskList>(`/api/lists/${id}`, "PUT", { title });
}

export function updateCard(id: number, input: CardInput): Promise<Card> {
  return sendJson<Card>(`/api/cards/${id}`, "PUT", input);
}
