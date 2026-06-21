"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TOKEN_KEY = "eduMartToken";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters."); setLoading(false); return;
    }
    try {
      const res  = await fetch("http://localhost:5000/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      localStorage.setItem(TOKEN_KEY, data.token);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 4) return { label: "Weak", color: "#ef4444", width: "25%" };
    if (p.length < 6) return { label: "Fair", color: "#f59e0b", width: "50%" };
    if (p.length < 10) return { label: "Good", color: "#3b82f6", width: "75%" };
    return { label: "Strong", color: "#10b981", width: "100%" };
  };
  const strength = passwordStrength();

  return (
    <main style={{ minHeight: "100vh", display: "flex" }}>
      {/* ── LEFT PANEL ── */}
      <div style={{ flex: 1, background: "var(--em-gradient-hero)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, position: "relative", overflow: "hidden" }} className="hidden lg:flex">
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(167,139,250,0.2)", top: -100, left: -100, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(79,70,229,0.25)", bottom: -80, right: -80, filter: "blur(50px)" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🚀</div>
          <h1 style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "2.5rem", color: "white", marginBottom: 16, letterSpacing: "-0.03em" }}>
            Join 800+ students<br />on EduMart
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.7, marginBottom: 40 }}>
            Start selling your old notes and past papers today. Turn clutter into cash and help a fellow student.
          </p>
          {/* Testimonial */}
          <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--em-radius-xl)", padding: "24px 28px", textAlign: "left" }}>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>
              "I sold my A/L Physics notes within 2 hours of posting. EduMart is incredible!"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--em-gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontFamily: "var(--em-font-display)" }}>K</div>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", fontFamily: "var(--em-font-display)" }}>Kavindu P.</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>A/L Student, Colombo</div>
              </div>
              <div style={{ marginLeft: "auto", color: "#fbbf24", fontSize: "0.9rem" }}>⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: FORM ── */}
      <div style={{ flex: "0 0 480px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", background: "white", overflowY: "auto" }} className="w-full lg:w-auto">
        <div style={{ marginBottom: 36 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, background: "var(--em-gradient-brand)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "white", fontFamily: "var(--em-font-display)" }}>E</div>
            <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.3rem", background: "var(--em-gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>EduMart</span>
          </Link>
          <h2 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "2rem", color: "var(--em-gray-900)", marginBottom: 6, letterSpacing: "-0.02em" }}>Create your account</h2>
          <p style={{ color: "var(--em-gray-500)", fontSize: "0.95rem" }}>It&apos;s free and takes less than 1 minute ✨</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--em-danger)", padding: "12px 16px", borderRadius: "var(--em-radius-md)", marginBottom: 20, fontSize: "0.875rem", fontWeight: 500, display: "flex", gap: 8, alignItems: "center" }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label className="em-label" htmlFor="reg-name">Full Name</label>
            <input id="reg-name" className="em-input" type="text" name="name" required placeholder="Your full name" onChange={handleChange} />
          </div>
          <div>
            <label className="em-label" htmlFor="reg-email">Email Address</label>
            <input id="reg-email" className="em-input" type="email" name="email" required placeholder="you@university.edu" onChange={handleChange} />
          </div>
          <div>
            <label className="em-label" htmlFor="reg-password">Password</label>
            <div style={{ position: "relative" }}>
              <input id="reg-password" className="em-input" type={showPw ? "text" : "password"} name="password" required placeholder="Minimum 6 characters" onChange={handleChange} style={{ paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--em-gray-400)" }}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
            {/* Password strength bar */}
            {strength && (
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 4, background: "var(--em-gray-100)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 4, transition: "var(--em-transition)" }} />
                </div>
                <p style={{ fontSize: "0.75rem", color: strength.color, marginTop: 4, fontWeight: 600, fontFamily: "var(--em-font-display)" }}>{strength.label} password</p>
              </div>
            )}
          </div>

          <button id="register-submit" type="submit" disabled={loading} className="em-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem", borderRadius: "var(--em-radius-md)", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
            {loading ? "Creating Account..." : "Create Free Account 🚀"}
          </button>

          <p style={{ fontSize: "0.75rem", color: "var(--em-gray-400)", textAlign: "center", lineHeight: 1.5 }}>
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--em-gray-100)" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--em-gray-500)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--em-primary)", fontWeight: 700, fontFamily: "var(--em-font-display)", textDecoration: "none" }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}