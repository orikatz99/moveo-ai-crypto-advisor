import express from "express";

const router = express.Router();

router.get("/meme", async (req, res) => {
  try {
    const assets = typeof req.query.assets === "string"
      ? req.query.assets.split(",")
      : [];

    // example mapping between assets and subreddits
    const subredditMap: Record<string, string> = {
      BTC: "BitcoinMemes",
      ETH: "CryptoCurrencyMemes",
      SOL: "CryptoMoonShots",
      DOGE: "dogecoinmemes",
    };

    // Pick a subreddit based on the first asset
    const subreddit = subredditMap[assets[0]] || "CryptoCurrencyMemes";

    // Fetch top memes from Reddit JSON API
    const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=20&t=month`;
    const r = await fetch(url);
    const data = await r.json();

    // Filter only image posts
    const posts = (data?.data?.children || [])
      .map((p: any) => p.data)
      .filter((p: any) => p.post_hint === "image");

    if (!posts.length) {
      return res.json({
        title: "When crypto market goes sideways...",
        imageUrl: "https://i.imgur.com/8tP4hFQ.jpeg",
        postUrl: "https://reddit.com/r/CryptoCurrencyMemes",
        source: subreddit,
      });
    }

    // Pick one random meme
    const meme = posts[Math.floor(Math.random() * posts.length)];
    res.json({
      title: meme.title,
      imageUrl: meme.url,
      postUrl: `https://reddit.com${meme.permalink}`,
      source: subreddit,
    });
  } catch (err) {
    console.error("meme route error:", err);
    res.json({
      title: "Keep calm and HODL 💎🙌",
      imageUrl: "https://i.imgur.com/8tP4hFQ.jpeg",
      postUrl: "",
      source: "Fallback Meme",
    });
  }
});

export default router;
