import { useState } from "react";

export function AddListForm({ onSubmit }: { onSubmit: (title: string) => Promise<void> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setIsEditing(false);
    setTitle("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(title.trim());
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
        className="h-fit w-72 shrink-0 rounded-lg bg-gray-50 p-3 text-left text-sm text-gray-500 hover:bg-gray-100"
      >
        ＋リストを追加
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-72 shrink-0 flex-col gap-2 rounded-lg bg-gray-100 p-3">
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="リストのタイトル"
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
