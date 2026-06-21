"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TOKEN_KEY = "eduMartToken";
const API       = "http://localhost:5000";

const SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","IT","General"];
const CATEGORIES = ["Notes","Past Papers","Resource Books"];
const CONDITIONS = [
  { value: "New",       label: "Brand New",            desc: "Never used, pristine condition" },
  { value: "Like New",  label: "Like New",              desc: "Barely used, minor marks" },
  { value: "Good",      label: "Good",                  desc: "Some highlights / wear" },
  { value: "Acceptable",label: "Acceptable",            desc: "Heavy wear, still readable" },
];

async function uploadToCloudinary(file, token) {
  // 1. Get signed signature from our backend
  const sigRes = await fetch(`${API}/api/upload/sign`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!sigRes.ok) throw new Error("Failed to get upload signature — are you logged in?");
  const { data: sig } = await sigRes.json();

  // 2. Upload directly to Cloudinary using signed params
  const form = new FormData();
  form.append("file",      file);
  form.append("api_key",   sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder",    sig.folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  // Parse and surface the real Cloudinary error
  const uploadData = await uploadRes.json();
  if (!uploadRes.ok) {
    const msg = uploadData?.error?.message || JSON.stringify(uploadData);
    throw new Error(`Cloudinary: ${msg}`);
  }
  return uploadData.secure_url;
}

export default function CreateListing() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [step,       setStep]      = useState(1);
  const [formData,   setFormData]  = useState({
    title: "", description: "", price: "",
    subject: "Mathematics", category: "Notes", condition: "Good",
  });
  const [photos,     setPhotos]    = useState([]);     // { file, preview, url }
  const [uploading,  setUploading] = useState(false);
  const [error,      setError]     = useState("");
  const [loading,    setLoading]   = useState(false);
  const [dragOver,   setDragOver]  = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) router.push("/login");
  }, [router]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const addFiles = (files) => {
    const allowed = [...files].filter(f => f.type.startsWith("image/")).slice(0, 5 - photos.length);
    const previews = allowed.map(f => ({ file: f, preview: URL.createObjectURL(f), url: null }));
    setPhotos(prev => [...prev, ...previews].slice(0, 5));
  };

  const removePhoto = (idx) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleNext = () => {
    if (step === 1 && (!formData.title || !formData.description)) {
      setError("Please fill in the title and description."); return;
    }
    if (step === 2 && formData.price === "") {
      setError("Please enter a price."); return;
    }
    setError("");
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      // Upload all photos to Cloudinary
      setUploading(true);
      const uploadedUrls = await Promise.all(
        photos.filter(p => !p.url).map(p => uploadToCloudinary(p.file, token))
      );
      setUploading(false);
      const allUrls = [...photos.filter(p => p.url).map(p => p.url), ...uploadedUrls];

      const res = await fetch(`${API}/api/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          photos: allUrls,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create listing");
      router.push("/");
    } catch (err) {
      setError(err.message);
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ["Details", "Pricing & Condition", "Photos & Preview"];

  return (
    <main style={{ minHeight: "100vh", background: "var(--em-gray-50)", padding: "32px 24px 64px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--em-gray-500)", textDecoration: "none", fontFamily: "var(--em-font-display)", fontWeight: 600, fontSize: "0.875rem", marginBottom: 16 }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--em-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--em-gray-500)"}
          >
            ← Back to Marketplace
          </Link>
          <h1 style={{ fontFamily: "var(--em-font-display)", fontWeight: 900, fontSize: "2rem", color: "var(--em-gray-900)", letterSpacing: "-0.02em", marginBottom: 6 }}>Post a Study Material</h1>
          <p style={{ color: "var(--em-gray-500)" }}>Help a fellow student and earn money from your old materials.</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32, background: "white", borderRadius: "var(--em-radius-lg)", padding: "20px 24px", boxShadow: "var(--em-shadow-sm)", border: "1px solid var(--em-gray-100)" }}>
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "0.875rem", background: done ? "var(--em-success)" : active ? "var(--em-gradient-brand)" : "var(--em-gray-100)", color: done || active ? "white" : "var(--em-gray-400)", transition: "var(--em-transition)", flexShrink: 0 }}>
                    {done ? "✓" : n}
                  </div>
                  <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 600, fontSize: "0.85rem", color: active ? "var(--em-primary)" : done ? "var(--em-success)" : "var(--em-gray-400)", whiteSpace: "nowrap" }} className="hidden sm:inline">
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: done ? "var(--em-success)" : "var(--em-gray-100)", margin: "0 12px", transition: "var(--em-transition)" }} />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--em-danger)", padding: "12px 16px", borderRadius: "var(--em-radius-md)", marginBottom: 20, fontSize: "0.875rem", fontWeight: 500, display: "flex", gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: step < 3 ? "1fr 1fr" : "1fr", gap: 24 }} className={step < 3 ? "grid-cols-2" : "grid-cols-1"}>

          {/* ── FORM PANEL ── */}
          <div style={{ background: "white", borderRadius: "var(--em-radius-xl)", padding: "32px", boxShadow: "var(--em-shadow-md)", border: "1px solid var(--em-gray-100)" }}>

            {/* STEP 1: Details */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="em-animate-scaleIn">
                <h2 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--em-gray-900)", marginBottom: 4 }}>📋 Material Details</h2>
                <div>
                  <label className="em-label" htmlFor="cl-title">Title *</label>
                  <input id="cl-title" className="em-input" name="title" value={formData.title} required placeholder='e.g., "2023 A/L Physics Past Papers — Clean"' onChange={handleChange} />
                  <p style={{ fontSize: "0.75rem", color: "var(--em-gray-400)", marginTop: 4 }}>{formData.title.length} / 100 characters</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label className="em-label" htmlFor="cl-subject">Subject</label>
                    <select id="cl-subject" className="em-select" name="subject" value={formData.subject} onChange={handleChange}>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="em-label" htmlFor="cl-category">Category</label>
                    <select id="cl-category" className="em-select" name="category" value={formData.category} onChange={handleChange}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="em-label" htmlFor="cl-description">Description *</label>
                  <textarea id="cl-description" className="em-input" name="description" value={formData.description} required rows={4} placeholder="Describe the content, year coverage, condition details, what makes this material valuable..." onChange={handleChange} style={{ resize: "vertical", minHeight: 100 }} />
                  <p style={{ fontSize: "0.75rem", color: "var(--em-gray-400)", marginTop: 4 }}>{formData.description.length} characters</p>
                </div>
              </div>
            )}

            {/* STEP 2: Pricing & Condition */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="em-animate-scaleIn">
                <h2 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--em-gray-900)", marginBottom: 4 }}>💰 Pricing & Condition</h2>
                <div>
                  <label className="em-label" htmlFor="cl-price">Price (Rs.) *</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontFamily: "var(--em-font-display)", fontWeight: 700, color: "var(--em-gray-500)" }}>Rs.</span>
                    <input id="cl-price" className="em-input" type="number" name="price" value={formData.price} required min="0" placeholder="0" onChange={handleChange} style={{ paddingLeft: 46 }} />
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--em-gray-500)", marginTop: 6 }}>Enter <strong>0</strong> to donate for free 🎁</p>
                </div>
                <div>
                  <label className="em-label">Condition *</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
                    {CONDITIONS.map((c) => (
                      <label key={c.value} htmlFor={`cond-${c.value}`} style={{ display: "flex", flexDirection: "column", gap: 4, padding: "14px 16px", border: `2px solid ${formData.condition === c.value ? "var(--em-primary)" : "var(--em-gray-200)"}`, borderRadius: "var(--em-radius-md)", cursor: "pointer", background: formData.condition === c.value ? "rgba(79,70,229,0.04)" : "white", transition: "var(--em-transition)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input id={`cond-${c.value}`} type="radio" name="condition" value={c.value} checked={formData.condition === c.value} onChange={handleChange} style={{ accentColor: "var(--em-primary)" }} />
                          <span style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.875rem", color: "var(--em-gray-800)" }}>{c.label}</span>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--em-gray-500)", marginLeft: 22 }}>{c.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Photos */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="em-animate-scaleIn">
                <h2 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--em-gray-900)", marginBottom: 4 }}>📸 Add Photos</h2>
                <p style={{ color: "var(--em-gray-500)", fontSize: "0.875rem" }}>Up to 5 photos. Items with photos sell 3× faster!</p>

                {/* Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: `2px dashed ${dragOver ? "var(--em-primary)" : "var(--em-gray-300)"}`, borderRadius: "var(--em-radius-lg)", padding: "40px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(79,70,229,0.04)" : "var(--em-gray-50)", transition: "var(--em-transition)" }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📤</div>
                  <p style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, color: "var(--em-gray-700)", marginBottom: 4 }}>Drag & drop photos here</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--em-gray-400)" }}>or click to browse — JPG, PNG, WEBP (max 5)</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => addFiles(e.target.files)} />
                </div>

                {/* Photo Previews */}
                {photos.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 10 }}>
                    {photos.map((p, i) => (
                      <div key={i} style={{ position: "relative", borderRadius: "var(--em-radius-md)", overflow: "hidden", aspectRatio: "1", border: "2px solid var(--em-gray-200)" }}>
                        <img src={p.preview} alt={`Photo ${i+1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button onClick={(e) => { e.stopPropagation(); removePhoto(i); }} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "white", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                        {i === 0 && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--em-gradient-brand)", padding: "2px", textAlign: "center", fontSize: "0.6rem", color: "white", fontWeight: 800 }}>MAIN</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Full Preview */}
                <div style={{ background: "var(--em-gray-50)", borderRadius: "var(--em-radius-lg)", padding: 20, border: "1px solid var(--em-gray-200)" }}>
                  <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.875rem", color: "var(--em-gray-700)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Listing Preview</h3>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "var(--em-radius-md)", background: "rgba(79,70,229,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, overflow: "hidden" }}>
                      {photos[0] ? <img src={photos[0].preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📄"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--em-gray-900)", marginBottom: 4 }}>{formData.title || "Your title..."}</h4>
                      <p style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.1rem", color: formData.price == 0 && formData.price !== "" ? "var(--em-success)" : "var(--em-primary)" }}>
                        {formData.price === "" ? "Set a price" : formData.price == 0 ? "FREE 🎁" : `Rs. ${Number(formData.price).toLocaleString()}`}
                      </p>
                      <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                        <span className="em-badge em-badge-primary" style={{ fontSize: "0.7rem" }}>{formData.subject}</span>
                        <span className="em-badge em-badge-gray" style={{ fontSize: "0.7rem" }}>{formData.category}</span>
                        <span className="em-badge em-badge-success" style={{ fontSize: "0.7rem" }}>{formData.condition}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--em-gray-100)" }}>
              {step > 1 && (
                <button onClick={() => { setStep(s => s-1); setError(""); }} className="em-btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "12px" }}>← Back</button>
              )}
              {step < 3 ? (
                <button onClick={handleNext} className="em-btn-primary" style={{ flex: 1, justifyContent: "center", padding: "12px" }}>
                  Continue →
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="em-btn-primary" style={{ flex: 1, justifyContent: "center", padding: "12px", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                  {uploading ? "Uploading photos..." : loading ? "Publishing..." : "🚀 Publish Listing"}
                </button>
              )}
            </div>
          </div>

          {/* ── SIDE TIPS (steps 1 & 2) ── */}
          {step < 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "var(--em-gradient-brand)", borderRadius: "var(--em-radius-xl)", padding: "28px 24px", color: "white" }}>
                <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 800, fontSize: "1.1rem", marginBottom: 12 }}>💡 Tips for faster sales</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Use specific titles (year, subject, board)", "Mention every chapter or topic covered", "Price competitively — check similar listings", "Add 3–5 clear photos of the material", "Reply to messages within the hour"].map(tip => (
                    <li key={tip} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>
                      <span style={{ marginTop: 2 }}>✅</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ background: "white", borderRadius: "var(--em-radius-xl)", padding: "24px", boxShadow: "var(--em-shadow-sm)", border: "1px solid var(--em-gray-100)" }}>
                <h3 style={{ fontFamily: "var(--em-font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--em-gray-800)", marginBottom: 12 }}>📊 Popular on EduMart</h3>
                {[{ tag: "A/L Physics 2023", sells: "Sells in < 1 day" }, { tag: "O/L Maths Notes", sells: "High demand" }, { tag: "Chemistry MCQ Book", sells: "Trending" }].map(item => (
                  <div key={item.tag} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--em-gray-50)" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--em-gray-700)", fontFamily: "var(--em-font-display)" }}>{item.tag}</span>
                    <span className="em-badge em-badge-success" style={{ fontSize: "0.7rem" }}>{item.sells}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}