"use client";

import { useState, useEffect } from "react";
import { FaSearchPlus, FaTimes } from "react-icons/fa";

export default function PreviewGalleryModal({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling and handle Escape key when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border-2 border-gray-200 flex flex-col h-full">
        <h3 suppressHydrationWarning className="text-2xl font-bold text-primary-dark mb-6">Worksheet Preview</h3>
        
        <div className="flex gap-6 mb-8 flex-1 items-center justify-center">
          {images.slice(0, 2).map((img, i) => (
            <div key={i} className="relative w-1/2 rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
              <img src={img} alt={`Preview ${i + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 w-full py-3 md:py-4 bg-white border-2 border-gray-200 text-primary-dark hover:border-primary hover:text-primary rounded-xl font-bold transition-all shadow-sm hover:shadow-md text-lg"
        >
          <FaSearchPlus /> View Full Preview
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center overflow-y-auto p-4 md:p-8 backdrop-blur-md"
          onClick={(e) => {
            // Close if clicking the background overlay
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="fixed top-24 right-4 md:top-28 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-xl transition-colors z-[10000] shadow-lg backdrop-blur-sm border border-white/20"
            aria-label="Close Preview"
          >
            <FaTimes />
          </button>
          
          <div className="max-w-4xl w-full space-y-6 md:space-y-12 py-32 md:py-40 my-auto flex flex-col items-center relative z-[105]">
            {images.map((img, i) => (
              <div key={i} className="w-full relative">
                <img src={img} alt={`Full preview ${i + 1}`} className="w-full h-auto rounded-xl shadow-2xl border border-white/10 bg-white" />
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-white/30 font-bold text-xl hidden md:block">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
