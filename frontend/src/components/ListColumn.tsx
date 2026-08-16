import type { Card, TaskList } from "../types";
import { CardItem } from "./CardItem";

export function ListColumn({ list, cards }: { list: TaskList; cards: Card[] }) {
  const sortedCards = [...cards].sort((a, b) => a.position - b.position);

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-gray-100 p-3">
      <h2 className="mb-3 px-1 text-sm font-semibold text-gray-700">{list.title}</h2>
      <div className="flex flex-col gap-2">
        {sortedCards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
