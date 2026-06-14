"use client";

import { useState, useRef, useEffect } from "react";
import { getCloudinarySignature } from "@/app/(admin)/admin/dashboard/courses/uploadActions";

interface FileUploadDropzoneProps {
  label: string;
  accept: string;
  onUploadSuccess: (url: string) => void;
  defaultUrl?: string;
  isPdf?: boolean;
  folder?: string;
  showImagePreviews?: boolean;
}

export default function FileUploadDropzone({ label, accept, onUploadSuccess, defaultUrl, isPdf, folder, showImagePreviews }: FileUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(defaultUrl || "");
  const [error, setError] = useState("");
  
  const [fileSize, setFileSize] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [fileName, setFileName] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [dimensions, setDimensions] = useState<{width: number, height: number} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    setError("");
    setIsUploading(true);
    setUploadProgress(0);
    setFileSize(file.size);
    setUploadedBytes(0);
    setFileName(file.name);

    if (file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setLocalPreview(objectUrl);
      
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = objectUrl;
    } else {
      setLocalPreview("");
      setDimensions(null);
    }

    try {
      const { timestamp, signature, cloudName, apiKey, folder: signedFolder } = await getCloudinarySignature(folder || "ignyto_courses");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey!);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", signedFolder);

      const xhr = new XMLHttpRequest();
      const resourceType = isPdf ? "raw" : "auto";
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
          setUploadedBytes(e.loaded);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploadedUrl(response.secure_url);
          onUploadSuccess(response.secure_url);
          setIsUploading(false);
        } else {
          setError("Upload failed. Please try again.");
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        setError("Network error occurred during upload.");
        setIsUploading(false);
      };

      xhr.send(formData);

    } catch (err) {
      console.error(err);
      setError("Failed to initialize upload.");
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const currentPreviewUrl = localPreview || uploadedUrl;

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-primary-dark mb-2">{label}</label>
      
      {error && <p className="text-red-500 text-sm mb-2 font-medium">{error}</p>}

      {/* Uploading Progress */}
      {isUploading && (
        <div className="w-full border border-primary-light rounded-2xl p-6 bg-blue-50/30 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-primary-dark">
              {uploadProgress === 100 ? `Processing ${fileName}...` : `Uploading ${fileName}...`}
            </span>
            <span className="text-sm font-bold text-primary">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>{formatBytes(uploadedBytes)}</span>
            <span>{formatBytes(fileSize)}</span>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {currentPreviewUrl && (
        <div className="mb-4 flex items-start gap-6 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
          {isPdf ? (
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
              PDF
            </div>
          ) : (
            <img src={currentPreviewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm shrink-0" />
          )}
          
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 truncate" title={fileName || "Uploaded File"}>{fileName || "Uploaded File"}</p>
            <div className="flex flex-col gap-1 mt-2 text-sm text-gray-500">
              {fileSize > 0 && <p><span className="font-semibold text-gray-600">Size:</span> {formatBytes(fileSize)}</p>}
              {dimensions && !isPdf && (
                <div className="space-y-1">
                  <p><span className="font-semibold text-gray-600">Dimensions:</span> {dimensions.width} x {dimensions.height} px</p>
                  {showImagePreviews && (
                    <div className="mt-1">
                      {Math.abs((dimensions.width / dimensions.height) - (16/9)) < 0.05 ? (
                        <span className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md text-xs border border-green-200">
                          ✅ Perfect 16:9 Aspect Ratio!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md text-xs border border-amber-200">
                          ⚠️ Aspect Ratio is {(dimensions.width / dimensions.height).toFixed(2)}:1 (Recommended 1.77:1)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {uploadedUrl && !isUploading && (
              <a href={uploadedUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium text-xs mt-3 inline-block break-all">
                View File →
              </a>
            )}
          </div>

          {!isUploading && (
            <button 
              type="button"
              onClick={() => { 
                setUploadedUrl(""); 
                setLocalPreview(""); 
                setFileName(""); 
                setFileSize(0); 
                setDimensions(null); 
                onUploadSuccess(""); 
              }}
              className="text-xs text-red-500 font-semibold hover:underline bg-red-50 px-3 py-1.5 rounded-lg whitespace-nowrap self-start"
            >
              Remove
            </button>
          )}
        </div>
      )}

      {/* Extended Previews */}
      {currentPreviewUrl && showImagePreviews && !isPdf && !isUploading && (
        <div className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
          <p className="text-sm font-bold text-gray-700 border-b border-gray-200 pb-2">Live Previews</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Preview */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Thumbnail View (Course Card)</p>
              <div className="w-full max-w-[300px] aspect-video rounded-[20px] overflow-hidden border border-gray-200 shadow-sm bg-white mx-auto md:mx-0">
                <img src={currentPreviewUrl} className="w-full h-full object-cover" alt="Thumbnail Preview" />
              </div>
            </div>

            {/* Banner Preview */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Details View (Banner)</p>
              <div className="w-full aspect-video max-h-[150px] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white mx-auto md:mx-0">
                <img src={currentPreviewUrl} className="w-full h-full object-cover" alt="Banner Preview" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dropzone */}
      {!currentPreviewUrl && !isUploading && (
        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary-light/20' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}
          `}
        >
          <div className="text-gray-500 mb-3">
            <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </div>
          <p className="font-semibold text-gray-700 text-lg">Click or drag file here</p>
          <p className="text-sm text-gray-400 mt-2">Supports {isPdf ? 'PDF' : 'JPG, PNG, GIF'} files up to high resolutions</p>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileSelect} 
        accept={accept} 
        className="hidden" 
      />
    </div>
  );
}
