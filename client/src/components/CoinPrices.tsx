import { useEffect, useMemo, useState } from "react";
import VoteButtons from "./VoteButtons";

type Props = { assets: string[] };

// map user symbols -> CoinGecko ids
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  DOGE: "dogecoin",
};

// format numbers as USD
const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function CoinPrices({ assets }: Props) {
  // keep both symbol and id so we can show symbol and fetch by id
  const coins = useMemo(
    () =>
      assets
        .map((sym) => ({ sym, id: COINGECKO_IDS[sym] }))
        .filter((c): c is { sym: string; id: string } => Boolean(c.id)),
    [assets]
  );

  // build "bitcoin,ethereum" for API
  const idsQuery = useMemo(() => coins.map((c) => c.id).join(","), [coins]);

  // price state
  const [prices, setPrices] = useState<Record<string, { usd: number }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch prices when ids change
  useEffect(() => {
    if (!idsQuery) return;
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${idsQuery}&vs_currencies=usd`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setPrices(await res.json());
      } catch (e: any) {
        setError(e?.message || "Failed to load prices");
      } finally {
        setLoading(false);
      }
    })();
  }, [idsQuery]);

  if (assets.length === 0)
    return (
      <div className="text-gray-500 text-sm">
        No assets selected in preferences.
      </div>
    );
  if (loading)
    return <div className="text-gray-500 text-sm">Loading prices…</div>;
  if (error) return <div className="text-red-600 text-sm">{error}</div>;

  return (
    <ul className="text-sm space-y-2">
      {coins.map(({ sym, id }) => (
        <li key={sym} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-700">{sym}</span>
            <span className="font-semibold">
              {prices[id]?.usd != null ? fmtUSD(prices[id].usd) : "—"}
            </span>
          </div>

          {/* voting per coin: type "price", itemId is the symbol (e.g., BTC) */}
          <VoteButtons type="price" itemId={sym} />
        </li>
      ))}
    </ul>
  );
}
