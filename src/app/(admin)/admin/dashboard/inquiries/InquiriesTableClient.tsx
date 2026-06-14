"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  grade: string | null;
  course: { title: string } | null;
  city: string | null;
  state: string | null;
  status: string;
  createdAt: Date;
};

export default function InquiriesTableClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredInquiries = initialInquiries.filter((q) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      q.name.toLowerCase().includes(term) ||
      q.email.toLowerCase().includes(term) ||
      q.phone.toLowerCase().includes(term) ||
      q.message.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-end">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm text-gray-800"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 font-semibold text-gray-600">Sr No.</th>
              <th className="py-4 px-6 font-semibold text-gray-600">Contact Info</th>
              <th className="py-4 px-6 font-semibold text-gray-600">Message</th>
              <th className="py-4 px-6 font-semibold text-gray-600">Status & Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  {searchTerm ? "No inquiries found matching your search." : "No inquiries yet."}
                </td>
              </tr>
            )}
            {filteredInquiries.map((q, index) => (
              <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50/50 align-top">
                <td className="py-4 px-6 font-medium text-gray-500">
                  {index + 1}
                </td>
                <td className="py-4 px-6">
                  <p className="font-bold text-gray-800">{q.name}</p>
                  <p className="text-sm text-gray-500">{q.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Phone: {q.phone}</p>
                  {q.grade && <p className="text-xs text-primary-dark mt-1 font-semibold">Grade: {q.grade}</p>}
                  {(q.city || q.state) && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      {q.city}{q.city && q.state ? ', ' : ''}{q.state}
                    </p>
                  )}
                </td>
                <td className="py-4 px-6 max-w-md">
                  {q.course && (
                    <div className="mb-2">
                      <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded">Interested in: {q.course.title}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{q.message}</p>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    q.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                  }`}>
                    {q.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">
                    {mounted ? new Date(q.createdAt).toLocaleString() : ""}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
