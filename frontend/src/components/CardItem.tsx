import type { Card } from "../types";

const priorityColor: Record<string, string> = {
  高: "bg-red-100 text-red-700",
  中: "bg-yellow-100 text-yellow-700",
  低: "bg-blue-100 text-blue-700",
};

export function CardItem({ card }: { card: Card }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
      <p className="text-sm text-gray-800">{card.title}</p>
      <span
        className={`mt-2 inline-block rounded px-2 py-0.5 text-xs ${
          priorityColor[card.priority] ?? "bg-gray-100 text-gray-700"
        }`}
      >
        {card.priority}
      </span>
    </div>
  );
}
