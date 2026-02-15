"use client";

import { useState } from "react";

interface Props {
  onAdd: (title: string, url: string) => void;
}

export default function BookmarkForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setLoading(true);
    onAdd(title.trim(), url.trim());
    setTitle("");
    setUrl("");
    setLoading(false);
  };

  const isValid = title.trim().length > 0 && url.trim().length > 0;

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Add bookmark
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="bookmark-title"
            className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
          >
            Title
          </label>
          <input
            id="bookmark-title"
            type="text"
            placeholder="e.g. My favorite article"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent transition-shadow"
          />
        </div>

        <div>
          <label
            htmlFor="bookmark-url"
            className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
          >
            URL
          </label>
          <input
            id="bookmark-url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent transition-shadow"
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--card)] disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Add bookmark
        </button>
      </form>
    </div>
  );
}
