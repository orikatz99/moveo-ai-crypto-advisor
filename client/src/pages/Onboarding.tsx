import { useState } from "react";
import api from "../api";

export default function Onboarding() {
  const [assets, setAssets] = useState<string[]>([]);
  const [investorType, setInvestorType] = useState<string>("");
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // toggle for assets
  const toggleAsset = (coin: string) => {
    setAssets((prev) =>
      prev.includes(coin) ? prev.filter((a) => a !== coin) : [...prev, coin]
    );
  };

  // toggle for content types
  const toggleContent = (type: string) => {
    setContentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const isValid =
    assets.length > 0 && investorType !== "" && contentTypes.length > 0;

  const handleSave = async () => {
    try {
      setMsg("");
      setLoading(true);
      await api.put("/preferences", { assets, investorType, contentTypes });
      setMsg("✅ Preferences saved");
    } catch (err: any) {
      const text = err?.response?.data?.error || "Failed to save preferences";
      setMsg("❌ " + text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "beige" }}
    >
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Onboarding</h1>

        {/* ==== Question 1 ==== */}
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold mb-3">
            What crypto assets are you interested in?
          </h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {[
              "BTC (Bitcoin)",
              "ETH (Ethereum)",
              "SOL (Solana)",
              "DOGE (Dogecoin)",
            ].map((label) => {
              const coin = label.split(" ")[0]; // "BTC" | "ETH" | "SOL" | "DOGE"
              return (
                <label key={label} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={assets.includes(coin)}
                    onChange={() => toggleAsset(coin)}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </div>

        {/* ==== Question 2 ==== */}
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold mb-3"> What type of investor are you?</h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {["HODLer", "Day Trader", "NFT Collector"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="investorType"
                  value={type}
                  checked={investorType === type}
                  onChange={(e) => setInvestorType(e.target.value)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* ==== Question 3 ==== */}
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold mb-3">
            What kind of content would you like to see?
          </h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {["Market News", "Charts", "Social", "Fun"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={contentTypes.includes(type)}
                  onChange={() => toggleContent(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        {msg && <div className="mb-3 text-sm text-center">{msg}</div>}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!isValid || loading}
          className={`w-full py-2 rounded text-white ${
            !isValid || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:opacity-90"
          }`}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}
