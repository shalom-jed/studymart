"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname(); // Tells us what page we are currently on

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // We use useEffect to check local storage ONLY after the component mounts to the browser.
    // We add 'pathname' to the dependency array so it re-checks the token every time the page changes!
    useEffect(() => {
        setIsMounted(true);
        const token = localStorage.getItem("studyMartToken");
        setIsLoggedIn(!!token);
    }, [pathname]);

    const handleLogout = () => {
        // 1. Destroy the digital ID card
        localStorage.removeItem("studyMartToken");
        // 2. Update the state
        setIsLoggedIn(false);
        // 3. Kick them back to the login screen
        router.push("/login");
    };

    // Prevents a Next.js hydration error by waiting for the browser to load before rendering
    if (!isMounted) return null;

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Left Side: Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white font-extrabold text-xl w-8 h-8 flex items-center justify-center rounded-lg">
                        S
                    </div>
                    <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                        StudyMart
                    </span>
                </Link>

                {/* Right Side: Dynamic Navigation Links */}
                <div className="flex items-center gap-6">
                    {isLoggedIn ? (
                        // --- WHAT LOGGED IN USERS SEE ---
                        <>
                            <Link
                                href="/create-listing"
                                className="text-sm font-bold text-gray-600 hover:text-blue-600 transition hidden sm:block"
                            >
                                Post an Item
                            </Link>
                            <Link
                                href="/inbox"
                                className="text-sm font-bold text-gray-600 hover:text-blue-600 transition"
                            >
                                Inbox
                            </Link>
                            <Link
                                href="/profile"
                                className="text-sm font-bold text-gray-600 hover:text-blue-600 transition"
                            >
                                My Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        // --- WHAT GUESTS SEE ---
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-bold text-gray-600 hover:text-blue-600 transition"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}