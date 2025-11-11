// client/src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import CoinPrices from "../components/CoinPrices";
import MarketNews from "../components/MarketNews";
import AiInsight from "../components/AiInsight";
import FunMeme from "../components/FunMeme";

export default function Dashboard() {
  const [user, setUser] = useState<{ name?: string; preferences?: any } | null>(null);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/login");
    }
  }

  // fetch current user (includes preferences)
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

  // preferences
  const prefs = user?.preferences || {};
  const selectedAssets: string[] = Array.isArray(prefs.assets) ? prefs.assets : [];
  const contentTypes: string[] = Array.isArray(prefs.contentTypes) ? prefs.contentTypes : [];
  const investorType: string | undefined = prefs.investorType;

  // toggles per content type (names match your onboarding options)
  const wantsNews = contentTypes.includes("Market News");
  const wantsCharts = contentTypes.includes("Charts");
  const wantsAi = contentTypes.includes("Social"); 
  const wantsFun = contentTypes.includes("Fun");

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
        {/* 1) Market News */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Market News</h2>
          {wantsNews ? (
            <MarketNews assets={selectedAssets} />
          ) : (
            <p className="text-gray-500 text-sm">
              You turned off <b>Market News</b> in preferences.
            </p>
          )}
        </section>

        {/* 2) Coin Prices (Charts) */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Coin Prices</h2>
          {wantsCharts ? (
            <CoinPrices assets={selectedAssets} />
          ) : (
            <p className="text-gray-500 text-sm">
              You turned off <b>Charts</b> in preferences.
            </p>
          )}
        </section>

        {/* 3) AI Insight of the Day */}
        {wantsAi ? (
          // AiInsight already renders its own card, so render it directly
          <AiInsight assets={selectedAssets} investorType={investorType} />
        ) : (
          // If AI is off, show a replacement card in the grid
          <section className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">AI Insight of the Day</h2>
            <p className="text-gray-500 text-sm">
              You turned off <b>Social</b> content in preferences.
            </p>
          </section>
        )}

        {/* 4) Fun Meme */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Fun Crypto Meme</h2>
          {wantsFun ? (
            <FunMeme assets={selectedAssets} />
          ) : (
            <p className="text-gray-500 text-sm">
              You turned off <b>Fun</b> content in preferences.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
