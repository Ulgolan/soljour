"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xs flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-zinc-100 px-3 py-2 text-black"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
