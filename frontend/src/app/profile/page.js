"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Profile() {
    const router = useRouter();
    const [myListings, setMyListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyListings = async () => {
            const token = localStorage.getItem("studyMartToken");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/listings/my-listings", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (!response.ok) throw new Error(data.message);

                setMyListings(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyListings();
    }, [router]);

    const handleDelete = async (listingId) => {
        if (!window.confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;

        const token = localStorage.getItem("studyMartToken");

        try {
            const response = await fetch(`http://localhost:5000/api/listings/${listingId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            // Instantly remove it from the screen without refreshing the page
            setMyListings(myListings.filter(item => item.id !== listingId));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
                        <p className="text-gray-500">Manage your active study material listings.</p>
                    </div>
                    <Link href="/" className="text-blue-600 font-medium hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-12">Loading your listings...</div>
                ) : error ? (
                    <div className="text-center text-red-500 py-12 bg-red-50 rounded-lg">{error}</div>
                ) : myListings.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg mb-4">You haven't posted any materials yet.</p>
                        <Link href="/create-listing" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition">
                            Post your first item
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myListings.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                                        {item.subject}
                                    </span>
                                    <span className="text-lg font-extrabold text-green-600">Rs. {item.price}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>

                                <div className="border-t pt-4 mt-auto flex justify-between items-center">
                                    <Link href={`/listings/${item.id}`} className="text-blue-600 text-sm font-semibold hover:underline">
                                        View Post
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-sm font-bold hover:bg-red-100 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}