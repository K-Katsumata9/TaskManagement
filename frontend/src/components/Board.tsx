import { useEffect, useState } from "react";
import { fetchCards, fetchLists } from "../api";
import type { Card, TaskList } from "../types";
import { ListColumn } from "./ListColumn";

export function Board() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchLists(), fetchCards()])
      .then(([lists, cards]) => {
        setLists(lists);
        setCards(cards);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "データの取得に失敗しました");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">読み込み中...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">エラー: {error}</p>;
  }

  const sortedLists = [...lists].sort((a, b) => a.position - b.position);

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">タスク管理ボード</h1>
      </header>
      <main className="flex flex-1 gap-4 overflow-x-auto p-6">
        {sortedLists.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            cards={cards.filter((card) => card.listId === list.id)}
          />
        ))}
      </main>
    </div>
  );
}
