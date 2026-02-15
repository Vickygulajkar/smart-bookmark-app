"use client";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  created_at?: string;
}

interface Props {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function BookmarkList({ bookmarks, onDelete }: Props) {
  if (bookmarks.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--card-border)] border-dashed bg-[var(--card)] p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">
          No bookmarks yet
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Add your first bookmark above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-[var(--muted)]">
        Your bookmarks ({bookmarks.length})
      </h2>
      <ul className="space-y-3">
        {bookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            className="group flex items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1"
            >
              <span className="block truncate font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {bookmark.title}
              </span>
              <span className="mt-0.5 block truncate text-sm text-[var(--muted)]">
                {getHostname(bookmark.url)}
              </span>
            </a>
            <button
              type="button"
              onClick={() => onDelete(bookmark.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
              aria-label={`Delete ${bookmark.title}`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
