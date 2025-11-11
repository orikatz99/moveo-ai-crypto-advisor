import express from "express";
const router = express.Router();

router.get("/news", async (req, res) => {
  try {
    const token = process.env.CRYPTOPANIC_API_KEY;
    if (!token) {
      return res.status(500).json({ error: "Missing CRYPTOPANIC_API_KEY" });
    }

    const assets = typeof req.query.assets === "string" ? req.query.assets : "";
    const url = new URL("https://cryptopanic.com/api/v1/posts/");
    url.searchParams.set("auth_token", token);
    if (assets) url.searchParams.set("currencies", assets); 
    url.searchParams.set("filter", "news"); 
    url.searchParams.set("public", "true");

    const r = await fetch(url.toString());
    if (!r.ok) {
      return res
        .status(502)
        .json({ error: `CryptoPanic HTTP ${r.status}` });
    }
    const data = await r.json();

    const results = (data?.results || []).slice(0, 5).map((p: any) => ({
      id: p.id,
      title: p.title,
      url: p.url,
      source: p.source?.title || "",
      published_at: p.published_at,
      currencies: (p.currencies || []).map((c: any) => c.code),
    }));

    res.json({ results });
  } catch (err: any) {
    console.error("news route error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
