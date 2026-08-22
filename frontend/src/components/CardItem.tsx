import type { Card } from "../types";

const priorityColor: Record<string, string> = {
  高: "bg-red-100 text-red-700",
  中: "bg-yellow-100 text-yellow-700",
  低: "bg-blue-100 text-blue-700",
};

export function CardItem({ card, onClick }: { card: Card; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:bg-gray-50"
    >
      <p className="text-sm text-gray-800">{card.title}</p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs ${
            priorityColor[card.priority] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {card.priority}
        </span>
        {card.dueDate && <span className="text-xs text-gray-500">期限: {card.dueDate}</span>}
      </div>
    </div>
  );
}
