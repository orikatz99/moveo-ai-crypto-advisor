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

  // build query string like BTC,ETH
  const assetsQuery = useMemo(() => assets.join(","), [assets]);

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        setErr(null);
        setLoading(true);

        const res = await api.get("/meme", { params: { assets: assetsQuery } });
        setMeme(res.data);
      } catch {
        setErr("Failed to load meme");
      } finally {
        setLoading(false);
      }
    };

    fetchMeme();
  }, [assetsQuery]);

  return (
    <section className="bg-white rounded-lg shadow p-4">

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : err ? (
        <div className="text-red-600 text-sm">{err}</div>
      ) : !meme ? (
        <div className="text-gray-500 text-sm">No meme right now.</div>
      ) : (
        <div>
          <p className="text-sm text-gray-700 mb-2">{meme.title}</p>
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className="w-full rounded-lg border border-gray-100"
          />
          <div className="text-xs text-gray-500 mt-2">Source: {meme.source}</div>
        </div>
      )}
    </section>
  );
}
