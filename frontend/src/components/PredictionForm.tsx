"use client";

import { useState } from "react";

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    location: "",
    area_sqft: "",
    bhk: "",
    bathrooms: "",
    age_of_property: "",
    parking: "0",
    lift: "0",
  });
  
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const locations = [
    "Airoli", "CBD Belapur", "Ghansoli", "Kharghar", "Nerul", "Panvel", "Ulwe", "Vashi"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      // In production, point to the deployed FastAPI URL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const payload = {
        location: formData.location.toLowerCase(),
        area_sqft: parseFloat(formData.area_sqft),
        bhk: parseFloat(formData.bhk),
        bathrooms: parseFloat(formData.bathrooms),
        age_of_property: parseFloat(formData.age_of_property || "0"),
        parking: parseInt(formData.parking),
        lift: parseInt(formData.lift)
      };

      const response = await fetch(`${API_URL}/api/v1/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setPrediction(data.predicted_price);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center tracking-tight">
        Property Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="" className="text-black">Select Node</option>
              {locations.map((loc) => (
                <option key={loc} value={loc} className="text-black">{loc}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Area (sq ft)</label>
            <input
              type="number"
              name="area_sqft"
              value={formData.area_sqft}
              onChange={handleChange}
              required
              min="100"
              placeholder="e.g. 1000"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">BHK</label>
            <input
              type="number"
              name="bhk"
              step="any"
              value={formData.bhk}
              onChange={handleChange}
              required
              min="1"
              max="10"
              placeholder="e.g. 2"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              step="any"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g. 2"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Age of Property (Years)</label>
            <input
              type="number"
              name="age_of_property"
              step="any"
              value={formData.age_of_property}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 5"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex gap-4 col-span-1 md:col-span-2 mt-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.parking === "1"}
                onChange={(e) => setFormData(prev => ({ ...prev, parking: e.target.checked ? "1" : "0" }))}
                className="w-5 h-5 rounded border-white/20 text-indigo-500 focus:ring-indigo-500 bg-white/5 transition-all"
              />
              <span className="text-gray-200 font-medium group-hover:text-white transition-colors">Has Parking</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.lift === "1"}
                onChange={(e) => setFormData(prev => ({ ...prev, lift: e.target.checked ? "1" : "0" }))}
                className="w-5 h-5 rounded border-white/20 text-indigo-500 focus:ring-indigo-500 bg-white/5 transition-all"
              />
              <span className="text-gray-200 font-medium group-hover:text-white transition-colors">Has Lift</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
        >
          {loading ? (
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               <span>Predicting...</span>
             </div>
          ) : (
            "Predict Property Price"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm animate-pulse">
          {error}
        </div>
      )}

      {prediction !== null && (
        <div className="mt-8 p-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl transform transition-all duration-500 hover:scale-105">
          <p className="text-indigo-200 text-sm font-medium mb-1 uppercase tracking-wider">Estimated Value</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              ₹{(prediction).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-3">
            *This is an AI-generated estimate based on historical data.
          </p>
        </div>
      )}
    </div>
  );
}
