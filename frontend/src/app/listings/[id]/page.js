"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const TOKEN_KEY = "eduMartToken";
const API       = "http://localhost:5000";

const SUBJECT_COLORS = {
  Mathematics: { bg: "#eff6ff", text: "#1d4ed8" },
  Physics:     { bg: "#fdf4ff", text: "#7e22ce" },
  Chemistry:   { bg: "#fff7ed", text: "#c2410c" },
  Biology:     { bg: "#f0fdf4", text: "#15803d" },
  IT:          { bg: "#f0f9ff", text: "#0369a1" },
  General:     { bg: "#f8fafc", text: "#475569" },
};

const CONDITION_COLORS = {
  "New":        { bg: "rgba(16,185,129,0.1)", text: "var(--em-success)" },
  "Like New":   { bg: "rgba(59,130,246,0.1)", text: "#1d4ed8" },
  "Good":       { bg: "rgba(245,158,11,0.1)", text: "#b45309" },
  "Acceptable": { bg: "rgba(239,68,68,0.1)",  text: "var(--em-danger)" },
};

export default function ListingDetails() {
  const { id }   = useParams();
  const router   = useRouter();

  const [listing,        setListing]       = useState(null);
  const [loading,        setLoading]       = useState(true);
  const [error,          setError]         = useState("");
  const [activePhoto,    setActivePhoto]   = useState(0);
  const [messageContent, setMessageContent]= useState("");
  const [isSending,      setIsSending]     = useState(false);
  const [msgStatus,      setMsgStatus]     = useState(null);
  const [msgText,        setMsgText]       = useState("");
  const [showBuyModal,   setShowBuyModal]  = useState(false);
  const [buyNote,        setBuyNote]       = useState("");
  const [isBuying,       setIsBuying]      = useState(false);
  const [buyStatus,      setBuyStatus]     = useState(null);
  const [wishlisted,     setWishlisted]    = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/api/listings/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch listing");
        setListing(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("em_wishlist") || "[]");
      setWishlisted(saved.includes(id));
    } catch {}
  }, [id]);

  const toggleWishlist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("em_wishlist") || "[]");
      const updated = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
      localStorage.setItem("em_wishlist", JSON.stringify(updated));
      setWishlisted(!wishlisted);
    } catch {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true); setMsgStatus(null);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { router.push("/login"); return; }
    try {
      const res = await fetch(`${API}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId: id, content: messageContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send");
      setMsgStatus("success"); setMsgText("Message sent! The seller will reply in your inbox."); setMessageContent("");
    } catch (err) {
      setMsgStatus("error"); setMsgText(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleBuyNow = async () => {
    setIsBuying(true); setBuyStatus(null);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { router.push("/login"); return; }
    try {
      const res = await fetch(`${API}/api/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId: id, message: buyNote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send request");
      setBuyStatus("success"); setMsgText(data.message);
    } catch (err) {
      setBuyStatus("error"); setMsgText(err.message);
    } finally {
      setIsBuying(false);
    }
  };

  if (loading) return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--em-gray-50)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
        <p style={{ fontFamily: "var(--em-font-display)", fontWeight: 600, color: "var(--em-gray-500)" }}>Loading listing...</p>
      </div>
    </main>
  );

  if (error || !listing) return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--em-gray-50)", padding: 24 }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>😕</div>
      <p style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--em-gray-800)", marginBottom: 8 }}>{error || "Listing not found"}</p>
      <Link href="/" className="em-btn-primary" style={{ marginTop: 8 }}>← Back to Marketplace</Link>
    </main>
  );

  const subjectStyle = SUBJECT_COLORS[listing.subject] || SUBJECT_COLORS.General;
  const condStyle    = CONDITION_COLORS[listing.condition] || {};
  const photos       = listing.photos?.length > 0 ? listing.photos : null;

  return (
    <main style={{ minHeight: "100vh", background: "var(--em-gray-50)", padding: "32px 24px 64px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: "0.85rem", color: "var(--em-gray-400)", fontFamily: "var(--em-font-display)", fontWeight: 500 }}>
          <Link href="/" style={{ color: "var(--em-primary)", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <span style={{ background: subjectStyle.bg, color: subjectStyle.text, padding: "2px 8px", borderRadius: "var(--em-radius-full)", fontSize: "0.78rem", fontWeight: 700 }}>{listing.subject}</span>
          <span>›</span>
          <span style={{ color: "var(--em-gray-500)" }}>{listing.title}</span>
        </nav>

        <div className="grid gap-7 sm:grid-cols-2 items-start">

          {/* ── LEFT: Images + Details ── */}
          <div>
            {/* Image Gallery */}
            <div style={{ background: "white", borderRadius: "var(--em-radius-xl)", overflow: "hidden", boxShadow: "var(--em-shadow-md)", border: "1px solid var(--em-gray-100)", marginBottom: 20 }}>
              {/* Main photo */}
              <div style={{ height: 360, background: photos ? "black" : `linear-gradient(135deg, ${subjectStyle.bg}, white)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                {photos ? (
                  <img src={photos[activePhoto]} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 80, marginBottom: 12 }}>📄</div>
                    <p style={{ color: "var(--em-gray-400)", fontSize: "0.875rem" }}>No photos — ask seller for images</p>
                  </div>
                )}
                {/* Status overlay */}
                {listing.status === "SOLD" && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "var(--em-danger)", color: "white", padding: "12px 32px", borderRadius: "var(--em-radius-full)", fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "1.4rem", letterSpacing: "0.1em" }}>SOLD</div>
                  </div>
                )}
                {/* Wishlist button */}
                <button onClick={toggleWishlist} style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, borderRadius: "50%", background: "white", border: "none", fontSize: 20, cursor: "pointer", boxShadow: "var(--em-shadow-md)", display: "flex", alignItems: "center", justifyContent: "center", transition: "var(--em-transition)" }}>
                  {wishlisted ? "❤️" : "🤍"}
                </button>
              </div>
              {/* Thumbnail strip */}
              {photos && photos.length > 1 && (
                <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid var(--em-gray-100)", overflowX: "auto" }}>
                  {photos.map((ph, i) => (
                    <button key={i} onClick={() => setActivePhoto(i)} style={{ width: 64, height: 64, borderRadius: "var(--em-radius-sm)", overflow: "hidden", border: `2px solid ${activePhoto === i ? "var(--em-primary)" : "transparent"}`, flexShrink: 0, cursor: "pointer", padding: 0, background: "none", transition: "var(--em-transition)" }}>
                      <img src={ph} alt={`Photo ${i+1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Card */}
            <div style={{ background: "white", borderRadius: "var(--em-radius-xl)", padding: "32px", boxShadow: "var(--em-shadow-md)", border: "1px solid var(--em-gray-100)" }}>
              {/* Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                <span className="em-badge" style={{ background: subjectStyle.bg, color: subjectStyle.text, fontSize: "0.8rem" }}>{listing.subject}</span>
                <span className="em-badge em-badge-gray" style={{ fontSize: "0.8rem" }}>{listing.category}</span>
                {listing.condition && <span className="em-badge" style={{ background: condStyle.bg, color: condStyle.text, fontSize: "0.8rem" }}>{listing.condition}</span>}
              </div>

              <h1 style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "1.8rem", color: "var(--em-gray-900)", letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.2 }}>
                {listing.title}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                {listing.price === 0 ? (
                  <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "2rem", color: "var(--em-success)" }}>FREE 🎁</span>
                ) : (
                  <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "2rem", color: "var(--em-primary)" }}>Rs. {listing.price.toLocaleString()}</span>
                )}
                {listing.status === "SOLD" && <span className="em-badge em-badge-danger" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>SOLD</span>}
              </div>

              <div style={{ background: "var(--em-gray-50)", borderRadius: "var(--em-radius-md)", padding: "20px 24px", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.9rem", color: "var(--em-gray-700)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</h3>
                <p style={{ color: "var(--em-gray-600)", lineHeight: 1.8, fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>{listing.description}</p>
              </div>

              <div style={{ fontSize: "0.8rem", color: "var(--em-gray-400)", fontFamily: "var(--em-font-display)" }}>
                📅 Listed on {new Date(listing.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Seller + Actions ── */}
          <div className="flex flex-col gap-4 sm:gap-6 sm:max-w-[380px]">
            {/* Price sticky card */}
            <div style={{ background: "white", borderRadius: "var(--em-radius-xl)", padding: "24px", boxShadow: "var(--em-shadow-lg)", border: "1px solid var(--em-gray-100)", position: "sticky", top: 120 }}>

              {/* Price */}
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--em-gray-100)" }}>
                {listing.price === 0 ? (
                  <div style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "1.8rem", color: "var(--em-success)" }}>FREE 🎁</div>
                ) : (
                  <div style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "1.8rem", color: "var(--em-primary)" }}>Rs. {listing.price.toLocaleString()}</div>
                )}
                <p style={{ fontSize: "0.78rem", color: "var(--em-gray-400)", marginTop: 4 }}>Final price — no extra fees</p>
              </div>

              {/* Seller Info */}
              <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.8rem", color: "var(--em-gray-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Seller</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--em-gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "1.2rem", flexShrink: 0 }}>
                  {(listing.seller?.name || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, color: "var(--em-gray-900)" }}>{listing.seller?.name || "Anonymous"}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--em-success)", fontWeight: 600 }}>✅ Verified Student</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {listing.status !== "SOLD" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button id="buy-now-btn" onClick={() => setShowBuyModal(true)} className="em-btn-gold" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem" }}>
                    🛒 Buy Now
                  </button>

                  {/* Message Form */}
                  {msgStatus === "success" ? (
                    <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "var(--em-success)", padding: "12px 16px", borderRadius: "var(--em-radius-md)", fontSize: "0.875rem", fontWeight: 600, textAlign: "center" }}>
                      ✅ {msgText}
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage}>
                      {msgStatus === "error" && (
                        <div style={{ background: "rgba(239,68,68,0.06)", color: "var(--em-danger)", padding: "10px 14px", borderRadius: "var(--em-radius-md)", fontSize: "0.8rem", marginBottom: 8, fontWeight: 500 }}>⚠️ {msgText}</div>
                      )}
                      <textarea required rows={3} placeholder='Ask a question: "Hi, is this still available?"' value={messageContent} onChange={(e) => setMessageContent(e.target.value)} className="em-input" style={{ resize: "none", fontSize: "0.875rem", marginBottom: 8 }} />
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                        <span style={{ fontSize: "0.72rem", color: messageContent.length > 500 ? "var(--em-danger)" : "var(--em-gray-400)" }}>{messageContent.length}/500</span>
                      </div>
                      <button type="submit" disabled={isSending} className="em-btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "11px", fontSize: "0.9rem", opacity: isSending ? 0.7 : 1 }}>
                        {isSending ? "Sending..." : "💬 Send Message"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {listing.status === "SOLD" && (
                <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "var(--em-radius-md)", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, color: "var(--em-danger)", marginBottom: 8 }}>This item has been sold</p>
                  <Link href="/" className="em-btn-ghost" style={{ fontSize: "0.85rem" }}>Browse similar items</Link>
                </div>
              )}

              {/* Trust badges */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--em-gray-100)", display: "flex", flexDirection: "column", gap: 8 }}>
                {["🔒 Safe peer-to-peer exchange", "✉️ Message directly, no fees", "⭐ Verified student sellers"].map(t => (
                  <p key={t} style={{ fontSize: "0.78rem", color: "var(--em-gray-500)", display: "flex", alignItems: "center", gap: 6 }}>{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BUY NOW MODAL ── */}
      {showBuyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={(e) => { if (e.target === e.currentTarget) setShowBuyModal(false); }}>
          <div className="em-animate-scaleIn" style={{ background: "white", borderRadius: "var(--em-radius-xl)", padding: 36, maxWidth: 480, width: "100%", boxShadow: "var(--em-shadow-xl)" }}>
            {buyStatus === "success" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--em-gray-900)", marginBottom: 8 }}>Request Sent!</h2>
                <p style={{ color: "var(--em-gray-500)", marginBottom: 24, lineHeight: 1.6 }}>{msgText}</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <Link href="/inbox" className="em-btn-primary">Go to Inbox</Link>
                  <button onClick={() => setShowBuyModal(false)} className="em-btn-ghost">Close</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--em-gray-900)" }}>🛒 Confirm Buy Now</h2>
                  <button onClick={() => setShowBuyModal(false)} style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--em-gray-100)", border: "none", cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
                <div style={{ background: "var(--em-gray-50)", borderRadius: "var(--em-radius-md)", padding: "16px", marginBottom: 20 }}>
                  <p style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, color: "var(--em-gray-800)", marginBottom: 4 }}>{listing.title}</p>
                  <p style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "1.3rem", color: "var(--em-primary)" }}>Rs. {listing.price.toLocaleString()}</p>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="em-label" htmlFor="buy-note">Add a note to seller (optional)</label>
                  <textarea id="buy-note" className="em-input" rows={3} placeholder="e.g., Can we meet at the university library? I'm available on weekdays." value={buyNote} onChange={(e) => setBuyNote(e.target.value)} style={{ resize: "none" }} />
                </div>
                {buyStatus === "error" && (
                  <div style={{ background: "rgba(239,68,68,0.06)", color: "var(--em-danger)", padding: "10px 14px", borderRadius: "var(--em-radius-md)", fontSize: "0.875rem", marginBottom: 14, fontWeight: 500 }}>⚠️ {msgText}</div>
                )}
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={handleBuyNow} disabled={isBuying} className="em-btn-gold" style={{ flex: 1, justifyContent: "center", padding: "13px", opacity: isBuying ? 0.7 : 1, cursor: isBuying ? "not-allowed" : "pointer" }}>
                    {isBuying ? "Sending..." : "Confirm Purchase Request 🛒"}
                  </button>
                  <button onClick={() => setShowBuyModal(false)} className="em-btn-ghost" style={{ padding: "13px 20px" }}>Cancel</button>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--em-gray-400)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                  This sends a purchase request to the seller. Payment and exchange happen directly between you.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}