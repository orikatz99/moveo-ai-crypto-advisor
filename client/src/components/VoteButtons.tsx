import { useEffect, useState } from "react";
import api from "../api";

type VoteType = "news" | "price" | "insight" | "meme";

type Props = {
  type: VoteType;
  itemId: string;
  className?: string;
  size?: "sm" | "md";
};

export default function VoteButtons({ type, itemId, className = "", size = "sm" }: Props) {
  const storageKey = `vote:${type}:${itemId}`;
  const [myVote, setMyVote] = useState<-1 | 0 | 1>(0);
  const [busy, setBusy] = useState(false);

  // Restore saved vote (so highlight survives re-mount/refresh)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === "1" || raw === "-1") setMyVote(Number(raw) as 1 | -1);
    } catch {}
  }, [storageKey]);

  const send = async (value: 1 | -1) => {
    if (busy) return;
    // If clicking the same choice again, do nothing (keep it selected)
    if (myVote === value) return;

    // Optimistic: set + persist immediately
    setMyVote(value);
    try { localStorage.setItem(storageKey, String(value)); } catch {}

    try {
      setBusy(true);
      await api.post("/votes", { type, itemId, value });
    } catch {
      // We do NOT roll back UI — it stays selected as ביקשת.
      // אפשר להוסיף הודעת שגיאה קטנה בעתיד אם תרצי.
    } finally {
      setBusy(false);
    }
  };

  const base =
    "inline-flex items-center rounded border px-2 py-1 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60";
  const upSelected =
    "bg-green-100 border-green-300 text-green-700";
  const upIdle =
    "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";
  const downSelected =
    "bg-red-100 border-red-300 text-red-700";
  const downIdle =
    "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";

  const gap = size === "md" ? "gap-2" : "gap-1";

  return (
    <span className={`flex ${gap} ${className}`}>
      <button
        type="button"
        aria-label="Upvote"
        aria-pressed={myVote === 1}
        disabled={busy}
        onClick={() => send(1)}
        className={`${base} ${myVote === 1 ? upSelected : upIdle}`}
        title="Upvote"
      >
        👍
      </button>
      <button
        type="button"
        aria-label="Downvote"
        aria-pressed={myVote === -1}
        disabled={busy}
        onClick={() => send(-1)}
        className={`${base} ${myVote === -1 ? downSelected : downIdle}`}
        title="Downvote"
      >
        👎
      </button>
    </span>
  );
}
