import { useEffect, useMemo, useState } from "react";

type Props = { assets: string[] };

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  DOGE: "dogecoin",
};

const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function CoinPrices({ assets }: Props) {
  const ids = useMemo(
    () => assets.map(a => COINGECKO_IDS[a]).filter(Boolean),
    [assets]
  );

  const idsQuery = useMemo(() => ids.join(","), [ids]);
  const [prices, setPrices] = useState<Record<string, { usd: number }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    return <div className="text-gray-500 text-sm">No assets selected in preferences.</div>;
  if (loading)
    return <div className="text-gray-500 text-sm">Loading prices…</div>;
  if (error)
    return <div className="text-red-600 text-sm">{error}</div>;

  return (
    <ul className="text-sm space-y-2">
      {ids.map(id => (
        <li key={id} className="flex items-center justify-between">
          <span className="text-gray-700 capitalize">{id?.replace("-", " ")}</span>
          <span className="font-semibold">
            {prices[id]?.usd != null ? fmtUSD(prices[id].usd) : "—"}
          </span>
        </li>
      ))}
    </ul>
  );
}
