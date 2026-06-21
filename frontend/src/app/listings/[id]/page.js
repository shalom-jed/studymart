"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ListingDetails() {
    const { id } = useParams(); // Grabs the ID from the URL
    const router = useRouter();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/listings/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch listing details");
                }

                setListing(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading details...</div>;
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6">
                <p className="text-red-500 mb-4">{error || "Listing not found"}</p>
                <Link href="/" className="text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-gray-900 mb-6 font-medium flex items-center gap-2"
                >
                    ← Back to Marketplace
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                    {/* Left Column: Details */}
                    <div className="p-8 flex-1">
                        <div className="flex gap-2 mb-4">
                            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                {listing.subject}
                            </span>
                            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                                {listing.category}
                            </span>
                            <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                                {listing.condition}
                            </span>
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{listing.title}</h1>
                        <p className="text-2xl font-bold text-green-600 mb-6">Rs. {listing.price}</p>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8">
                            {listing.description}
                        </p>

                        <div className="text-sm text-gray-400">
                            Listed on: {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Right Column: Seller Info */}
                    <div className="bg-gray-50 p-8 w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Seller Information</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                                {listing.seller?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{listing.seller?.name || "Anonymous"}</p>
                                <p className="text-sm text-gray-500">Verified Student</p>
                            </div>
                        </div>

                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition">
                            Message Seller
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}