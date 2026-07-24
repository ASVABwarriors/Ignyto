"use client";

import { useState } from "react";
import InquiryModal from "./InquiryModal";

interface BookFreeTrialButtonProps {
  className?: string;
  text?: string;
}

export default function BookFreeTrialButton({ 
  className = "block text-center w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:bg-green-600 transition-colors",
  text = "Book a FREE Trial Lesson"
}: BookFreeTrialButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className={className}
      >
        {text}
      </button>
      <InquiryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
