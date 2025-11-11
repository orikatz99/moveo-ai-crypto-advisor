import express from "express";

const router = express.Router();


router.post("/ai-insight", async (req, res) => {
  try {
    const HF_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HF_KEY) return res.status(500).json({ error: "Missing HUGGINGFACE_API_KEY" });

    const { assets = [], investorType = "HODLer" } = req.body || {};
    const date = new Date().toISOString().split("T")[0];

    const MODEL = "google/gemma-2-2b-it";

    const prompt = [
      `You are a concise crypto assistant. Date: ${date}.`,
      `Audience type: ${investorType}.`,
      `Focus on assets (symbols): ${assets.join(", ") || "general market"}.`,
      `In <= 120 words, give ONE practical, high-level daily insight (no hype, no financial advice).`,
      `Prefer topical catalysts, levels to watch, or narrative shifts.`
    ].join(" ");

    const r = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 140, temperature: 0.7 }
      })
    });

    if (!r.ok) {
      return res.status(200).json({
        insight:
          `Quick take (${date}): Broaden exposure to majors on news days and watch funding/volume. ` +
          `For ${investorType}, treat sharp moves in ${assets.join(", ") || "BTC/ETH"} as areas to scale in/out near recent support/resistance. ` +
          `Stay reactive to macro headlines and on-chain activity; avoid over-trading chop.`
      });
    }

    const data = await r.json();

    let text = "";
    if (Array.isArray(data) && data[0]?.generated_text) {
      text = data[0].generated_text as string;
    } else if (typeof data?.generated_text === "string") {
      text = data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text == null && data[0]?.content) {
      text = String(data[0].content);
    }

    text = (text || "").trim().split(/\n{2,}|\n/)[0];
    if (!text) {
      text =
        `Quick take (${date}): Market mixed. For ${investorType}, watch reaction around recent swing levels on ` +
        `${assets.join(", ") || "BTC/ETH"} and let volume confirm direction before entries.`;
    }

    res.json({ insight: text });
  } catch (err) {
    console.error("AI insight error:", err);
    res.status(200).json({
      insight:
        "Quick take: Liquidity is clustered near recent highs/lows; let momentum confirm before chasing. " +
        "Keep risk light into major data/events."
    });
  }
});

export default router;
