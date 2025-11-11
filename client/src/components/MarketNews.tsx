import { useEffect, useMemo, useState } from "react";
import api from "../api";
import VoteButtons from "./VoteButtons";

type NewsItem = {
  id: number | string;
  title: string;
  source: string;
  published_at: string;
  currencies: string[];
};

export default function MarketNews({ assets, userId }: { assets: string[]; userId?: string }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Build comma-separated query (e.g. "BTC,ETH")
  const assetsQuery = useMemo(() => assets.join(","), [assets]);

  // Fetch news from backend based on selected assets
  useEffect(() => {
    const run = async () => {
      if (!assetsQuery) {
        setItems([]);
        return;
      }
      try {
        setErr(null);
        setLoading(true);
        const res = await api.get(`/news`, { params: { assets: assetsQuery } });
        setItems(res.data?.results || []);
      } catch (e: any) {
        setErr(e?.response?.data?.error || "Failed to load news");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [assetsQuery]);

  return (
    <section className="bg-white rounded-lg shadow p-4">
      {!assets.length ? (
        <div className="text-gray-500 text-sm">
          Select assets in preferences to tailor the news.
        </div>
      ) : loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : err ? (
        <div className="text-red-600 text-sm">{err}</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 text-sm">No news right now.</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((n) => (
            <li key={n.id} className="py-3">
              {/* headline + voting */}
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-gray-900">
                  {n.title}
                </div>
                {/* vote buttons */}
                  <VoteButtons type="news" itemId={String(n.id)} userId={userId} />
              </div>

              {/* metadata (source + date) */}
              <div className="text-xs text-gray-500 mt-1">
                {n.source ? `${n.source} • ` : ""}
                {new Date(n.published_at).toLocaleString()}
              </div>

              {/* tags */}
              {n.currencies?.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {n.currencies.map((c) => (
                    <span
                      key={c}
                      className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
