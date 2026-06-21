export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Pass Your Exams, <span className="text-blue-600">Without Going Broke.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          The centralized marketplace for O/L and A/L students to buy, sell, or donate past papers, resource books, and top-tier short notes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
            Browse Materials
          </button>
          <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Post a Listing
          </button>
        </div>
      </div>
    </main>
  );
}