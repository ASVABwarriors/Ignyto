"use client";

import { useState } from "react";
import { updateSettings } from "./actions";

export default function SettingsForm({ initialName, initialEmail, initialPhone }: { initialName: string, initialEmail: string, initialPhone: string }) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await updateSettings({ name, email, phone, token });
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Settings updated successfully!");
        setToken(""); // clear token after success
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-semibold border border-red-100">{error}</div>}
      {success && <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm font-semibold border border-green-100">{success}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-primary-dark mb-1">Full Name</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-primary-dark mb-1">Email Address</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary-dark mb-1">Phone Number</label>
        <input 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          required
        />
      </div>

      <div className="pt-6 border-t border-gray-100">
        <label className="block text-sm font-semibold text-primary-dark mb-1">Authenticator Code</label>
        <p className="text-xs text-gray-500 mb-3">Enter the 6-digit code from your app to confirm these changes.</p>
        <input 
          type="text" 
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-xl tracking-widest font-mono"
          required
          maxLength={6}
          pattern="\d{6}"
          placeholder="000000"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
