# Moveo AI Crypto Advisor

Personalized crypto dashboard built for the **Moveo coding assignment**, featuring onboarding, daily AI insights, market news, real-time coin prices, memes, and thumbs-up/down feedback — all based on each user’s saved preferences.

---

### 🌐 Live Links

- **Frontend (Vercel):** [https://moveo-ai-crypto-advisor.vercel.app](https://moveo-ai-crypto-advisor.vercel.app)  
- **Backend Health:** [https://moveo-ai-crypto-advisor.onrender.com/api/health](https://moveo-ai-crypto-advisor.onrender.com/api/health)  
- **GitHub Repository:** [https://github.com/orikatz99/moveo-ai-crypto-advisor](https://github.com/orikatz99/moveo-ai-crypto-advisor)

---

## ✨ Features

- **Authentication** — Sign up / Login with JWT stored in secure cross-site cookies  
- **Onboarding** — Choose assets, investor type, and content preferences  
- **Personalized Dashboard**  
  - 🪙 Coin Prices (CoinGecko)  
  - 🧠 AI Insight of the Day (Hugging Face Inference API)  
  - 📰 Market News (CryptoPanic)  
  - 😄 Fun Crypto Meme (Reddit)  
- **Voting** — Per-item 👍/👎, persisted per user and shown in UI  
- **Production-ready CORS** — Vercel (frontend) ↔ Render (backend) with credentials

---

## 🧱 Tech Stack

**Frontend**
- React (Vite + TypeScript), React Router  
- TailwindCSS  
- Axios with `withCredentials` for cookie auth  
- Deployed on **Vercel**

**Backend + DB**
- Node.js, Express, Mongoose (MongoDB Atlas)  
- JWT auth (cookies)  
- CORS with dynamic allowlist  
- Deployed on **Render**

**APIs**
- **CoinGecko** — crypto prices  
- **Hugging Face** — AI-generated daily insight  
- **CryptoPanic** — market news  
- **Reddit** — memes fallback and fun content

---

## 📁 Project Structure

```text
moveo-ai-crypto-advisor/
├─ client/                 # React + Vite + TypeScript (frontend)
│  ├─ src/
│  │  ├─ pages/            # Login, Register, Onboarding, Dashboard
│  │  ├─ components/       # CoinPrices, MarketNews, AiInsight, FunMeme, VoteButtons
│  │  ├─ api.ts            # Axios instance (uses VITE_API_BASE_URL)
│  │  └─ main.tsx          # Router and routes
│  └─ ...
└─ server/                 # Node.js + Express (backend)
   ├─ routes/              # authRoutes, newsRoutes, aiRoutes, memeRoutes, voteRoutes
   ├─ controllers/         # authController (signup/login/preferences)
   ├─ middleware/          # requireAuth
   ├─ models/              # userModel, voteModel
   └─ index.ts             # CORS, cookies, MongoDB, routes, health


