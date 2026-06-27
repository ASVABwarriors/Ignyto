"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse, updateCourse } from "../actions";
import FileUploadDropzone from "@/components/ui/FileUploadDropzone";
import { H3 } from "@/components/ui/Heading";
import TextEditor from "@/components/ui/TextEditor";

export default function CourseForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Track uploaded URLs in state so they get sent on submit
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || "");
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");
  
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData?.slug);
  const [description, setDescription] = useState(initialData?.description || "");

  const [dates, setDates] = useState<{ dateStr: string, timeSlots: string[] }[]>(
    initialData?.dates?.map((d: any) => ({
      dateStr: d.dateStr,
      timeSlots: d.timeSlots?.map((t: any) => t.timeStr) || []
    })) || []
  );

  const handleAddDate = () => setDates([...dates, { dateStr: "", timeSlots: [] }]);
  const handleUpdateDate = (index: number, value: string) => {
    const newDates = [...dates];
    newDates[index].dateStr = value;
    setDates(newDates);
  };
  const handleRemoveDate = (index: number) => setDates(dates.filter((_, i) => i !== index));

  const handleAddTimeSlot = (dateIndex: number) => {
    const newDates = [...dates];
    newDates[dateIndex].timeSlots.push("");
    setDates(newDates);
  };
  const handleUpdateTimeSlot = (dateIndex: number, slotIndex: number, value: string) => {
    const newDates = [...dates];
    newDates[dateIndex].timeSlots[slotIndex] = value;
    setDates(newDates);
  };
  const handleRemoveTimeSlot = (dateIndex: number, slotIndex: number) => {
    const newDates = [...dates];
    newDates[dateIndex].timeSlots = newDates[dateIndex].timeSlots.filter((_, i) => i !== slotIndex);
    setDates(newDates);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!slugManuallyEdited) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugManuallyEdited(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    // Append the URLs to the form data
    if (thumbnailUrl) formData.append("thumbnailUrl", thumbnailUrl);
    if (pdfUrl) formData.append("pdfUrl", pdfUrl);
    
    const validDates = dates.map(d => ({
      dateStr: d.dateStr,
      timeSlots: d.timeSlots.filter(t => t.trim() !== "")
    })).filter(d => d.dateStr.trim() !== "");

    formData.append("dates", JSON.stringify(validDates));

    try {
      let res;
      if (initialData?.id) {
        res = await updateCourse(initialData.id, formData);
      } else {
        res = await createCourse(formData);
      }

      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/admin/dashboard/gradewise-camps");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  // Removed legacy startDate parsing

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-semibold border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-primary-dark mb-1">Course Title</label>
          <input type="text" name="title" defaultValue={initialData?.title} onChange={handleTitleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-primary-dark mb-1">URL Slug</label>
          <input type="text" name="slug" value={slug} onChange={handleSlugChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50" />
          <p className="text-xs text-gray-400 mt-1">This will be the URL: /courses/{slug}</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-primary-dark mb-2">Course Description</label>
          <input type="hidden" name="description" value={description} />
          <TextEditor value={description} onChange={setDescription} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">Fee (USD)</label>
          <input type="number" step="0.01" name="fee" defaultValue={initialData?.fee} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">Category</label>
          <input type="text" name="category" value="Gradewise Group Camp" readOnly className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none bg-gray-100 text-gray-500 cursor-not-allowed" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">Duration (e.g., 4 Weeks)</label>
          <input type="text" name="duration" defaultValue={initialData?.duration} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">Class Mode (e.g., Online, In-Person)</label>
          <input type="text" name="classMode" defaultValue={initialData?.classMode} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">Daily Hours (e.g., 2 hrs/day)</label>
          <input type="text" name="dailyHours" defaultValue={initialData?.dailyHours} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>



        {/* Date and Timezone Handling Removed in favor of Dynamic Dates */}

        {/* Dynamic Dates and Nested Time Slots */}
        <div className="md:col-span-2 mt-4">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <H3 className="font-bold text-gray-800">Available Dates & Time Slots</H3>
              <button type="button" onClick={handleAddDate} className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                + Add Date
              </button>
            </div>
            
            <div className="space-y-6">
              {dates.map((dateObj, dateIndex) => (
                <div key={dateIndex} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                      <input 
                        type="text" 
                        value={dateObj.dateStr} 
                        onChange={(e) => handleUpdateDate(dateIndex, e.target.value)} 
                        placeholder="e.g. July 12 - July 16" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                      />
                    </div>
                    <button type="button" onClick={() => handleRemoveDate(dateIndex)} className="mt-6 text-red-500 hover:text-red-700 p-2 font-bold bg-red-50 rounded-lg">Remove</button>
                  </div>

                  <div className="pl-6 border-l-2 border-gray-100 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Slots for this Date</label>
                      <button type="button" onClick={() => handleAddTimeSlot(dateIndex)} className="text-xs text-primary font-bold hover:underline">
                        + Add Time Slot
                      </button>
                    </div>
                    
                    {dateObj.timeSlots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex gap-2">
                        <input 
                          type="text" 
                          value={slot} 
                          onChange={(e) => handleUpdateTimeSlot(dateIndex, slotIndex, e.target.value)} 
                          placeholder="e.g. 10:00 AM - 12:00 PM" 
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
                        />
                        <button type="button" onClick={() => handleRemoveTimeSlot(dateIndex, slotIndex)} className="text-red-400 hover:text-red-600 px-2 font-bold">X</button>
                      </div>
                    ))}
                    {dateObj.timeSlots.length === 0 && <p className="text-xs text-gray-400 italic">No time slots added for this date.</p>}
                  </div>
                </div>
              ))}
              {dates.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4 bg-white border border-dashed border-gray-300 rounded-xl">No dates added. Students won't see a date/time selection.</p>}
            </div>
          </div>
        </div>

        {/* Cloudinary Drag & Drop Media Uploads */}
        <div className="md:col-span-2 grid grid-cols-1 gap-6 mt-4">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
            <div className="mb-2">
              <span className="block text-sm font-semibold text-primary-dark">Course Thumbnail Image</span>
              <span className="text-xs text-gray-500">Recommended size: 800 x 450px (16:9 ratio). This ensures the image looks perfect on the website.</span>
            </div>
            <FileUploadDropzone 
              label="" 
              accept="image/*" 
              defaultUrl={thumbnailUrl} 
              folder="courses/thumbnails"
              onUploadSuccess={(url) => setThumbnailUrl(url)} 
              showImagePreviews={true}
            />
          </div>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
            <FileUploadDropzone 
              label="PDF Brochure / Syllabus" 
              accept="application/pdf" 
              defaultUrl={pdfUrl} 
              isPdf={true}
              folder="courses/syllabus"
              onUploadSuccess={(url) => setPdfUrl(url)} 
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Save Changes" : "Create Course"}
        </button>
      </div>
    </form>
  );
}
