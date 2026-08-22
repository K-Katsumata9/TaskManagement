import { useEffect, useState } from "react";
import { createCard, createList, fetchCards, fetchLists, updateCard, updateList } from "../api";
import type { Card, TaskList } from "../types";
import { AddListForm } from "./AddListForm";
import { EditCardModal } from "./EditCardModal";
import { EditListModal } from "./EditListModal";
import { ListColumn } from "./ListColumn";

export function Board() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [editingList, setEditingList] = useState<TaskList | null>(null);

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

  const handleAddList = async (title: string) => {
    const newList = await createList(title);
    setLists((prev) => [...prev, newList]);
  };

  const handleAddCard = async (listId: number, title: string, priority: string) => {
    const newCard = await createCard(listId, title, priority);
    setCards((prev) => [...prev, newCard]);
  };

  const handleSaveCard = async (title: string, priority: string) => {
    if (!editingCard) return;
    const updated = await updateCard(editingCard.id, title, priority);
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingCard(null);
  };

  const handleSaveList = async (title: string) => {
    if (!editingList) return;
    const updated = await updateList(editingList.id, title);
    setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setEditingList(null);
  };

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
      <main className="flex flex-1 items-start gap-4 overflow-x-auto p-6">
        {sortedLists.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            cards={cards.filter((card) => card.listId === list.id)}
            onAddCard={(title, priority) => handleAddCard(list.id, title, priority)}
            onCardClick={setEditingCard}
            onListClick={setEditingList}
          />
        ))}
        <AddListForm onSubmit={handleAddList} />
      </main>
      {editingCard && (
        <EditCardModal card={editingCard} onSave={handleSaveCard} onClose={() => setEditingCard(null)} />
      )}
      {editingList && (
        <EditListModal list={editingList} onSave={handleSaveList} onClose={() => setEditingList(null)} />
      )}
    </div>
  );
}
