"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Build the URL with the search filters
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("search", searchTerm);
      if (subjectFilter) queryParams.append("subject", subjectFilter);
      if (categoryFilter) queryParams.append("category", categoryFilter);

      const response = await fetch(`http://localhost:5000/api/listings?${queryParams.toString()}`);
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
  }, [searchTerm, subjectFilter, categoryFilter]);

  // Load everything on initial page load
  useEffect(() => {
    fetchListings();
  }, []); // Run once on mount

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

      {/* NEW: Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by keyword (e.g., Physics 2023)..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="IT">IT / Computer Science</option>
            <option value="General">General / Other</option>
          </select>
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Notes">Notes</option>
            <option value="Past Papers">Past Papers</option>
            <option value="Resource Books">Resource Books</option>
          </select>
          <button
            onClick={fetchListings}
            className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Listings Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Materials</h2>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading materials...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12 bg-red-50 rounded-lg">{error}</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg mb-4">No materials found for that search.</p>
            <button onClick={() => { setSearchTerm(""); setSubjectFilter(""); setCategoryFilter(""); fetchListings(); }} className="text-blue-600 hover:underline">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">{item.subject || "General"}</span>
                  {item.category && <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded">{item.category}</span>}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                <span className="text-lg font-extrabold text-green-600 mb-2">Rs. {item.price}</span>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{item.description}</p>
                <div className="border-t pt-4 mt-auto flex justify-between items-center text-xs text-gray-500">
                  <span className="truncate pr-2">Seller: {item.seller?.name || "Anonymous"}</span>
                  <Link href={`/listings/${item.id}`} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded font-semibold hover:bg-blue-100 transition whitespace-nowrap">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}