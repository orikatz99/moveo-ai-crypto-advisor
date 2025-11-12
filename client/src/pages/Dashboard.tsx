import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import CoinPrices from "../components/CoinPrices";
import MarketNews from "../components/MarketNews";
import AiInsight from "../components/AiInsight";
import FunMeme from "../components/FunMeme";

type UserShape = {
  _id?: string;
  id?: string;
  name?: string;
  preferences?: {
    assets?: string[];
    contentTypes?: string[];
    investorType?: string;
  };
};

export default function Dashboard() {
  const [user, setUser] = useState<UserShape | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Logout: server + clear local vote cache, then navigate
  async function handleLogout() {
    try {
      await api.post("/api/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear only our vote cache so next user doesn't inherit highlights
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("vote:")) localStorage.removeItem(k);
      });
      navigate("/login", { replace: true });
    }
  }

  // Fetch current user (brings preferences too)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/me");
        setUser(res.data);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "beige" }}>
        <div>Loading…</div>
      </div>
    );
  }

  // Preferences & user id
  const prefs = user?.preferences || {};
  const selectedAssets: string[] = Array.isArray(prefs.assets) ? prefs.assets : [];
  const contentTypes: string[] = Array.isArray(prefs.contentTypes) ? prefs.contentTypes : [];
  const investorType: string | undefined = prefs.investorType;
  const userId = user?._id || user?.id || undefined;

  // Toggles per content type (names match onboarding options)
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
        {/* 1) Coin Prices (Charts) */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Coin Prices 🪙</h2>
          {wantsCharts ? (
            <CoinPrices assets={selectedAssets} userId={userId} />
          ) : (
            <p className="text-gray-500 text-sm">
              You turned off <b>Charts</b> in preferences.
            </p>
          )}
        </section>

        {/* 2) AI Insight of the Day */}
        {wantsAi ? (
          <AiInsight assets={selectedAssets} investorType={investorType} userId={userId} />
        ) : (
          <section className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">AI Insight of the Day 🤖</h2>
            <p className="text-gray-500 text-sm">
              You turned off <b>Social</b> content in preferences.
            </p>
          </section>
        )}

        {/* 3) Market News */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Market News 📰</h2>
          {wantsNews ? (
            <MarketNews assets={selectedAssets} userId={userId} />
          ) : (
            <p className="text-gray-500 text-sm">
              You turned off <b>Market News</b> in preferences.
            </p>
          )}
        </section>

        {/* 4) Fun Meme */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Fun Crypto Meme 😄</h2>
          {wantsFun ? (
            <FunMeme assets={selectedAssets} userId={userId} />
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
