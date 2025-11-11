import { useEffect, useMemo, useState } from "react";
import api from "../api";

type Props = {
  type: "news" | "price" | "insight" | "meme";
  itemId: string;
  userId?: string;               
};

export default function VoteButtons({ type, itemId, userId }: Props) {
  const [myVote, setMyVote] = useState<0 | 1 | -1>(0);

  // per-user cache key in localStorage
  const cacheKey = useMemo(
    () => `vote:${userId || "anon"}:${type}:${itemId}`,
    [userId, type, itemId]
  );

  useEffect(() => {
    const raw = localStorage.getItem(cacheKey);
    setMyVote(raw === "1" ? 1 : raw === "-1" ? -1 : 0);
  }, [cacheKey]);

  const send = async (value: 1 | -1) => {
    setMyVote(value);
    localStorage.setItem(cacheKey, String(value));
    try {
      await api.post("/vote", { type, itemId, value });
    } catch {
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        className={`px-2 py-1 rounded border ${
          myVote === 1 ? "bg-green-100 border-green-300" : "border-gray-300"
        }`}
        onClick={() => send(1)}
        aria-pressed={myVote === 1}
      >
        👍
      </button>
      <button
        className={`px-2 py-1 rounded border ${
          myVote === -1 ? "bg-red-100 border-red-300" : "border-gray-300"
        }`}
        onClick={() => send(-1)}
        aria-pressed={myVote === -1}
      >
        👎
      </button>
    </span>
  );
}
