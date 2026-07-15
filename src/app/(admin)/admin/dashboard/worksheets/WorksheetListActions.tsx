"use client";

import { useState } from "react";
import { deleteWorksheet, toggleWorksheetFeatured } from "./actions";

export default function WorksheetListActions({ worksheetId, isFeatured }: { worksheetId: string, isFeatured: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this worksheet?")) return;
    setLoading(true);
    await deleteWorksheet(worksheetId);
    setLoading(false);
  };

  const handleToggleFeature = async () => {
    setLoading(true);
    await toggleWorksheetFeatured(worksheetId, !isFeatured);
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={handleToggleFeature}
        disabled={loading}
        className={`px-3 py-1 rounded-lg font-medium transition-colors disabled:opacity-50 ${isFeatured ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-600 hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-600 hover:text-white'}`}
      >
        {loading ? "..." : isFeatured ? "Unfeature" : "Feature"}
      </button>
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
      >
        {loading ? "..." : "Delete"}
      </button>
    </>
  );
}
