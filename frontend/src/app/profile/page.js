"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TOKEN_KEY = "eduMartToken";
const API       = "http://localhost:5000";

const TABS = ["Active Listings", "Sold", "Purchase Requests"];

export default function Profile() {
  const router = useRouter();

  const [myListings,  setMyListings]  = useState([]);
  const [myRequests,  setMyRequests]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [activeTab,   setActiveTab]   = useState(0);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { router.push("/login"); return; }

    const fetchAll = async () => {
      try {
        const [listRes, reqRes] = await Promise.all([
          fetch(`${API}/api/listings/my-listings`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/purchases/my-requests`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const [listData, reqData] = await Promise.all([listRes.json(), reqRes.json()]);

        if (!listRes.ok) throw new Error(listData.message);
        setMyListings(listData.data || []);
        if (reqRes.ok) setMyRequests(reqData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [router]);

  const handleDelete = async (listingId) => {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch(`${API}/api/listings/${listingId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMyListings(prev => prev.filter(item => item.id !== listingId));
    } catch (err) {
      alert(err.message);
    }
  };

  const activeListings = myListings.filter(i => i.status !== "SOLD");
  const soldListings   = myListings.filter(i => i.status === "SOLD");

  const stats = [
    { label: "Active",   value: activeListings.length, icon: "📦", color: "var(--em-primary)" },
    { label: "Sold",     value: soldListings.length,   icon: "✅", color: "var(--em-success)" },
    { label: "Requests", value: myRequests.length,     icon: "🛒", color: "var(--em-accent)" },
    { label: "Total",    value: myListings.length,     icon: "📊", color: "var(--em-gray-600)" },
  ];

  const renderListingCard = (item) => (
    <div key={item.id} className="em-card" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="em-badge em-badge-primary" style={{ fontSize: "0.75rem" }}>{item.subject}</span>
          <span className="em-badge em-badge-gray" style={{ fontSize: "0.75rem" }}>{item.category}</span>
          {item.status === "SOLD" && <span className="em-badge em-badge-success" style={{ fontSize: "0.75rem" }}>SOLD</span>}
        </div>
        <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.1rem", color: item.price === 0 ? "var(--em-success)" : "var(--em-primary)", flexShrink: 0, marginLeft: 12 }}>
          {item.price === 0 ? "FREE" : `Rs. ${item.price.toLocaleString()}`}
        </span>
      </div>
      <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--em-gray-900)", marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</h3>
      <p style={{ fontSize: "0.78rem", color: "var(--em-gray-400)", marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
      <div style={{ display: "flex", gap: 10, paddingTop: 14, borderTop: "1px solid var(--em-gray-100)" }}>
        <Link href={`/listings/${item.id}`} className="em-btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "8px", fontSize: "0.8rem" }}>View Post</Link>
        {item.status !== "SOLD" && (
          <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: "8px", background: "rgba(239,68,68,0.07)", color: "var(--em-danger)", border: "none", borderRadius: "var(--em-radius-full)", fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "var(--em-transition)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.07)"}
          >Delete</button>
        )}
      </div>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--em-gray-50)", paddingBottom: 64 }}>

      {/* Header Banner */}
      <div style={{ background: "var(--em-gradient-hero)", padding: "48px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(139,92,246,0.2)", top: -80, right: 80, filter: "blur(50px)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", textDecoration: "none", fontFamily: "var(--em-font-display)", fontWeight: 600, fontSize: "0.875rem", marginBottom: 28 }}
            onMouseEnter={(e) => e.currentTarget.style.color = "white"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
          >← Back to Marketplace</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
              👤
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "1.8rem", color: "white", letterSpacing: "-0.02em", marginBottom: 4 }}>My Profile</h1>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>Manage your listings and track your activity</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Link href="/create-listing" className="em-btn-gold" style={{ padding: "11px 24px" }}>+ Post New Item</Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "-40px auto 0", padding: "0 24px" }}>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: "var(--em-radius-lg)", padding: "20px 16px", textAlign: "center", boxShadow: "var(--em-shadow-lg)", border: "1px solid var(--em-gray-100)" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "1.8rem", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--em-gray-500)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "var(--em-gray-100)", borderRadius: "var(--em-radius-lg)", padding: 4, marginBottom: 24 }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} style={{ flex: 1, padding: "10px 16px", borderRadius: "var(--em-radius-md)", border: "none", cursor: "pointer", fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.875rem", transition: "var(--em-transition)", background: activeTab === i ? "white" : "transparent", color: activeTab === i ? "var(--em-primary)" : "var(--em-gray-500)", boxShadow: activeTab === i ? "var(--em-shadow-sm)" : "none" }}>
              {tab}
              <span style={{ marginLeft: 6, background: activeTab === i ? "rgba(79,70,229,0.1)" : "var(--em-gray-200)", color: activeTab === i ? "var(--em-primary)" : "var(--em-gray-500)", borderRadius: "var(--em-radius-full)", padding: "2px 7px", fontSize: "0.7rem", fontWeight: 800 }}>
                {i === 0 ? activeListings.length : i === 1 ? soldListings.length : myRequests.length}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: "white", borderRadius: "var(--em-radius-lg)", padding: 20 }}>
                <div className="em-skeleton" style={{ height: 16, width: "70%", marginBottom: 10 }} />
                <div className="em-skeleton" style={{ height: 24, width: "85%", marginBottom: 8 }} />
                <div className="em-skeleton" style={{ height: 32, marginTop: 16 }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "48px", background: "rgba(239,68,68,0.05)", borderRadius: "var(--em-radius-xl)", border: "1px solid rgba(239,68,68,0.1)" }}>
            <p style={{ color: "var(--em-danger)", fontWeight: 600, fontFamily: "var(--em-font-display)" }}>{error}</p>
          </div>
        ) : (
          <>
            {/* Tab 0: Active */}
            {activeTab === 0 && (
              activeListings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "72px 24px", background: "white", borderRadius: "var(--em-radius-xl)", boxShadow: "var(--em-shadow-sm)", border: "1px solid var(--em-gray-100)" }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
                  <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.2rem", color: "var(--em-gray-800)", marginBottom: 8 }}>No active listings yet</h3>
                  <p style={{ color: "var(--em-gray-500)", marginBottom: 24 }}>Post your first item and start earning!</p>
                  <Link href="/create-listing" className="em-btn-primary">Post Your First Item</Link>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                  {activeListings.map(renderListingCard)}
                </div>
              )
            )}

            {/* Tab 1: Sold */}
            {activeTab === 1 && (
              soldListings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "64px 24px", background: "white", borderRadius: "var(--em-radius-xl)", boxShadow: "var(--em-shadow-sm)", border: "1px solid var(--em-gray-100)" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--em-gray-800)", marginBottom: 6 }}>No sold items yet</h3>
                  <p style={{ color: "var(--em-gray-500)" }}>When you sell an item, it'll appear here.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                  {soldListings.map(renderListingCard)}
                </div>
              )
            )}

            {/* Tab 2: Purchase Requests */}
            {activeTab === 2 && (
              myRequests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "64px 24px", background: "white", borderRadius: "var(--em-radius-xl)", boxShadow: "var(--em-shadow-sm)", border: "1px solid var(--em-gray-100)" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--em-gray-800)", marginBottom: 6 }}>No purchase requests yet</h3>
                  <p style={{ color: "var(--em-gray-500)" }}>When you click "Buy Now" on a listing, your requests appear here.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myRequests.map((req) => (
                    <div key={req.id} style={{ background: "white", borderRadius: "var(--em-radius-lg)", padding: 20, border: "1px solid var(--em-gray-100)", boxShadow: "var(--em-shadow-sm)", display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ width: 52, height: 52, borderRadius: "var(--em-radius-md)", background: "rgba(79,70,229,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>📦</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, color: "var(--em-gray-900)", marginBottom: 4 }}>{req.listing?.title || "Deleted listing"}</h4>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, color: "var(--em-primary)", fontSize: "0.95rem" }}>
                            Rs. {req.listing?.price?.toLocaleString()}
                          </span>
                          <span className="em-badge" style={{ background: req.status === "PENDING" ? "rgba(245,158,11,0.1)" : req.status === "ACCEPTED" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: req.status === "PENDING" ? "var(--em-accent)" : req.status === "ACCEPTED" ? "var(--em-success)" : "var(--em-danger)", fontSize: "0.72rem" }}>
                            {req.status}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--em-gray-400)" }}>
                            Seller: {req.listing?.seller?.name || "—"}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--em-gray-400)", marginTop: 4 }}>
                          Requested on {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      {req.listing?.id && (
                        <Link href={`/listings/${req.listing.id}`} className="em-btn-ghost" style={{ fontSize: "0.8rem", flexShrink: 0 }}>View →</Link>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </main>
  );
}