import { useEffect, useMemo, useState } from "react";
import api from "../api";
import VoteButtons from "./VoteButtons";

type Props = {
  assets: string[];
  investorType?: string;
  userId?: string; // optional: lets VoteButtons key local state per user
};

export default function AiInsight({ assets, investorType = "HODLer", userId }: Props) {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Comma-separated assets for the backend
  const assetsQuery = useMemo(() => assets.join(","), [assets]);

  // Stable daily id for voting (e.g., "insight:2025-11-11")
  // Note: this will refresh on page load; if you need live rollover at midnight, derive date from a ticking clock.
  const insightId = useMemo(() => {
    const date = new Date().toISOString().split("T")[0];
    return `insight:${date}`;
  }, []);

  useEffect(() => {
    let alive = true;

    const fetchInsight = async () => {
      try {
        setErr(null);
        setLoading(true);
        const body = {
          assets: assetsQuery ? assetsQuery.split(",") : [],
          investorType,
        };
        const res = await api.post("/ai-insight", body);
        if (!alive) return;
        setInsight(res.data?.insight || "");
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.response?.data?.error || "Failed to generate insight");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchInsight();
    return () => {
      alive = false;
    };
  }, [assetsQuery, investorType]);

  return (
    <section className="bg-white rounded-lg shadow p-4">
      {/* header + voting */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">AI Insight of the Day 🤖</h2>
        <VoteButtons type="insight" itemId={insightId} userId={userId} />
      </div>

      {!assets.length ? (
        <div className="text-gray-500 text-sm">
          Select assets in preferences to tailor the insight.
        </div>
      ) : loading ? (
        <div className="text-gray-500 text-sm">Generating insight…</div>
      ) : err ? (
        <div className="text-red-600 text-sm">{err}</div>
      ) : (
        <p className="text-gray-800 leading-7">{insight || "…"}</p>
      )}
    </section>
  );
}
