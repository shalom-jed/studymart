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
    const onScroll = () => setIsScrolled(window.scrollY > 8);
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
    <nav className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow ${isScrolled ? 'shadow-md border-b' : ''}`} aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" id="nav-logo" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-extrabold" style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)' }}>E</div>
            <span className="font-extrabold text-lg bg-clip-text text-transparent" style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)' }}>EduMart</span>
          </Link>

          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md" role="search">
            <div className="flex items-center w-full border-2 border-gray-200 rounded-full overflow-hidden focus-within:border-indigo-600 transition-colors">
              <input
                id="nav-search"
                type="text"
                placeholder="Search notes, past papers, books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-transparent outline-none text-sm text-gray-800"
                aria-label="Search"
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm">🔍</button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Link href="/create-listing" id="nav-post-item" className="hidden sm:inline-flex items-center px-3 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold">+ Post</Link>
                <Link href="/inbox" id="nav-inbox" title="Inbox" className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-base hover:bg-gray-200">💬</Link>
                <Link href="/profile" id="nav-profile" className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 hover:border-indigo-600">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)' }}>👤</div>
                  <span className="text-sm text-gray-700">Profile</span>
                </Link>
                <button id="nav-logout" onClick={handleLogout} className="hidden sm:inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100">Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login" id="nav-signin" className="hidden sm:inline text-sm font-semibold text-gray-600 hover:text-indigo-600">Sign In</Link>
                <Link href="/register" id="nav-register" className="inline-flex items-center px-3 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold">Get Started</Link>
              </>
            )}

            {/* Mobile menu button */}
            <button id="nav-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu" className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category bar (desktop) */}
      <div className="hidden sm:block border-t bg-gray-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-2">
          {categories.map((cat) => (
            <Link key={cat.label} href={cat.href} id={`nav-cat-${cat.label.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 whitespace-nowrap">
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="sm:hidden border-t bg-white p-4">
          <form onSubmit={handleSearch} className="flex gap-2 mb-3" role="search">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-md" />
            <button type="submit" className="px-3 py-2 bg-indigo-600 text-white rounded-md">🔍</button>
          </form>
n          <div className="flex flex-col gap-2 mb-3">
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-gray-700 bg-gray-50">{cat.icon} {cat.label}</Link>
            ))}
          </div>
n          <div className="border-t pt-3">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Link href="/create-listing" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-center font-semibold">+ Post Item</Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md text-center font-semibold text-gray-700">My Profile</Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-md bg-red-50 text-red-600 font-semibold">Log Out</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-center font-semibold">Get Started</Link>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md text-center font-semibold text-gray-700">Sign In</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
