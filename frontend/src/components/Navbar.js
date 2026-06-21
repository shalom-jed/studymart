"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TOKEN_KEY = "eduMartToken";

const categories = [
  { label: "All Items",    href: "/",                    icon: "🏠" },
  { label: "Past Papers",  href: "/?category=Past Papers", icon: "📝" },
  { label: "Notes",        href: "/?category=Notes",       icon: "📒" },
  { label: "Books",        href: "/?category=Resource Books", icon: "📚" },
];

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();

  const [isLoggedIn,   setIsLoggedIn]   = useState(false);
  const [isMounted,    setIsMounted]    = useState(false);
  const [isScrolled,   setIsScrolled]   = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");

  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(!!localStorage.getItem(TOKEN_KEY));
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  if (!isMounted) return null;

  return (
    <nav
      id="main-navbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: isScrolled
          ? "rgba(255,255,255,0.9)"
          : "rgba(255,255,255,0.98)",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: "1px solid var(--em-gray-100)",
        boxShadow: isScrolled ? "var(--em-shadow-md)" : "none",
        transition: "var(--em-transition-slow)",
      }}
    >
      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>

          {/* Logo */}
          <Link href="/" id="nav-logo" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36,
              background: "var(--em-gradient-brand)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 900, color: "white",
              fontFamily: "var(--em-font-display)",
              boxShadow: "var(--em-shadow-brand)",
            }}>E</div>
            <span style={{
              fontFamily: "var(--em-font-display)",
              fontWeight: 800,
              fontSize: "1.3rem",
              background: "var(--em-gradient-brand)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}>EduMart</span>
          </Link>

          {/* Search Bar (desktop) */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480, display: "flex", gap: 0 }} className="hidden sm:flex">
            <div style={{ display: "flex", flex: 1, border: "2px solid var(--em-gray-200)", borderRadius: "var(--em-radius-full)", overflow: "hidden", transition: "var(--em-transition)" }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--em-primary)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--em-gray-200)"}
            >
              <input
                id="nav-search"
                type="text"
                placeholder="Search notes, past papers, books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, padding: "10px 20px",
                  border: "none", outline: "none",
                  fontFamily: "var(--em-font-body)",
                  fontSize: "0.9rem",
                  color: "var(--em-gray-900)",
                  background: "transparent",
                }}
              />
              <button type="submit" style={{
                padding: "10px 18px",
                background: "var(--em-gradient-brand)",
                border: "none", cursor: "pointer",
                color: "white", fontSize: "0.95rem",
                display: "flex", alignItems: "center",
              }}>🔍</button>
            </div>
          </form>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {isLoggedIn ? (
              <>
                <Link href="/create-listing" id="nav-post-item" className="em-btn-primary hidden sm:inline-flex" style={{ padding: "9px 18px", fontSize: "0.85rem" }}>
                  + Post Item
                </Link>
                <Link href="/inbox" id="nav-inbox" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "var(--em-radius-full)", background: "var(--em-gray-100)", textDecoration: "none", transition: "var(--em-transition)" }}
                  title="Inbox"
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(79,70,229,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--em-gray-100)"}
                >
                  <span style={{ fontSize: 18 }}>💬</span>
                </Link>
                <Link href="/profile" id="nav-profile" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", padding: "6px 14px", borderRadius: "var(--em-radius-full)", border: "2px solid var(--em-gray-200)", transition: "var(--em-transition)" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--em-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--em-gray-200)"}
                >
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--em-gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 800 }}>
                    👤
                  </div>
                  <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 600, fontSize: "0.85rem", color: "var(--em-gray-700)" }} className="hidden sm:inline">Profile</span>
                </Link>
                <button id="nav-logout" onClick={handleLogout} style={{ padding: "8px 16px", background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "none", borderRadius: "var(--em-radius-full)", fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", transition: "var(--em-transition)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                  className="hidden sm:block"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" id="nav-signin" style={{ fontFamily: "var(--em-font-display)", fontWeight: 600, fontSize: "0.9rem", color: "var(--em-gray-600)", textDecoration: "none", padding: "8px 12px", transition: "var(--em-transition)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--em-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--em-gray-600)"}
                  className="hidden sm:block"
                >
                  Sign In
                </Link>
                <Link href="/register" id="nav-register" className="em-btn-primary" style={{ padding: "9px 20px", fontSize: "0.875rem" }}>
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              id="nav-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ display: "flex", flexDirection: "column", gap: 5, padding: 8, background: "none", border: "none", cursor: "pointer" }}
              className="sm:hidden"
            >
              <span style={{ width: 22, height: 2, background: menuOpen ? "var(--em-primary)" : "var(--em-gray-700)", borderRadius: 2, transition: "var(--em-transition)", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
              <span style={{ width: 22, height: 2, background: menuOpen ? "transparent" : "var(--em-gray-700)", borderRadius: 2, transition: "var(--em-transition)" }} />
              <span style={{ width: 22, height: 2, background: menuOpen ? "var(--em-primary)" : "var(--em-gray-700)", borderRadius: 2, transition: "var(--em-transition)", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── CATEGORY BAR ────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--em-gray-100)", background: "rgba(248,250,252,0.8)" }} className="hidden sm:block">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 4, height: 44 }}>
          {categories.map((cat) => (
            <Link key={cat.label} href={cat.href} id={`nav-cat-${cat.label.replace(/\s+/g, '-').toLowerCase()}`}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px",
                borderRadius: "var(--em-radius-full)",
                textDecoration: "none",
                fontFamily: "var(--em-font-display)",
                fontWeight: 600,
                fontSize: "0.82rem",
                color: "var(--em-gray-600)",
                transition: "var(--em-transition)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(79,70,229,0.08)"; e.currentTarget.style.color = "var(--em-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--em-gray-600)"; }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── MOBILE MENU ─────────────────────────────────────── */}
      {menuOpen && (
        <div style={{ borderTop: "1px solid var(--em-gray-100)", background: "white", padding: 20, display: "flex", flexDirection: "column", gap: 12 }} className="sm:hidden">
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
            <input
              type="text" placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: "10px 14px", border: "2px solid var(--em-gray-200)", borderRadius: "var(--em-radius-md)", fontFamily: "var(--em-font-body)", outline: "none", fontSize: "0.9rem" }}
            />
            <button type="submit" style={{ padding: "10px 16px", background: "var(--em-gradient-brand)", color: "white", border: "none", borderRadius: "var(--em-radius-md)", cursor: "pointer" }}>🔍</button>
          </form>
          {categories.map((cat) => (
            <Link key={cat.label} href={cat.href} onClick={() => setMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: "var(--em-radius-md)", textDecoration: "none", fontFamily: "var(--em-font-display)", fontWeight: 600, color: "var(--em-gray-700)", background: "var(--em-gray-50)" }}
            >
              {cat.icon} {cat.label}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid var(--em-gray-100)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {isLoggedIn ? (
              <>
                <Link href="/create-listing" onClick={() => setMenuOpen(false)} className="em-btn-primary" style={{ justifyContent: "center" }}>+ Post Item</Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ textAlign: "center", padding: "10px", textDecoration: "none", fontFamily: "var(--em-font-display)", fontWeight: 600, color: "var(--em-gray-700)" }}>My Profile</Link>
                <button onClick={handleLogout} style={{ padding: 10, background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "none", borderRadius: "var(--em-radius-md)", fontFamily: "var(--em-font-display)", fontWeight: 700, cursor: "pointer" }}>Log Out</button>
              </>
            ) : (
              <>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="em-btn-primary" style={{ justifyContent: "center" }}>Get Started</Link>
                <Link href="/login" onClick={() => setMenuOpen(false)} style={{ textAlign: "center", padding: "10px", textDecoration: "none", fontFamily: "var(--em-font-display)", fontWeight: 600, color: "var(--em-gray-600)" }}>Sign In</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}