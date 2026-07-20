"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import InquiryModal from "@/components/ui/InquiryModal";

import { FaHome, FaInfoCircle, FaSun, FaEnvelope, FaChalkboardTeacher, FaUsers, FaFileAlt } from "react-icons/fa";

export default function Header() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-primary flex justify-between items-center py-[9px] px-5 md:px-[80px]">
        <div className="logo">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <img src="/images/logo.png" alt="Logo" className="h-[40px] md:h-[55px] rounded-[10px]" />
            <span className="text-white font-bold text-sm md:text-xl lg:text-2xl tracking-wide hidden sm:block">Ignyto Tutoring</span>
          </Link>
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-primary py-1.5 px-3 md:py-[10px] md:px-[30px] text-xs md:text-base rounded-full font-bold shadow-md hover:bg-gray-100 transition-colors"
          >
            Free Trial
          </button>
          <Link href="/courses" className="bg-secondary text-black py-1.5 px-3 md:py-[10px] md:px-[30px] text-xs md:text-base rounded-full font-bold no-underline">
            Register
          </Link>
        </div>
      </div>

      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <nav className="bg-white flex justify-between items-center py-[8px] md:py-[15px] px-2 md:px-[80px] shadow-[0_-4px_15px_rgba(0,0,0,0.1)] md:shadow-[0_2px_10px_rgba(0,0,0,0.1)] fixed bottom-0 md:sticky md:top-0 left-0 w-full z-[1000] box-border">
        <ul className="list-none flex overflow-x-auto md:overflow-visible justify-start w-full gap-[8px] md:gap-[10px] p-1 md:p-0 m-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
          <li className="flex-none flex justify-center min-w-[72px] md:min-w-0">
            <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto ${pathname === '/' ? 'text-primary md:bg-primary-light md:text-primary font-bold' : 'hover:bg-primary-light hover:text-primary'}`}>
              <FaHome className="text-[22px] md:hidden mb-[2px]" />
              <span>Home</span>
            </Link>
          </li>
          <li className="flex-none flex justify-center min-w-[72px] md:min-w-0">
            <Link href="/#about" className="flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto hover:bg-primary-light hover:text-primary">
              <FaInfoCircle className="text-[22px] md:hidden mb-[2px]" />
              <span>About Us</span>
            </Link>
          </li>
          <li className="flex-none flex justify-center min-w-[76px] md:min-w-0">
            <Link href="/worksheets" className="flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto hover:bg-primary-light hover:text-primary">
              <FaFileAlt className="text-[22px] md:hidden mb-[2px]" />
              <span>Worksheets</span>
            </Link>
          </li>
          <li className="flex-none flex justify-center min-w-[76px] md:min-w-0">
            <Link href="/#summer-camps" className="flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto hover:bg-primary-light hover:text-primary">
              <FaSun className="text-[22px] md:hidden mb-[2px]" />
              <span className="text-center">Summer Camps</span>
            </Link>
          </li>
          <li className="flex-none flex justify-center min-w-[76px] md:min-w-0">
            <Link href="/#group-camps" className="flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto hover:bg-primary-light hover:text-primary">
              <FaUsers className="text-[22px] md:hidden mb-[2px]" />
              <span className="text-center">Grade Wise Camps</span>
            </Link>
          </li>
          <li className="flex-none flex justify-center min-w-[72px] md:min-w-0">
            <Link href="/#tutoring" className="flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto hover:bg-primary-light hover:text-primary">
              <FaChalkboardTeacher className="text-[22px] md:hidden mb-[2px]" />
              <span className="text-center hidden md:inline">Personalized Tutoring</span>
              <span className="text-center md:hidden">Tutoring</span>
            </Link>
          </li>
          <li className="flex-none flex justify-center min-w-[72px] md:min-w-0">
            <Link href="#contact" className="flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto hover:bg-primary-light hover:text-primary">
              <FaEnvelope className="text-[22px] md:hidden mb-[2px]" />
              <span className="text-center">Contact Us</span>
            </Link>
          </li>
        </ul>
      </nav>
      {/* Floating Overlay Free Trial Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-[80px] md:bottom-[40px] right-[15px] md:right-[20px] lg:right-[30px] bg-[#FFD700] text-black py-[8px] md:py-[10px] lg:py-[14px] px-[14px] md:px-[18px] lg:px-[26px] rounded-full font-bold shadow-[0_5px_20px_rgba(255,215,0,0.4)] z-[990] hover:scale-105 transition-all flex items-center gap-1.5 lg:gap-2 border-2 border-white text-xs md:text-sm lg:text-base animate-bounce-slow"
        style={{ animationDuration: '3s' }}
      >
        <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5 lg:h-3 lg:w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 lg:h-3 lg:w-3 bg-black"></span>
        </span>
        Book Free Trial
      </button>
    </>
  );
}
