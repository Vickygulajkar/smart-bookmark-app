"use client";

import LoginButton from "@/src/components/LoginButton";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-6">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Smart Bookmark
            </h1>
            <p className="mt-2 text-[var(--muted)] text-sm">
              Save and organize your links in one place. Sign in to get started.
            </p>
          </div>

          <LoginButton />
        </div>

        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          By continuing, you agree to sign in with your Google account.
        </p>
      </div>
    </div>
  );
}
