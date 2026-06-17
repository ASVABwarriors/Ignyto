"use client";

import { useState, useEffect } from "react";
import { Faq } from "@prisma/client";
import { H2 } from "@/components/ui/Heading";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Faqs({ initialFaqs }: { initialFaqs?: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs || []);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (initialFaqs) return; // Skip fetch if we already have the data
    const fetchFaqs = async () => {
      try {
        const res = await fetch("/api/faqs");
        if (res.ok) {
          const data = await res.json();
          setFaqs(data.filter((f: Faq) => f.isActive));
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      }
    };
    fetchFaqs();
  }, [initialFaqs]);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="w-full bg-[#e8effa] py-[60px] md:py-[80px] px-4">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-[40px] md:gap-[60px]">
        
        {/* Left Side: Title & Description */}
        <div className="lg:col-span-2 flex flex-col justify-start">
          <p className="text-gray-800 font-bold text-lg mb-2">Have Any Questions?</p>
          <H2 className="text-[40px] md:text-[50px] font-black text-black mb-6 leading-none">FAQs</H2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-8">
            Explore answers to frequently asked questions about our online courses, registration, and more to guide you through your learning journey with Ignyto Tutoring.
          </p>
        </div>

        {/* Right Side: Accordion */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[25px] p-2 md:p-6 shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col gap-2">
            {faqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`border border-gray-100 rounded-[15px] overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md' : 'hover:bg-gray-50'}`}
                >
                  <button 
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-[15px] md:p-[20px] text-left focus:outline-none"
                  >
                    <span className="font-semibold text-gray-800 text-[14px] md:text-[16px] pr-4">{faq.question}</span>
                    <span className="text-primary-dark shrink-0">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-[15px] md:p-[20px] pt-0 text-gray-600 text-[14px] md:text-[15px] leading-relaxed border-t border-gray-50 mt-2">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
