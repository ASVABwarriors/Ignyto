"use client";

import { useState } from "react";
import { updateSectionSetting } from "./actions";
import FileUploadDropzone from "@/components/ui/FileUploadDropzone";

export default function SettingsForm({ initialData }: { initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bannerUrl, setBannerUrl] = useState(initialData?.bannerUrl || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    if (bannerUrl) formData.append("bannerUrl", bannerUrl);

    try {
      const res = await updateSectionSetting("group-camps", formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Settings updated successfully!");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-semibold">{error}</div>}
      {success && <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm font-semibold">{success}</div>}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">Section Title</label>
          <input type="text" name="title" defaultValue={initialData?.title || "Grade Wise Camps"} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">Section Description</label>
          <textarea name="description" defaultValue={initialData?.description || "Challenge your logic and skills with our premier academic competitions."} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
          <div className="mb-2">
            <span className="block text-sm font-semibold text-primary-dark">Section Banner Image</span>
            <span className="text-xs text-gray-500">Recommended size: 1920 x 400px.</span>
          </div>
          <FileUploadDropzone 
            label="Banner Image" 
            accept="image/*" 
            defaultUrl={bannerUrl} 
            folder="sections/grade-wise-camps"
            onUploadSuccess={(url) => setBannerUrl(url)} 
            showImagePreviews={true}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
