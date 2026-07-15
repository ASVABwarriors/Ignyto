"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { FaFilePdf, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Worksheet {
  id: string;
  title: string;
  slug: string;
}

interface WorksheetCarouselProps {
  worksheets: Worksheet[];
}

export default function WorksheetCarousel({ worksheets }: WorksheetCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (worksheets.length === 0) return null;

  return (
    <div className="relative w-full group px-6 md:px-14 py-4">
      {/* Left Button */}
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 text-gray-600 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors focus:outline-none hidden md:flex"
        aria-label="Scroll left"
      >
        <FaChevronLeft />
      </button>

      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory py-4 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {worksheets.map((w) => (
          <div key={w.id} className="min-w-[200px] md:min-w-[240px] max-w-[280px] flex-shrink-0 snap-start">
            <Link 
              href={`/worksheets/${w.slug}`}
              className="block bg-white hover:bg-primary-light border border-gray-200 hover:border-primary p-6 rounded-2xl text-center group/card transition-all h-full flex flex-col items-center justify-center shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-primary shadow-sm mb-4 group-hover/card:scale-110 transition-transform">
                <FaFilePdf size={20} />
              </div>
              <h4 suppressHydrationWarning className="font-bold text-primary-dark text-sm mb-4 leading-tight min-h-[40px] flex items-center justify-center">{w.title}</h4>
              <div className="w-full mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs text-secondary font-bold group-hover/card:text-primary transition-colors block border border-gray-200 rounded-lg py-2">
                  View Worksheet
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 text-gray-600 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors focus:outline-none hidden md:flex"
        aria-label="Scroll right"
      >
        <FaChevronRight />
      </button>

      {/* Hide scrollbar styles for WebKit */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </div>
  );
}
