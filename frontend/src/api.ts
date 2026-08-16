import type { Card, TaskList } from "./types";

const API_BASE = "http://localhost:8080";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`${path} の取得に失敗しました (status: ${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function fetchLists(): Promise<TaskList[]> {
  return fetchJson<TaskList[]>("/api/lists");
}

export function fetchCards(): Promise<Card[]> {
  return fetchJson<Card[]>("/api/cards");
}
