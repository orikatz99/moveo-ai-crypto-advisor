import express from "express";

const router = express.Router();

/** Helper function to randomly pick an item from an array */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Stable fallback memes in case Reddit fetch fails */
const FALLBACKS = [
  {
    title: "HODL wizard",
    imageUrl: "https://i.redd.it/f42f4j9kq9p61.jpg",
    postUrl: "https://www.reddit.com/r/BitcoinMemes/",
  },
  {
    title: "Buy the dip",
    imageUrl: "https://i.redd.it/6t5b0zqgkcl81.jpg",
    postUrl: "https://www.reddit.com/r/CryptoCurrencyMemes/",
  },
  {
    title: "Sideways market",
    imageUrl: "https://i.redd.it/oz5cgs1y9js41.jpg",
    postUrl: "https://www.reddit.com/r/BitcoinMemes/",
  },
];

/** Meme route — fetches a random crypto meme from Reddit */
router.get("/meme", async (req, res) => {
  try {
    // Extract assets from query string
    const assets =
      typeof req.query.assets === "string" ? req.query.assets.split(",") : [];

    // Map assets to subreddit names
    const subredditMap: Record<string, string> = {
      BTC: "BitcoinMemes",
      ETH: "CryptoCurrencyMemes",
      SOL: "CryptoCurrencyMemes",
      DOGE: "dogecoinmemes",
    };

    // Choose subreddit (based on first asset, or default)
    const subreddit =
      subredditMap[assets[0] as string] || "CryptoCurrencyMemes";

    // Reddit API endpoint — use raw_json=1 to avoid HTML entities (&amp;)
    const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=50&t=month&raw_json=1`;

    // Always send a user-agent to avoid 429 / blocked requests
    const r = await fetch(url, {
      headers: {
        "User-Agent":
          "MoveoCryptoAdvisor/1.0 (+https://example.com; contact: dev@domain)",
      },
    });

    if (!r.ok) throw new Error(`Reddit HTTP ${r.status}`);

    const data = await r.json();

    // Extract image posts only
    const posts = (data?.data?.children || [])
      .map((c: any) => c?.data)
      .filter(Boolean)
      .filter((p: any) => {
        const u = (p.url_overridden_by_dest || p.url || "").toLowerCase();
        return (
          p.post_hint === "image" ||
          u.endsWith(".jpg") ||
          u.endsWith(".jpeg") ||
          u.endsWith(".png") ||
          Boolean(p.preview?.images?.[0]?.source?.url)
        );
      });

    // If no posts found, use a fallback meme
    if (!posts.length) {
      const fb = pick(FALLBACKS);
      return res.json({
        title: fb.title,
        imageUrl: fb.imageUrl,
        postUrl: fb.postUrl,
        source: subreddit,
      });
    }

    // Type definition for Reddit post
    type RedditPost = {
      url_overridden_by_dest?: string;
      url?: string;
      permalink?: string;
      title?: string;
      preview?: { images?: Array<{ source?: { url?: string } }> };
    };

    // Pick one random post
    const m = pick(posts as RedditPost[]);

    // Extract and clean image URL
    let imageUrl: string =
      (m?.url_overridden_by_dest as string) ||
      (m?.url as string) ||
      (m?.preview?.images?.[0]?.source?.url as string) ||
      "";

    imageUrl = String(imageUrl).replace(/&amp;/g, "&");

    // Build permalink (if missing, redirect to subreddit)
    const permalink =
      typeof m?.permalink === "string" && m.permalink.length
        ? `https://www.reddit.com${m.permalink}`
        : `https://www.reddit.com/r/${subreddit}/`;

    // Return JSON response
    return res.json({
      title: m?.title || "Crypto meme",
      imageUrl,
      postUrl: permalink,
      source: subreddit,
    });
  } catch (err) {
    console.error("meme route error:", err);

    // Fallback meme if request fails
    const fb = FALLBACKS[0];
    res.json({
      title: fb.title,
      imageUrl: fb.imageUrl,
      postUrl: fb.postUrl,
      source: "Fallback Meme",
    });
  }
});

export default router;
