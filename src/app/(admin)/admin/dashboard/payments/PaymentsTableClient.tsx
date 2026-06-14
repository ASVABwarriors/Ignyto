"use client";

import { useState, useEffect } from "react";
import { H4 } from "@/components/ui/Heading";
import { FaSearch } from "react-icons/fa";

type PaymentWithRelations = any; // We'll use any to avoid importing complex Prisma types for now, or we can inline the shape.

export default function PaymentsTableClient({ initialPayments }: { initialPayments: PaymentWithRelations[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPayments = initialPayments.filter((p) => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    
    const studentName = p.enrollment?.studentName?.toLowerCase() || p.user?.name?.toLowerCase() || "";
    const parentName = p.enrollment?.parentName?.toLowerCase() || "";
    const studentPhone = p.enrollment?.studentPhone?.toLowerCase() || "";
    const parentPhone = p.enrollment?.parentPhone?.toLowerCase() || "";
    const courseTitle = p.course?.title?.toLowerCase() || "";

    return (
      studentName.includes(term) ||
      parentName.includes(term) ||
      studentPhone.includes(term) ||
      parentPhone.includes(term) ||
      courseTitle.includes(term)
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
            placeholder="Search by name, parent, phone, or camp..."
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
              <th className="py-4 px-6 font-semibold text-gray-600">Student Info</th>
              <th className="py-4 px-6 font-semibold text-gray-600">Course Info</th>
              <th className="py-4 px-6 font-semibold text-gray-600">Registration Details</th>
              <th className="py-4 px-6 font-semibold text-gray-600">Payment</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  {searchTerm ? "No payments found matching your search." : "No payments found."}
                </td>
              </tr>
            )}
            {filteredPayments.map((p, index) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50 align-top">
                <td className="py-4 px-6 font-medium text-gray-500">
                  {index + 1}
                </td>
                <td className="py-4 px-6">
                  <p className="font-bold text-gray-800">
                    {p.enrollment?.studentName || p.user?.name || "Guest"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {p.enrollment?.studentEmail || p.user?.email || "No email provided"}
                  </p>
                  {p.enrollment?.studentPhone && (
                    <p className="text-xs text-gray-400 mt-1">Phone: {p.enrollment.studentPhone}</p>
                  )}
                  {p.enrollment?.grade && (
                    <p className="text-xs text-gray-500 font-medium">Grade: {p.enrollment.grade}</p>
                  )}
                </td>
                <td className="py-4 px-6">
                  <H4 className="font-bold text-primary-dark">{p.course.title}</H4>
                  {p.enrollment && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-600"><span className="font-semibold">Week:</span> {p.enrollment.selectedDate}</p>
                      <p className="text-xs text-gray-600"><span className="font-semibold">Time:</span> {p.enrollment.selectedTime}</p>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  {p.enrollment ? (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600"><span className="font-semibold">Parent:</span> {p.enrollment.parentName}</p>
                      <p className="text-xs text-gray-600"><span className="font-semibold">Parent Email:</span> {p.enrollment.parentEmail}</p>
                      <p className="text-xs text-gray-600"><span className="font-semibold">Parent Phone:</span> {p.enrollment.parentPhone}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]" title={p.enrollment.address || ""}><span className="font-semibold">Address:</span> {p.enrollment.address}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No extra details</p>
                  )}
                </td>
                <td className="py-4 px-6">
                  <p className="font-semibold text-accent">${p.amount}</p>
                  <p className="font-mono text-xs text-gray-400 mt-1" title="PayPal Order ID">{p.paypalOrderId}</p>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    p.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {p.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">
                    {mounted ? new Date(p.createdAt).toLocaleString() : ""}
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
