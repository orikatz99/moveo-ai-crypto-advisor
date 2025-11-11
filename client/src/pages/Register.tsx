import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom"; // ⬅️ הוספתי Link

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    try {
      setMsg("");
      setLoading(true);
      await api.post("/signup", { name, email, password });
      // אחרי הרשמה אפשר ישר לנווט לאונבורדינג/דשבורד
      nav("/onboarding"); // או "/dashboard" לפי הזרימה שלך
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "beige" }}>
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Create Account</h1>

        <input
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Password (min 6)"
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {msg && <p className="text-center text-sm mb-3 text-red-600">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-black hover:opacity-90"}`}
        >
          {loading ? "Registering…" : "Register"}
        </button>

        {/* 👇 הקישור להתחברות */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
