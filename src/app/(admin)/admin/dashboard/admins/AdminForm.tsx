"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdmin } from "./actions";

export default function AdminForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await createAdmin({ name, email, phone, password });
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Admin created successfully!");
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        router.refresh(); // Refresh the list
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 bg-red-50 p-2 rounded text-sm">{error}</div>}
      {success && <div className="text-green-600 bg-green-50 p-2 rounded text-sm">{success}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-primary-dark mb-1">Full Name</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary-dark mb-1">Email Address</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary-dark mb-1">Phone Number</label>
        <input 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary-dark mb-1">Temporary Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Admin"}
      </button>
    </form>
  );
}
