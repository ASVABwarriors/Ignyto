"use client";

import { useState } from "react";
import { deleteCourse } from "./actions";

export default function CourseListActions({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    setLoading(true);
    await deleteCourse(courseId);
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
