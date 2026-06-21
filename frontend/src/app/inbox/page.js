"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TOKEN_KEY = "eduMartToken";
const API       = "http://localhost:5000";

export default function Inbox() {
  const router = useRouter();

  const [messages,    setMessages]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [replyMap,    setReplyMap]    = useState({});
  const [sendingId,   setSendingId]   = useState(null);
  const [sentIds,     setSentIds]     = useState([]);
  const [filterUnread, setFilterUnread] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { router.push("/login"); return; }

    (async () => {
      try {
        const res  = await fetch(`${API}/api/messages/inbox`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setMessages(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleReply = async (msg) => {
    const content = replyMap[msg.id] || "";
    if (!content.trim()) return;

    setSendingId(msg.id);
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch(`${API}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId: msg.listing?.id || msg.listingId, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSentIds(prev => [...prev, msg.id]);
      setReplyMap(prev => ({ ...prev, [msg.id]: "" }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSendingId(null);
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;
  const displayed   = filterUnread ? messages.filter(m => !m.isRead) : messages;

  return (
    <main style={{ minHeight: "100vh", background: "var(--em-gray-50)", paddingBottom: 64 }}>

      {/* Header */}
      <div style={{ background: "var(--em-gradient-hero)", padding: "48px 24px 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "rgba(99,102,241,0.2)", top: -60, right: 60, filter: "blur(40px)" }} />
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", textDecoration: "none", fontFamily: "var(--em-font-display)", fontWeight: 600, fontSize: "0.875rem", marginBottom: 24 }}>← Back to Marketplace</Link>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h1 style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "2rem", color: "white", letterSpacing: "-0.02em" }}>My Inbox</h1>
                {unreadCount > 0 && (
                  <span style={{ background: "var(--em-danger)", color: "white", borderRadius: "var(--em-radius-full)", padding: "4px 12px", fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "0.85rem" }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 4 }}>Messages from students about your listings</p>
            </div>
            <button
              onClick={() => setFilterUnread(!filterUnread)}
              style={{ padding: "9px 18px", background: filterUnread ? "white" : "rgba(255,255,255,0.12)", color: filterUnread ? "var(--em-primary)" : "white", border: filterUnread ? "none" : "1px solid rgba(255,255,255,0.3)", borderRadius: "var(--em-radius-full)", fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", transition: "var(--em-transition)" }}
            >
              {filterUnread ? "Show All" : "Unread Only"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "-28px auto 0", padding: "0 24px" }}>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: "white", borderRadius: "var(--em-radius-lg)", padding: 24, boxShadow: "var(--em-shadow-md)" }}>
                <div className="em-skeleton" style={{ height: 20, width: "40%", marginBottom: 12 }} />
                <div className="em-skeleton" style={{ height: 16, width: "70%", marginBottom: 8 }} />
                <div className="em-skeleton" style={{ height: 60 }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: 48, background: "white", borderRadius: "var(--em-radius-xl)", boxShadow: "var(--em-shadow-md)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <p style={{ color: "var(--em-danger)", fontWeight: 600, fontFamily: "var(--em-font-display)" }}>{error}</p>
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "72px 24px", background: "white", borderRadius: "var(--em-radius-xl)", boxShadow: "var(--em-shadow-md)", border: "1px solid var(--em-gray-100)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
            <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--em-gray-800)", marginBottom: 8 }}>
              {filterUnread ? "No unread messages" : "Your inbox is empty"}
            </h3>
            <p style={{ color: "var(--em-gray-500)", marginBottom: 24 }}>
              {filterUnread ? "All caught up! 🎉" : "Post a listing and messages from interested buyers will appear here."}
            </p>
            <Link href="/create-listing" className="em-btn-primary">Post a Listing</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {displayed.map((msg) => (
              <div key={msg.id} className="em-card" style={{ padding: 24, borderLeft: !msg.isRead ? "4px solid var(--em-primary)" : "4px solid transparent" }}>
                {/* Message Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--em-gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0 }}>
                        {(msg.sender?.name || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, color: "var(--em-gray-900)", fontSize: "0.95rem" }}>{msg.sender?.name || "Unknown Student"}</p>
                        <p style={{ fontSize: "0.78rem", color: "var(--em-primary)", fontWeight: 600 }}>re: {msg.listing?.title || "Deleted item"}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {!msg.isRead && <span className="em-badge em-badge-primary" style={{ fontSize: "0.7rem" }}>New</span>}
                    <span style={{ fontSize: "0.75rem", color: "var(--em-gray-400)", background: "var(--em-gray-100)", padding: "4px 10px", borderRadius: "var(--em-radius-full)", fontFamily: "var(--em-font-display)", fontWeight: 500 }}>
                      {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Message content */}
                <div style={{ background: "var(--em-gray-50)", border: "1px solid var(--em-gray-100)", borderRadius: "var(--em-radius-md)", padding: "16px 20px", marginBottom: 16, color: "var(--em-gray-700)", lineHeight: 1.7, fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </div>

                {/* Actions */}
                {sentIds.includes(msg.id) ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--em-success)", fontFamily: "var(--em-font-display)", fontWeight: 600, fontSize: "0.875rem" }}>
                    ✅ Reply sent!
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <textarea
                        rows={2}
                        placeholder='Reply to this message...'
                        value={replyMap[msg.id] || ""}
                        onChange={(e) => setReplyMap(prev => ({ ...prev, [msg.id]: e.target.value }))}
                        className="em-input"
                        style={{ resize: "none", fontSize: "0.875rem" }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => handleReply(msg)} disabled={sendingId === msg.id || !replyMap[msg.id]?.trim()} className="em-btn-primary" style={{ padding: "10px 18px", fontSize: "0.85rem", opacity: (!replyMap[msg.id]?.trim() || sendingId === msg.id) ? 0.5 : 1, cursor: (!replyMap[msg.id]?.trim() || sendingId === msg.id) ? "not-allowed" : "pointer" }}>
                        {sendingId === msg.id ? "..." : "Reply ↑"}
                      </button>
                      {msg.sender?.email && (
                        <a href={`mailto:${msg.sender.email}`} style={{ padding: "8px 18px", background: "var(--em-gray-100)", color: "var(--em-gray-600)", border: "none", borderRadius: "var(--em-radius-full)", fontFamily: "var(--em-font-display)", fontWeight: 600, fontSize: "0.78rem", textDecoration: "none", textAlign: "center", transition: "var(--em-transition)" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "var(--em-gray-200)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "var(--em-gray-100)"}
                        >
                          📧 Email
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}