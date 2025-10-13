"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "../(lib)/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const res = await callApi("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const token = res?.data?.token;
      if (!token) throw new Error("No token in response");
      localStorage.setItem("adm_token", token);
      setMsg("Login successful. Redirecting…");
      router.push("/admin");
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await callApi("/api/admin/auth/forgot", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
      });
      setMsg(
        "Check your email for reset instructions (if the account exists)."
      );
      setForgotOpen(false);
    } catch (e: any) {
      setErr(e.message || "Request failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        <form onSubmit={onLogin} className="grid gap-3">
          <input
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-amber-700 text-white py-2 text-sm hover:bg-amber-800 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-3 text-right">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => {
              setForgotOpen(true);
              setForgotEmail(email);
            }}
          >
            Forgot password?
          </button>
        </div>

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
        {msg && <div className="mt-3 text-sm text-green-700">{msg}</div>}
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Forgot Password</h2>
              <button
                className="text-2xl leading-none px-2"
                onClick={() => setForgotOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={onForgot} className="grid gap-3">
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="Your admin email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <button className="rounded-lg bg-amber-700 text-white py-2 text-sm hover:bg-amber-800">
                Send reset link
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-500">
              We’ll email a reset link if this account exists.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
