import { useEffect, useMemo, useState } from "react";
import api from "../api";
import VoteButtons from "./VoteButtons"; // ✅ import voting component

type Props = {
  assets: string[];
  investorType?: string;
};

export default function AiInsight({ assets, investorType }: Props) {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const assetsQuery = useMemo(() => assets.join(","), [assets]);

  // create a stable ID for daily AI insight (e.g. "insight:2025-11-11")
  const insightId = useMemo(() => {
    const date = new Date().toISOString().split("T")[0];
    return `insight:${date}`;
  }, []);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        setErr(null);
        setLoading(true);
        const body = {
          assets: assetsQuery ? assetsQuery.split(",") : [],
          investorType: investorType || "HODLer",
        };
        const res = await api.post("/ai-insight", body);
        setInsight(res.data?.insight || "");
      } catch (e: any) {
        setErr(e?.response?.data?.error || "Failed to generate insight");
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [assetsQuery, investorType]);

  return (
    <section className="bg-white rounded-lg shadow p-4">
      {/* header + voting */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">AI Insight of the Day 🤖</h2>
        <VoteButtons type="insight" itemId={insightId} />
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
