"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ListingDetails() {
    const { id } = useParams();
    const router = useRouter();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Messaging State
    const [messageContent, setMessageContent] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [messageStatus, setMessageStatus] = useState(null); // 'success' or 'error'
    const [statusText, setStatusText] = useState("");

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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setMessageStatus(null);

        const token = localStorage.getItem("studyMartToken");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    listingId: id,
                    content: messageContent
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send message");
            }

            setMessageStatus("success");
            setStatusText("Message sent successfully!");
            setMessageContent(""); // Clear the box
        } catch (err) {
            setMessageStatus("error");
            setStatusText(err.message);
        } finally {
            setIsSending(false);
        }
    };

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
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-gray-900 mb-6 font-medium flex items-center gap-2"
                >
                    ← Back
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

                    {/* Right Column: Seller Info & Messaging */}
                    <div className="bg-gray-50 p-8 w-full md:w-96 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col">
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

                        <div className="border-t border-gray-200 pt-6 mt-2">
                            <h4 className="font-bold text-gray-900 mb-3">Send a Message</h4>

                            {messageStatus === "success" ? (
                                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium mb-4">
                                    {statusText}
                                </div>
                            ) : (
                                <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
                                    {messageStatus === "error" && (
                                        <div className="text-red-500 text-sm font-medium">{statusText}</div>
                                    )}
                                    <textarea
                                        required
                                        rows="3"
                                        placeholder="Hi, is this still available?"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={isSending}
                                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold shadow hover:bg-blue-700 transition disabled:bg-blue-300"
                                    >
                                        {isSending ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}