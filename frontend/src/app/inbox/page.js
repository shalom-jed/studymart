"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Inbox() {
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInbox = async () => {
            const token = localStorage.getItem("studyMartToken");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/messages/inbox", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.message);

                setMessages(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInbox();
    }, [router]);

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">My Inbox</h1>
                        <p className="text-gray-500">Messages from students interested in your materials.</p>
                    </div>
                    <Link href="/" className="text-blue-600 font-medium hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-12">Loading messages...</div>
                ) : error ? (
                    <div className="text-center text-red-500 py-12 bg-red-50 rounded-lg">{error}</div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Your inbox is currently empty.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">
                                            From: {msg.sender?.name || "Unknown Student"}
                                        </h3>
                                        <p className="text-sm text-blue-600 font-medium">
                                            Regarding: {msg.listing?.title || "Deleted Item"}
                                        </p>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 whitespace-pre-wrap">
                                    "{msg.content}"
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                    <a
                                        href={`mailto:${msg.sender?.email}`}
                                        className="text-sm bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition"
                                    >
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}