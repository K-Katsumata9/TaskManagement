import { useState } from "react";
import type { CardInput } from "../api";

const PRIORITIES = ["高", "中", "低"];

export function AddCardForm({
  onSubmit,
}: {
  onSubmit: (input: CardInput) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(PRIORITIES[1]);
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setIsEditing(false);
    setTitle("");
    setDescription("");
    setPriority(PRIORITIES[1]);
    setDueDate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
        priority,
        dueDate: dueDate ? dueDate : null,
      });
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="mt-2 rounded px-1 py-1 text-left text-sm text-gray-500 hover:bg-gray-200"
      >
        ＋カードを追加
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2 rounded-md bg-white p-2 shadow-sm">
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="カードのタイトル"
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="詳細（任意）"
        rows={2}
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          追加
        </button>
        <button type="button" onClick={reset} className="rounded px-3 py-1 text-sm text-gray-600">
          キャンセル
        </button>
      </div>
    </form>
  );
}
