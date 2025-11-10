import { useState } from "react";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setMsg("");
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      setMsg(res.data?.msg || "Login successful");
    } catch (err: any) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.error;

      if (status === 401) setMsg("Invalid credentials.");
      else if (status === 404) setMsg("User not found. Please sign up first.");
      else if (serverMsg) setMsg(serverMsg);
      else setMsg("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f3ec]">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-4 text-sm ${
              msg.toLowerCase().includes("success")
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
