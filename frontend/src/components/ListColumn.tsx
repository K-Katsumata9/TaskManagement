import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { CardInput } from "../api";
import type { Card, TaskList } from "../types";
import { AddCardForm } from "./AddCardForm";
import { CardItem } from "./CardItem";

export function ListColumn({
  list,
  cards,
  onAddCard,
  onCardClick,
  onListClick,
  onSort,
}: {
  list: TaskList;
  cards: Card[];
  onAddCard: (input: CardInput) => Promise<void>;
  onCardClick: (card: Card) => void;
  onListClick: (list: TaskList) => void;
  onSort: (criterion: "priority" | "dueDate") => void;
}) {
  const { setNodeRef } = useDroppable({ id: `list-${list.id}`, disabled: cards.length > 0 });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-gray-100 p-3">
      <h2
        onClick={() => onListClick(list)}
        className="mb-2 cursor-pointer rounded px-1 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200"
      >
        {list.title}
      </h2>
      <div className="mb-2 flex gap-1">
        <button
          type="button"
          onClick={() => onSort("priority")}
          className="rounded bg-white px-2 py-1 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
        >
          優先順位で並び替え
        </button>
        <button
          type="button"
          onClick={() => onSort("dueDate")}
          className="rounded bg-white px-2 py-1 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
        >
          期限で並び替え
        </button>
      </div>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex min-h-8 flex-1 flex-col gap-2">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} onClick={() => onCardClick(card)} />
          ))}
        </div>
      </SortableContext>
      <AddCardForm onSubmit={onAddCard} />
    </div>
  );
}
