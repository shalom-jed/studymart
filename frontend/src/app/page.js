"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/listings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch listings");
        }

        setListings(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          StudyMart Marketplace
        </h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
          Find the exact past papers, notes, and resource books you need to pass your exams.
        </p>
        <Link
          href="/create-listing"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold shadow-md hover:bg-gray-100 transition"
        >
          Post a Listing
        </Link>
      </div>

      {/* Listings Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Added</h2>

        {loading ? (
          <div className="text-center text-gray-500 py-12 flex justify-center items-center gap-2">
            Loading materials...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12 bg-red-50 rounded-lg font-medium">{error}</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg mb-4">No study materials listed yet.</p>
            <p className="text-gray-400 text-sm">Be the first to post your old textbooks or notes!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition flex flex-col">

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                    {item.subject || "General"}
                  </span>
                  {item.category && (
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                      {item.category}
                    </span>
                  )}
                  {item.condition && (
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">
                      {item.condition}
                    </span>
                  )}
                </div>

                {/* Title & Price */}
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1" title={item.title}>
                  {item.title}
                </h3>
                <span className="text-lg font-extrabold text-green-600 mb-2">
                  Rs. {item.price}
                </span>

                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                  {item.description}
                </p>

                {/* Footer with properly routed Link */}
                <div className="border-t pt-4 mt-auto flex justify-between items-center text-xs text-gray-500">
                  <span className="truncate pr-2">Seller: {item.seller?.name || "Anonymous"}</span>
                  <Link
                    href={`/listings/${item.id}`}
                    className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded font-semibold hover:bg-blue-100 transition whitespace-nowrap"
                  >
                    View Details
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}