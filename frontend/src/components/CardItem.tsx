import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "../types";

const priorityColor: Record<string, string> = {
  高: "bg-red-100 text-red-700",
  中: "bg-yellow-100 text-yellow-700",
  低: "bg-blue-100 text-blue-700",
};

function CardContent({ card }: { card: Card }) {
  return (
    <>
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
    </>
  );
}

export function CardOverlay({ card }: { card: Card }) {
  return (
    <div className="rounded-md border border-blue-400 bg-white p-3 shadow-lg">
      <CardContent card={card} />
    </div>
  );
}

export function CardItem({ card, onClick }: { card: Card; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { listId: card.listId },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="cursor-pointer rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:bg-gray-50"
    >
      <CardContent card={card} />
    </div>
  );
}
