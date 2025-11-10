import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const [user, setUser] = useState<{ name?: string; preferences?: any } | null>(null);

  const navigate = useNavigate();

async function handleLogout() {
  try {
    await api.post("/logout");
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    navigate("/login"); // back to login screen
  }
}

  // Fetch current user (includes preferences)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Mapping asset symbols to CoinGecko IDs
  const COINGECKO_IDS: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    SOL: "solana",
    DOGE: "dogecoin",
  };

  // Get selected assets from user preferences
  const selectedAssets: string[] = Array.isArray(user?.preferences?.assets)
    ? user!.preferences.assets
    : [];

  // Convert selected assets to CoinGecko IDs
  const coingeckoIds: string[] = selectedAssets
    .map((sym) => COINGECKO_IDS[sym])
    .filter(Boolean);

  // --- Coin price states ---
  const [prices, setPrices] = useState<Record<string, { usd: number }>>({});
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Format price as USD currency
  const fmtUSD = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  // Stable comma-separated IDs for CoinGecko API (e.g. "ethereum,dogecoin")
  const idsQuery = useMemo(() => coingeckoIds.join(","), [coingeckoIds]);

  // Fetch prices from CoinGecko when IDs are available
  useEffect(() => {
    if (!idsQuery) return; // no need to fetch if user selected nothing

    const fetchPrices = async () => {
      try {
        setPriceError(null);
        setPriceLoading(true);

        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsQuery}&vs_currencies=usd`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setPrices(data); // e.g. { ethereum: { usd: 3210 }, dogecoin: { usd: 0.12 } }
      } catch (e: any) {
        setPriceError(e?.message || "Failed to load prices");
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPrices();
  }, [idsQuery]);

  return (
    <div className="min-h-screen" style={{ background: "beige" }}>
      <header className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
  <div>
    <h1 className="text-2xl md:text-3xl font-bold">Daily Dashboard</h1>
    <p className="text-gray-600">
      Hello, {user?.name || "Guest"} 
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="px-3 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-black"
  >
    Logout
  </button>
</header>


      <main className="max-w-5xl mx-auto px-4 pb-10 grid gap-6 md:grid-cols-2">
        {/* --- Section 1: Market News --- */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Market News</h2>
          <div className="text-gray-500 text-sm">Coming soon…</div>
        </section>

        {/* --- Section 2: Coin Prices --- */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Coin Prices</h2>

          {selectedAssets.length === 0 ? (
            // No assets selected
            <div className="text-gray-500 text-sm">
              No assets selected in preferences.
            </div>
          ) : priceLoading ? (
            // Loading from CoinGecko
            <div className="text-gray-500 text-sm">Loading prices…</div>
          ) : priceError ? (
            // API error
            <div className="text-red-600 text-sm">{priceError}</div>
          ) : (
            // Render prices list
            <ul className="text-sm space-y-2">
              {coingeckoIds.map((id) => (
                <li key={id} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">
                    {id.replace("-", " ")}
                  </span>
                  <span className="font-semibold">
                    {prices[id]?.usd != null ? fmtUSD(prices[id].usd) : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* --- Section 3: AI Insight --- */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">AI Insight of the Day</h2>
          <div className="text-gray-500 text-sm">Coming soon…</div>
        </section>

        {/* --- Section 4: Fun Meme --- */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Fun Crypto Meme</h2>
          <div className="text-gray-500 text-sm">Coming soon…</div>
        </section>
      </main>
    </div>
  );
}
