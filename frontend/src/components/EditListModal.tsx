import { useState } from "react";
import type { TaskList } from "../types";
import { Modal } from "./Modal";

export function EditListModal({
  list,
  onSave,
  onClose,
}: {
  list: TaskList;
  onSave: (title: string) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(list.title);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onSave(title.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <h2 className="mb-1 text-sm font-semibold text-gray-700">リストを編集</h2>
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
            保存
          </button>
          <button type="button" onClick={onClose} className="rounded px-3 py-1 text-sm text-gray-600">
            キャンセル
          </button>
        </div>
      </form>
    </Modal>
  );
}
