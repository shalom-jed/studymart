"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateListing() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        subject: "Mathematics",
        category: "Notes",
        condition: "Good", // <-- Added condition to the state
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("studyMartToken");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const token = localStorage.getItem("studyMartToken");

        try {
            const response = await fetch("http://localhost:5000/api/listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create listing");
            }

            router.push("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Post a Study Material</h2>
                <p className="text-gray-500 mb-8">Fill out the details below to list your past papers or notes.</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="e.g., 2023 A/L Physics Past Papers - Clean"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                            <select
                                name="subject"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                                onChange={handleChange}
                            >
                                <option value="Mathematics">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                                <option value="IT">IT / Computer Science</option>
                                <option value="General">General / Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                                onChange={handleChange}
                            >
                                <option value="Notes">Notes</option>
                                <option value="Past Papers">Past Papers</option>
                                <option value="Resource Books">Resource Books</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Added Condition Dropdown */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Condition</label>
                            <select
                                name="condition"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                                onChange={handleChange}
                            >
                                <option value="New">Brand New</option>
                                <option value="Like New">Like New (Barely Used)</option>
                                <option value="Good">Good (Some highlights/wear)</option>
                                <option value="Acceptable">Acceptable (Heavy wear)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Price (Rs.)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                placeholder="e.g., 500"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            rows="4"
                            placeholder="Describe the condition of the material, what years it covers, etc."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition disabled:bg-blue-300"
                    >
                        {loading ? "Publishing..." : "Publish Listing"}
                    </button>
                </form>
            </div>
        </main>
    );
}