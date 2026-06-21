"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SUBJECT_COLORS = {
  Mathematics: { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  Physics:     { bg: "#fdf4ff", text: "#7e22ce", dot: "#a855f7" },
  Chemistry:   { bg: "#fff7ed", text: "#c2410c", dot: "#f97316" },
  Biology:     { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
  IT:          { bg: "#f0f9ff", text: "#0369a1", dot: "#0ea5e9" },
  General:     { bg: "#f8fafc", text: "#475569", dot: "#94a3b8" },
};

const CATEGORY_ICONS = {
  "Past Papers":     "📝",
  "Notes":           "📒",
  "Resource Books":  "📚",
};

const SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","IT","General"];
const CATEGORIES = ["Notes","Past Papers","Resource Books"];

const STATS = [
  { value: "2,400+", label: "Study Materials",  icon: "📚" },
  { value: "800+",   label: "Verified Students", icon: "🎓" },
  { value: "50+",    label: "Subjects Covered",  icon: "🔬" },
  { value: "4.9★",   label: "Avg. Rating",       icon: "⭐" },
];

const CATEGORY_CARDS = [
  { title: "Past Papers",    icon: "📝", desc: "Exam papers from previous years",     href: "/?category=Past Papers",    color: "#4f46e5", bg: "rgba(79,70,229,0.06)" },
  { title: "Study Notes",    icon: "📒", desc: "Handwritten & typed notes",           href: "/?category=Notes",           color: "#7c3aed", bg: "rgba(124,58,237,0.06)" },
  { title: "Resource Books", icon: "📚", desc: "Textbooks & reference materials",     href: "/?category=Resource Books",  color: "#0891b2", bg: "rgba(8,145,178,0.06)" },
  { title: "Mathematics",    icon: "📐", desc: "Algebra, calculus & more",            href: "/?subject=Mathematics",      color: "#1d4ed8", bg: "rgba(29,78,216,0.06)" },
  { title: "Science",        icon: "🔬", desc: "Physics, Chemistry & Biology",        href: "/?subject=Physics",          color: "#15803d", bg: "rgba(21,128,61,0.06)" },
  { title: "Free Items",     icon: "🎁", desc: "Donations from generous students",    href: "/?maxPrice=0",               color: "#b45309", bg: "rgba(180,83,9,0.06)" },
];

function SkeletonCard() {
  return (
    <div style={{ background: "white", borderRadius: "var(--em-radius-lg)", padding: 20, border: "1px solid var(--em-gray-100)" }}>
      <div className="em-skeleton" style={{ height: 20, width: "60%", marginBottom: 12 }} />
      <div className="em-skeleton" style={{ height: 28, width: "80%", marginBottom: 8 }} />
      <div className="em-skeleton" style={{ height: 16, width: "100%", marginBottom: 6 }} />
      <div className="em-skeleton" style={{ height: 16, width: "70%", marginBottom: 16 }} />
      <div className="em-skeleton" style={{ height: 36, width: "100%", borderRadius: 8 }} />
    </div>
  );
}

function ListingCard({ item, index }) {
  const subjectColors = SUBJECT_COLORS[item.subject] || SUBJECT_COLORS.General;
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("em_wishlist") || "[]");
      setWishlisted(saved.includes(item.id));
    } catch {}
  }, [item.id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    try {
      const saved = JSON.parse(localStorage.getItem("em_wishlist") || "[]");
      const updated = saved.includes(item.id) ? saved.filter(id => id !== item.id) : [...saved, item.id];
      localStorage.setItem("em_wishlist", JSON.stringify(updated));
      setWishlisted(!wishlisted);
    } catch {}
  };

  const hasPhoto = item.photos && item.photos.length > 0;

  return (
    <div className="em-card em-animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "both", opacity: 0, display: "flex", flexDirection: "column" }}>
      {/* Card image area */}
      <div style={{ height: 160, position: "relative", overflow: "hidden", borderRadius: "var(--em-radius-lg) var(--em-radius-lg) 0 0", background: `linear-gradient(135deg, ${subjectColors.bg} 0%, white 100%)` }}>
        {hasPhoto ? (
          <img
            src={item.photos[0]}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
            <span>{CATEGORY_ICONS[item.category] || "📄"}</span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "var(--em-shadow-md)", transition: "var(--em-transition)", fontSize: 15, backdropFilter: "blur(4px)" }}
          title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>

        {/* Photo count badge */}
        {hasPhoto && item.photos.length > 1 && (
          <div style={{ position: "absolute", bottom: 8, left: 10, background: "rgba(0,0,0,0.55)", color: "white", borderRadius: "var(--em-radius-full)", padding: "3px 8px", fontSize: "0.7rem", fontFamily: "var(--em-font-display)", fontWeight: 700, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 4 }}>
            📷 {item.photos.length}
          </div>
        )}

        {/* SOLD overlay */}
        {item.status === "SOLD" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 800, fontFamily: "var(--em-font-display)", fontSize: "1.1rem", letterSpacing: "0.08em", background: "var(--em-danger)", padding: "6px 18px", borderRadius: "var(--em-radius-full)" }}>SOLD</span>
          </div>
        )}
      </div>


      <div style={{ padding: "16px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          <span className="em-badge" style={{ background: subjectColors.bg, color: subjectColors.text }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: subjectColors.dot, display: "inline-block" }} />
            {item.subject || "General"}
          </span>
          {item.category && (
            <span className="em-badge em-badge-gray">{item.category}</span>
          )}
          {item.condition && (
            <span className="em-badge em-badge-success" style={{ fontSize: "0.7rem" }}>{item.condition}</span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--em-gray-900)", marginBottom: 6, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.title}
        </h3>

        {/* Price */}
        <div style={{ marginBottom: 8 }}>
          {item.price === 0 ? (
            <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.15rem", color: "var(--em-success)" }}>FREE 🎁</span>
          ) : (
            <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.15rem", color: "var(--em-primary)" }}>Rs. {item.price.toLocaleString()}</span>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize: "0.82rem", color: "var(--em-gray-500)", lineHeight: 1.5, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
          {item.description}
        </p>

        {/* Footer */}
        <div style={{ borderTop: "1px solid var(--em-gray-100)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--em-gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 800 }}>
              {(item.seller?.name || "?")[0].toUpperCase()}
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--em-gray-500)", fontWeight: 500 }}>{item.seller?.name || "Anonymous"}</span>
          </div>
          <Link href={`/listings/${item.id}`}
            style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.8rem", color: "var(--em-primary)", background: "rgba(79,70,229,0.08)", padding: "6px 14px", borderRadius: "var(--em-radius-full)", textDecoration: "none", transition: "var(--em-transition)", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--em-primary)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(79,70,229,0.08)"; e.currentTarget.style.color = "var(--em-primary)"; }}
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();

  const [listings,       setListings]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [searchTerm,     setSearchTerm]     = useState(searchParams.get("search")  || "");
  const [subjectFilter,  setSubjectFilter]  = useState(searchParams.get("subject") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category")|| "");
  const [sortBy,         setSortBy]         = useState("newest");
  const [inputValue,     setInputValue]     = useState(searchParams.get("search")  || "");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams();
      if (searchTerm)     q.append("search",   searchTerm);
      if (subjectFilter)  q.append("subject",  subjectFilter);
      if (categoryFilter) q.append("category", categoryFilter);

      const res  = await fetch(`http://localhost:5000/api/listings?${q}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch listings");

      let items = data.data || [];
      if (sortBy === "price-asc")  items = [...items].sort((a,b) => a.price - b.price);
      if (sortBy === "price-desc") items = [...items].sort((a,b) => b.price - a.price);

      setListings(items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, subjectFilter, categoryFilter, sortBy]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  // Sync URL params on mount
  useEffect(() => {
    const cat = searchParams.get("category");
    const sub = searchParams.get("subject");
    const q   = searchParams.get("search");
    if (cat) setCategoryFilter(cat);
    if (sub) setSubjectFilter(sub);
    if (q)   setSearchTerm(q);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(inputValue);
  };

  const clearFilters = () => {
    setSearchTerm(""); setSubjectFilter(""); setCategoryFilter(""); setInputValue(""); setSortBy("newest");
  };

  const activeFilters = searchTerm || subjectFilter || categoryFilter;

  return (
    <main style={{ minHeight: "100vh", background: "var(--em-gray-50)" }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{ background: "var(--em-gradient-hero)", padding: "72px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(139,92,246,0.15)", top: -100, right: -100, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(79,70,229,0.2)", bottom: -80, left: -80, filter: "blur(50px)" }} />

        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <div className="em-animate-fadeInUp" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "var(--em-radius-full)", padding: "6px 16px", marginBottom: 24 }}>
            <span>🎓</span>
            <span style={{ fontFamily: "var(--em-font-display)", fontSize: "0.85rem", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Sri Lanka's #1 Student Marketplace</span>
          </div>

          <h1 className="em-animate-fadeInUp em-delay-1" style={{ fontFamily: "var(--em-font-display)", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, color: "white", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20, opacity: 0 }}>
            Find the Study Materials<br />
            <span style={{ background: "linear-gradient(90deg, #a5b4fc, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>You Actually Need</span>
          </h1>

          <p className="em-animate-fadeInUp em-delay-2" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", marginBottom: 36, lineHeight: 1.6, maxWidth: 560, margin: "0 auto 36px", opacity: 0 }}>
            Past papers, notes, and resource books from verified students — at prices that make sense.
          </p>

          {/* Hero Search */}
          <form onSubmit={handleSearch} className="em-animate-fadeInUp em-delay-3" style={{ display: "flex", gap: 0, maxWidth: 560, margin: "0 auto 24px", opacity: 0 }}>
            <div style={{ flex: 1, display: "flex", background: "white", borderRadius: "var(--em-radius-full) 0 0 var(--em-radius-full)", overflow: "hidden", boxShadow: "var(--em-shadow-xl)" }}>
              <span style={{ padding: "14px 16px 14px 20px", fontSize: "1.1rem" }}>🔍</span>
              <input
                id="hero-search"
                type="text"
                placeholder="e.g., Physics past papers 2023..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", fontFamily: "var(--em-font-body)", fontSize: "0.95rem", color: "var(--em-gray-900)", padding: "14px 0" }}
              />
            </div>
            <button type="submit" className="em-btn-primary" style={{ borderRadius: "0 var(--em-radius-full) var(--em-radius-full) 0", padding: "14px 28px", fontSize: "0.95rem", boxShadow: "none" }}>
              Search
            </button>
          </form>

          <div className="em-animate-fadeInUp em-delay-4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", opacity: 0 }}>
            <Link href="/create-listing" className="em-btn-gold" style={{ padding: "11px 24px" }}>📤 Sell Your Materials</Link>
            <Link href="/register" className="em-btn-secondary" style={{ borderColor: "rgba(255,255,255,0.4)", color: "white", background: "rgba(255,255,255,0.1)", padding: "11px 24px" }}>Join Free →</Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section style={{ background: "white", borderBottom: "1px solid var(--em-gray-100)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ padding: "20px 16px", textAlign: "center", borderRight: "1px solid var(--em-gray-100)" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.4rem", color: "var(--em-primary)" }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--em-gray-500)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY CARDS ───────────────────────────────── */}
      <section style={{ padding: "56px 24px 0", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 className="em-section-title">Browse by Category</h2>
          <p className="em-section-subtitle">Find exactly what you need for your exams</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {CATEGORY_CARDS.map((cat, i) => (
            <Link key={cat.title} href={cat.href}
              className="em-animate-fadeInUp"
              style={{
                animationDelay: `${i * 0.07}s`, animationFillMode: "both", opacity: 0,
                display: "block", padding: "24px 20px", borderRadius: "var(--em-radius-lg)",
                background: cat.bg, border: `1px solid ${cat.color}20`,
                textDecoration: "none", transition: "var(--em-transition-slow)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${cat.color}20`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{cat.icon}</div>
              <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.95rem", color: cat.color, marginBottom: 4 }}>{cat.title}</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--em-gray-500)", lineHeight: 1.4 }}>{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LISTINGS SECTION ─────────────────────────────── */}
      <section style={{ padding: "48px 24px 64px", maxWidth: 1280, margin: "0 auto" }}>

        {/* Filter Bar */}
        <div style={{ background: "white", borderRadius: "var(--em-radius-lg)", padding: "16px 20px", boxShadow: "var(--em-shadow-sm)", border: "1px solid var(--em-gray-100)", marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <select id="filter-subject" className="em-select" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} style={{ flex: "1 1 160px", maxWidth: 200 }}>
            <option value="">All Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select id="filter-category" className="em-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ flex: "1 1 160px", maxWidth: 200 }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select id="filter-sort" className="em-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ flex: "1 1 140px", maxWidth: 180 }}>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
          <button id="filter-apply" onClick={fetchListings} className="em-btn-primary" style={{ padding: "11px 22px", whiteSpace: "nowrap" }}>Apply Filters</button>
          {activeFilters && (
            <button onClick={clearFilters} className="em-btn-ghost" style={{ whiteSpace: "nowrap" }}>✕ Clear All</button>
          )}
        </div>

        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 className="em-section-title" style={{ fontSize: "1.5rem" }}>
              {activeFilters ? "Search Results" : "Latest Materials"}
              {!loading && <span style={{ fontWeight: 400, fontSize: "1rem", color: "var(--em-gray-400)", marginLeft: 10 }}>({listings.length})</span>}
            </h2>
          </div>
          <Link href="/create-listing" className="em-btn-secondary" style={{ padding: "9px 18px", fontSize: "0.85rem", whiteSpace: "nowrap" }}>+ Post Item</Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(239,68,68,0.05)", borderRadius: "var(--em-radius-lg)", border: "1px solid rgba(239,68,68,0.1)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <p style={{ color: "var(--em-danger)", fontWeight: 600, fontFamily: "var(--em-font-display)" }}>{error}</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "72px 24px", background: "white", borderRadius: "var(--em-radius-xl)", boxShadow: "var(--em-shadow-sm)", border: "1px solid var(--em-gray-100)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--em-gray-800)", marginBottom: 8 }}>No materials found</h3>
            <p style={{ color: "var(--em-gray-500)", marginBottom: 24 }}>Try adjusting your filters or be the first to post one!</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={clearFilters} className="em-btn-ghost">Clear Filters</button>
              <Link href="/create-listing" className="em-btn-primary">Post a Listing</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {listings.map((item, i) => <ListingCard key={item.id} item={item} index={i} />)}
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{ background: "var(--em-gradient-hero)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "2rem", color: "white", marginBottom: 8 }}>How EduMart Works</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 48, fontSize: "1rem" }}>Simple, safe, and student-first</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { step: "01", icon: "📝", title: "Post Your Material", desc: "List your notes, past papers or books in under 2 minutes with photos." },
              { step: "02", icon: "💬", title: "Connect Instantly", desc: "Buyers message you directly. No middlemen, no fees." },
              { step: "03", icon: "🤝", title: "Exchange & Earn", desc: "Meet on campus or arrange delivery. Get paid and help a fellow student." },
            ].map((step) => (
              <div key={step.step} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "var(--em-radius-xl)", padding: "32px 24px" }}>
                <div style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "0.8rem", color: "var(--em-primary-light)", letterSpacing: "0.1em", marginBottom: 12 }}>STEP {step.step}</div>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{step.icon}</div>
                <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "1.1rem", color: "white", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ────────────────────────────────── */}
      <section style={{ background: "white", padding: "48px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, textAlign: "center" }}>
          {[
            { icon: "🔒", title: "Secure Messaging",     desc: "All conversations stay safe on our platform" },
            { icon: "✅", title: "Verified Students",     desc: "All sellers are real students from local schools" },
            { icon: "🎯", title: "Free to List",          desc: "Post as many items as you like, no listing fees" },
            { icon: "⚡", title: "Instant Notifications", desc: "Get notified the moment someone messages you" },
          ].map((t) => (
            <div key={t.title} style={{ padding: "24px 16px" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{t.icon}</div>
              <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--em-gray-800)", marginBottom: 6 }}>{t.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--em-gray-500)", lineHeight: 1.5 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FOOTER ───────────────────────────────────── */}
      <section style={{ background: "var(--em-gradient-brand)", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "2rem", color: "white", marginBottom: 12, letterSpacing: "-0.02em" }}>Ready to Get Started?</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 32, fontSize: "1rem" }}>Join thousands of students already buying and selling on EduMart.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" className="em-btn-gold" style={{ padding: "14px 32px", fontSize: "1rem" }}>Create Free Account</Link>
          <Link href="/create-listing" style={{ padding: "14px 32px", fontSize: "1rem", background: "rgba(255,255,255,0.15)", color: "white", borderRadius: "var(--em-radius-full)", border: "2px solid rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: "var(--em-font-display)", fontWeight: 700, transition: "var(--em-transition)" }}>Start Selling →</Link>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="em-skeleton" style={{ width: 200, height: 40, borderRadius: 20 }} /></div>}>
      <HomeContent />
    </Suspense>
  );
}