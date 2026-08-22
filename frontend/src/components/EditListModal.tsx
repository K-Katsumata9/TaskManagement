import { useState } from "react";
import type { TaskList } from "../types";
import { Modal } from "./Modal";

export function EditListModal({
  list,
  hasCards,
  onSave,
  onDelete,
  onClose,
}: {
  list: TaskList;
  hasCards: boolean;
  onSave: (title: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(list.title);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (hasCards) return;
    if (!window.confirm(`リスト「${list.title}」を削除しますか？`)) return;

    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
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
        <div className="flex items-center justify-between gap-2">
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
          <div className="group relative">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              aria-disabled={hasCards}
              className={
                hasCards
                  ? "cursor-not-allowed rounded px-3 py-1 text-sm text-gray-400"
                  : "rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              }
            >
              削除
            </button>
            {hasCards && (
              <span className="pointer-events-none absolute bottom-full right-0 z-10 mb-1 hidden w-max max-w-56 rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                リスト内のカードを削除（または移動）させてから削除してください
              </span>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
