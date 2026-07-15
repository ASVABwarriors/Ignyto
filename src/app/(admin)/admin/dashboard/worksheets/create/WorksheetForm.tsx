"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWorksheet, updateWorksheet } from "../actions";
import { getCloudinarySignature } from "@/app/(admin)/admin/dashboard/courses/uploadActions";
import FileUploadDropzone from "@/components/ui/FileUploadDropzone";
import TextEditor from "@/components/ui/TextEditor";

export default function WorksheetForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");
  const [heroImage, setHeroImage] = useState(initialData?.heroImage || "");
  const [conceptImage, setConceptImage] = useState(initialData?.conceptImage || "");
  
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData?.slug);
  const [learningObjectives, setLearningObjectives] = useState(initialData?.learningObjectives || "");
  const [downloadFeatures, setDownloadFeatures] = useState(initialData?.downloadFeatures || "");
  
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [previewImages, setPreviewImages] = useState<string[]>(initialData?.previewImages || []);
  const [isUploadingPreviews, setIsUploadingPreviews] = useState(false);

  const handleMultipleUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploadingPreviews(true);
    try {
      const { timestamp, signature, cloudName, apiKey, folder: signedFolder } = await getCloudinarySignature("worksheets/previews");
      
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey!);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", signedFolder);
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          return data.secure_url as string;
        }
        return null;
      });
      
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => !!url);
      if (validUrls.length > 0) {
        setPreviewImages(prev => [...prev, ...validUrls]);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to upload preview images.");
    } finally {
      setIsUploadingPreviews(false);
    }
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

    if (!pdfUrl) {
      setError("Please upload a PDF worksheet.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("pdfUrl", pdfUrl);
    if (heroImage) formData.append("heroImage", heroImage);
    if (conceptImage) formData.append("conceptImage", conceptImage);
    formData.append("learningObjectives", learningObjectives);
    formData.append("downloadFeatures", downloadFeatures);
    formData.append("isFeatured", String(isFeatured));
    formData.append("previewImages", JSON.stringify(previewImages));

    try {
      let res;
      if (initialData?.id) {
        res = await updateWorksheet(initialData.id, formData);
      } else {
        res = await createWorksheet(formData);
      }

      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/admin/dashboard/worksheets");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-semibold border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Hero Left Side */}
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-primary-dark mb-1">Worksheet Title</label>
          <input type="text" name="title" defaultValue={initialData?.title} onChange={handleTitleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. Grade 5 Equivalent Fractions Worksheet" />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-primary-dark mb-1">URL Slug</label>
          <input type="text" name="slug" value={slug} onChange={handleSlugChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-primary-dark mb-1">Description (Subtitle)</label>
          <input type="text" name="description" defaultValue={initialData?.description} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. Help your child master equivalent fractions with confidence!" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">Grade (Meta Pill 1)</label>
          <input type="text" name="grade" defaultValue={initialData?.grade} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. Grade 5" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">Estimated Time (Meta Pill 2)</label>
          <input type="text" name="estimatedTime" defaultValue={initialData?.estimatedTime} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. 25-30 min" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">Question Count (Meta Pill 3)</label>
          <input type="text" name="questionCount" defaultValue={initialData?.questionCount} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. 30 Questions" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-dark mb-1">PDF Page Count (Download Button)</label>
          <input type="text" name="pdfPageCount" defaultValue={initialData?.pdfPageCount} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. 2 Pages" />
        </div>

        {/* Section 1: Hero Right Side */}
        <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-bold text-primary-dark mb-4">Hero Section (Right Side)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
              <FileUploadDropzone 
                label="Hero Character Image" 
                accept="image/*" 
                defaultUrl={heroImage} 
                folder="worksheets/images"
                onUploadSuccess={(url) => setHeroImage(url)} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-2">Download Box Features (One per line)</label>
              <textarea 
                value={downloadFeatures} 
                onChange={(e) => setDownloadFeatures(e.target.value)} 
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-40" 
                placeholder={"30 Practice Questions\nEquivalent Fractions\nSimplifying Fractions"} 
              />
            </div>
          </div>
        </div>

        {/* PDF Upload */}
        <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-bold text-primary-dark mb-4">The PDF File</h3>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
            <FileUploadDropzone 
              label="Worksheet PDF (Download File)" 
              accept="application/pdf" 
              defaultUrl={pdfUrl} 
              isPdf={true}
              folder="worksheets/pdf"
              onUploadSuccess={(url) => setPdfUrl(url)} 
            />
          </div>
        </div>

        {/* Section 2: Concept Image & Previews */}
        <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-bold text-primary-dark mb-4">Preview Images (Gallery)</h3>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm w-full mb-6">
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {previewImages.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white aspect-[3/4]">
                    <img src={img} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setPreviewImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow">X</button>
                  </div>
                ))}
              </div>
            )}
            
            <div 
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files) handleMultipleUpload(e.dataTransfer.files);
              }}
              className="w-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 rounded-2xl p-8 text-center cursor-pointer transition-colors relative"
            >
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={(e) => { if (e.target.files) handleMultipleUpload(e.target.files); }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploadingPreviews}
              />
              <div className="text-gray-500 mb-3">
                <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <p className="font-semibold text-gray-700 text-lg">{isUploadingPreviews ? "Uploading..." : "Click or drag multiple images here"}</p>
              <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG, GIF</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-primary-dark mb-4">Concept Section</h3>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
            <FileUploadDropzone 
              label="Concept Explanation Image" 
              accept="image/*" 
              defaultUrl={conceptImage} 
              folder="worksheets/images"
              onUploadSuccess={(url) => setConceptImage(url)} 
            />
          </div>
        </div>

        {/* Section 3: Learning Objectives */}
        <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-bold text-primary-dark mb-4">What Students Will Learn Section</h3>
          <label className="block text-sm font-semibold text-primary-dark mb-2">Learning Objectives (Rich Text)</label>
          <TextEditor value={learningObjectives} onChange={setLearningObjectives} />
        </div>
        
        {/* Settings */}
        <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 p-6 rounded-2xl border-gray-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-primary-dark">Featured Worksheet</h3>
            <p className="text-sm text-gray-500">Show this worksheet in the bottom "Explore More" strip on worksheet pages.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Save Changes" : "Create Worksheet"}
        </button>
      </div>
    </form>
  );
}
