import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom"; 

export default function Login() {
  const nav = useNavigate();
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
      await api.post("/api/login", { email, password });
      nav("/dashboard"); 
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "beige" }}>
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

        <input
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="Email Address"
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
          {loading ? "Logging in…" : "Log In"}
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          New here?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
