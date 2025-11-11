import { useEffect, useMemo, useState } from "react";
import api from "../api";

type Meme = {
  title: string;
  imageUrl: string;
  postUrl: string;
  source: string;
};

export default function FunMeme({ assets }: { assets: string[] }) {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Build query string like "BTC,ETH"
  const assetsQuery = useMemo(() => assets.join(","), [assets]);

  useEffect(() => {
    let alive = true;

    const fetchMeme = async () => {
      try {
        setErr(null);
        setLoading(true);
        const res = await api.get("/meme", { params: { assets: assetsQuery } });
        if (!alive) return;
        setMeme(res.data);
      } catch {
        if (!alive) return;
        setErr("Failed to load meme");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchMeme();
    return () => {
      alive = false;
    };
  }, [assetsQuery]);

  // Fallback image in case the remote image fails to load
  const FALLBACK_IMG =
    "https://i.redd.it/6t5b0zqgkcl81.jpg"; // safe, static image

  if (loading) {
    // Lightweight skeleton to keep card height stable
    return (
      <div className="text-gray-500 text-sm">
        Loading…
        <div className="mt-2 h-40 w-full rounded-lg bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (err) {
    return <div className="text-red-600 text-sm">{err}</div>;
  }

  if (!meme) {
    return <div className="text-gray-500 text-sm">No meme right now.</div>;
  }

  return (
    <div>
      <p className="text-sm text-gray-700 mb-2">{meme.title}</p>

      {/* Wrap image with link to the original Reddit post */}
      <a
        href={meme.postUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label="Open meme post"
      >
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full rounded-lg border border-gray-100"
          onError={(e) => {
            // Swap to a reliable fallback image if the original fails
            if (e.currentTarget.src !== FALLBACK_IMG) {
              e.currentTarget.src = FALLBACK_IMG;
            }
          }}
        />
      </a>

      <div className="text-xs text-gray-500 mt-2">Source: {meme.source}</div>
    </div>
  );
}
