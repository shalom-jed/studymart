"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TOKEN_KEY = "eduMartToken";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("http://localhost:5000/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem(TOKEN_KEY, data.token);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex" }}>
      {/* ── LEFT PANEL ── */}
      <div style={{ flex: 1, background: "var(--em-gradient-hero)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, position: "relative", overflow: "hidden" }} className="hidden lg:flex">
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(139,92,246,0.2)", top: -80, right: -80, filter: "blur(50px)" }} />
        <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "rgba(79,70,229,0.25)", bottom: -60, left: -60, filter: "blur(40px)" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎓</div>
          <h1 style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "2.5rem", color: "white", marginBottom: 16, letterSpacing: "-0.03em" }}>
            Welcome back to<br />EduMart
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.7, marginBottom: 40 }}>
            The marketplace where students help students. Buy and sell study materials with ease.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "✅", text: "2,400+ study materials available" },
              { icon: "🔒", text: "Safe, verified student community" },
              { icon: "💸", text: "Free to list, no hidden fees" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.08)", borderRadius: "var(--em-radius-md)", padding: "12px 16px" }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", fontFamily: "var(--em-font-display)", fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: FORM ── */}
      <div style={{ flex: "0 0 480px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", background: "white", overflowY: "auto" }} className="w-full lg:w-auto">
        {/* Mobile logo */}
        <div style={{ marginBottom: 40 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, background: "var(--em-gradient-brand)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "white", fontFamily: "var(--em-font-display)" }}>E</div>
            <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.3rem", background: "var(--em-gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>EduMart</span>
          </Link>
          <h2 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "2rem", color: "var(--em-gray-900)", marginBottom: 6, letterSpacing: "-0.02em" }}>Sign in</h2>
          <p style={{ color: "var(--em-gray-500)", fontSize: "0.95rem" }}>Good to see you again 👋</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--em-danger)", padding: "12px 16px", borderRadius: "var(--em-radius-md)", marginBottom: 20, fontSize: "0.875rem", fontWeight: 500, display: "flex", gap: 8, alignItems: "center" }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label className="em-label" htmlFor="login-email">Email Address</label>
            <input id="login-email" className="em-input" type="email" name="email" required placeholder="you@university.edu" onChange={handleChange} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label className="em-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
              <button type="button" style={{ fontSize: "0.8rem", color: "var(--em-primary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--em-font-display)", fontWeight: 600 }}>Forgot password?</button>
            </div>
            <div style={{ position: "relative" }}>
              <input id="login-password" className="em-input" type={showPw ? "text" : "password"} name="password" required placeholder="Enter your password" onChange={handleChange} style={{ paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--em-gray-400)" }}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button id="login-submit" type="submit" disabled={loading} className="em-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem", borderRadius: "var(--em-radius-md)", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--em-gray-100)" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--em-gray-500)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "var(--em-primary)", fontWeight: 700, fontFamily: "var(--em-font-display)", textDecoration: "none" }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}