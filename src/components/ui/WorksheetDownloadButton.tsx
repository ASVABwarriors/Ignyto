"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { FaDownload, FaTimes, FaSpinner } from "react-icons/fa";

interface WorksheetDownloadButtonProps {
  worksheetId: string;
  slug: string;
  pdfPageCount?: string | null;
}

export default function WorksheetDownloadButton({
  worksheetId,
  slug,
  pdfPageCount,
}: WorksheetDownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    grade: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/worksheets/download-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          grade: formData.grade,
          worksheetId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record download. Please try again.");
      }

      // Automatically trigger the download
      const downloadUrl = `/api/worksheets/${slug}/download`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close the modal and reset form after a short delay
      setTimeout(() => {
        setIsOpen(false);
        setFormData({ name: "", email: "", grade: "" });
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 lg:py-4 font-bold text-base lg:text-lg transition-all shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:-translate-y-1"
      >
        <span className="flex items-center gap-2">
          <FaDownload /> Download PDF
        </span>
        {pdfPageCount && (
          <span className="text-sm font-medium opacity-90 mt-1">
            ({pdfPageCount.toLowerCase().includes('page') ? pdfPageCount : `${pdfPageCount} Pages`})
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && typeof document !== 'undefined' && 
        createPortal(
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 relative"
              role="dialog"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              >
                <FaTimes size={24} />
              </button>

              <div className="bg-primary p-6 text-center text-white">
                <h2 className="text-2xl font-bold mb-2">Get Your Free Worksheet</h2>
                <p className="text-primary-light text-sm">
                  Please let us know where to send your resources!
                </p>
              </div>

              <div className="p-6 md:p-8">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">
                      Student / Parent Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="grade" className="block text-sm font-bold text-gray-700 mb-1">
                      Grade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="grade"
                      name="grade"
                      required
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800"
                      placeholder="e.g. Grade 5"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" /> Preparing...
                      </>
                    ) : (
                      <>
                        <FaDownload /> Download Now
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
