import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import CoinPrices from "../components/CoinPrices";
import MarketNews from "../components/MarketNews";


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

  const selectedAssets: string[] = Array.isArray(user?.preferences?.assets)
    ? user!.preferences.assets
    : [];

  return (
    <div className="min-h-screen" style={{ background: "beige" }}>
      <header className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Daily Dashboard</h1>
          <p className="text-gray-600">Hello, {user?.name || "Guest"}</p>
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
          <MarketNews assets={selectedAssets}/>
        </section>

        {/* --- Section 2: Coin Prices --- */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Coin Prices</h2>
          <CoinPrices assets={selectedAssets} />
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
