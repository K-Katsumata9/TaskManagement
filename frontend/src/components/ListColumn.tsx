import type { Card, TaskList } from "../types";
import { AddCardForm } from "./AddCardForm";
import { CardItem } from "./CardItem";

export function ListColumn({
  list,
  cards,
  onAddCard,
  onCardClick,
  onListClick,
}: {
  list: TaskList;
  cards: Card[];
  onAddCard: (title: string, priority: string) => Promise<void>;
  onCardClick: (card: Card) => void;
  onListClick: (list: TaskList) => void;
}) {
  const sortedCards = [...cards].sort((a, b) => a.position - b.position);

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-gray-100 p-3">
      <h2
        onClick={() => onListClick(list)}
        className="mb-3 cursor-pointer rounded px-1 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200"
      >
        {list.title}
      </h2>
      <div className="flex flex-col gap-2">
        {sortedCards.map((card) => (
          <CardItem key={card.id} card={card} onClick={() => onCardClick(card)} />
        ))}
      </div>
      <AddCardForm onSubmit={onAddCard} />
    </div>
  );
}
