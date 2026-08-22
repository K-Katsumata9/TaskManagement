import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import {
  DeleteConflictError,
  createCard,
  createList,
  deleteCard,
  deleteList,
  fetchCards,
  fetchLists,
  reorderCards,
  updateCard,
  updateList,
  type CardInput,
} from "../api";
import type { Card, TaskList } from "../types";
import { AddListForm } from "./AddListForm";
import { CardOverlay } from "./CardItem";
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
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const dragOriginListId = useRef<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  useEffect(() => {
    Promise.all([fetchLists(), fetchCards()])
      .then(([lists, cards]) => {
        setLists(lists);
        setCards([...cards].sort((a, b) => a.position - b.position));
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

  const handleAddCard = async (listId: number, input: CardInput) => {
    const newCard = await createCard(listId, input);
    setCards((prev) => [...prev, newCard]);
  };

  const handleSaveCard = async (input: CardInput) => {
    if (!editingCard) return;
    const updated = await updateCard(editingCard.id, input);
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingCard(null);
  };

  const handleSaveList = async (title: string) => {
    if (!editingList) return;
    const updated = await updateList(editingList.id, title);
    setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setEditingList(null);
  };

  const handleDeleteCard = async () => {
    if (!editingCard) return;
    await deleteCard(editingCard.id);
    setCards((prev) => prev.filter((c) => c.id !== editingCard.id));
    setEditingCard(null);
  };

  const handleDeleteList = async () => {
    if (!editingList) return;
    try {
      await deleteList(editingList.id);
    } catch (err: unknown) {
      if (err instanceof DeleteConflictError) {
        window.alert("リスト内にカードが存在するため削除できません");
        return;
      }
      throw err;
    }
    setLists((prev) => prev.filter((l) => l.id !== editingList.id));
    setEditingList(null);
  };

  const findCard = (id: number) => cards.find((c) => c.id === id);

  const cardsOfList = (listId: number) => cards.filter((c) => c.listId === listId);

  const persistLists = async (allCards: Card[], listIds: Iterable<number>) => {
    for (const listId of listIds) {
      const orderedIds = allCards
        .filter((c) => c.listId === listId)
        .map((c) => c.id);
      if (orderedIds.length === 0) continue;
      const updated = await reorderCards(listId, orderedIds);
      const updatedById = new Map(updated.map((c) => [c.id, c]));
      setCards((prev) => {
        const others = prev.filter((c) => c.listId !== listId);
        const orderedUpdated = orderedIds.map((id) => updatedById.get(id)).filter((c): c is Card => c !== undefined);
        return [...others, ...orderedUpdated];
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const card = findCard(Number(event.active.id));
    setActiveCard(card ?? null);
    dragOriginListId.current = card?.listId ?? null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overIdRaw = over.id;

    setCards((prev) => {
      const activeCardNow = prev.find((c) => c.id === activeId);
      if (!activeCardNow) return prev;

      const idStr = String(overIdRaw);
      const overListId = idStr.startsWith("list-")
        ? Number(idStr.slice("list-".length))
        : (prev.find((c) => c.id === Number(overIdRaw))?.listId ?? null);
      if (overListId === null) return prev;

      const overCard = prev.find((c) => c.id === Number(overIdRaw));

      if (activeCardNow.listId === overListId) {
        if (!overCard || overCard.id === activeCardNow.id) return prev;

        const listCards = prev.filter((c) => c.listId === overListId);
        const oldIndex = listCards.findIndex((c) => c.id === activeCardNow.id);
        const newIndex = listCards.findIndex((c) => c.id === overCard.id);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;

        const reordered = arrayMove(listCards, oldIndex, newIndex);
        const others = prev.filter((c) => c.listId !== overListId);
        return [...others, ...reordered];
      }

      const withoutActive = prev.filter((c) => c.id !== activeCardNow.id);
      const destCards = withoutActive.filter((c) => c.listId === overListId);
      const insertAt =
        overCard && overCard.listId === overListId ? destCards.findIndex((c) => c.id === overCard.id) : destCards.length;

      const nextDestCards = [...destCards];
      nextDestCards.splice(insertAt === -1 ? destCards.length : insertAt, 0, {
        ...activeCardNow,
        listId: overListId,
      });

      const rest = withoutActive.filter((c) => c.listId !== overListId);
      return [...rest, ...nextDestCards];
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const draggedId = Number(event.active.id);
    setActiveCard(null);

    const originListId = dragOriginListId.current;
    dragOriginListId.current = null;

    const latestCards = await new Promise<Card[]>((resolve) => {
      setCards((prev) => {
        resolve(prev);
        return prev;
      });
    });

    const draggedCard = latestCards.find((c) => c.id === draggedId);
    if (!draggedCard) return;

    const affectedListIds = new Set<number>([draggedCard.listId]);
    if (originListId !== null) affectedListIds.add(originListId);

    await persistLists(latestCards, affectedListIds);
  };

  const handleSortList = async (listId: number, criterion: "priority" | "dueDate") => {
    const priorityOrder: Record<string, number> = { 高: 0, 中: 1, 低: 2 };
    const current = cardsOfList(listId);
    const sorted = [...current].sort((a, b) => {
      if (criterion === "priority") {
        return (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
      }
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });

    const orderedIds = sorted.map((c) => c.id);
    const updated = await reorderCards(listId, orderedIds);
    const updatedById = new Map(updated.map((c) => [c.id, c]));
    setCards((prev) => {
      const others = prev.filter((c) => c.listId !== listId);
      const orderedUpdated = orderedIds.map((id) => updatedById.get(id)).filter((c): c is Card => c !== undefined);
      return [...others, ...orderedUpdated];
    });
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="flex flex-1 items-start gap-4 overflow-x-auto p-6">
          {sortedLists.map((list) => (
            <ListColumn
              key={list.id}
              list={list}
              cards={cardsOfList(list.id)}
              onAddCard={(input) => handleAddCard(list.id, input)}
              onCardClick={setEditingCard}
              onListClick={setEditingList}
              onSort={(criterion) => handleSortList(list.id, criterion)}
            />
          ))}
          <AddListForm onSubmit={handleAddList} />
        </main>
        <DragOverlay>{activeCard && <CardOverlay card={activeCard} />}</DragOverlay>
      </DndContext>
      {editingCard && (
        <EditCardModal
          card={editingCard}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          onClose={() => setEditingCard(null)}
        />
      )}
      {editingList && (
        <EditListModal
          list={editingList}
          hasCards={cardsOfList(editingList.id).length > 0}
          onSave={handleSaveList}
          onDelete={handleDeleteList}
          onClose={() => setEditingList(null)}
        />
      )}
    </div>
  );
}
