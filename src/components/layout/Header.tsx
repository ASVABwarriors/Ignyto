"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaHome, FaInfoCircle, FaSun, FaEnvelope, FaChalkboardTeacher } from "react-icons/fa";

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      <div className="bg-primary flex justify-between items-center py-[9px] px-5 md:px-[80px]">
        <div className="logo">
          <Link href="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="h-[55px] rounded-[10px]" />
            <span className="text-white font-bold text-xl md:text-xl lg:text-2xl tracking-wide">Ignyto Tutoring</span>
          </Link>
        </div>
        <Link href="/courses" className="bg-secondary text-black py-[10px] px-[30px] rounded-[30px] font-bold no-underline hidden md:block">
          Register Now
        </Link>
      </div>

      <nav className="bg-white flex justify-between items-center py-[8px] md:py-[15px] px-2 md:px-[80px] shadow-[0_-4px_15px_rgba(0,0,0,0.1)] md:shadow-[0_2px_10px_rgba(0,0,0,0.1)] fixed bottom-0 md:sticky md:top-0 left-0 w-full z-[1000] box-border">
        <ul className="list-none flex justify-around md:justify-start w-full gap-[2px] md:gap-[10px] p-0 m-0">
          <li className="flex-1 md:flex-none flex justify-center">
            <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto ${pathname === '/' ? 'text-primary md:bg-primary-light md:text-primary font-bold' : 'hover:bg-primary-light hover:text-primary'}`}>
              <FaHome className="text-[22px] md:hidden mb-[2px]" />
              <span>Home</span>
            </Link>
          </li>
          <li className="flex-1 md:flex-none flex justify-center">
            <Link href="/#about" className="flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto hover:bg-primary-light hover:text-primary">
              <FaInfoCircle className="text-[22px] md:hidden mb-[2px]" />
              <span>About Us</span>
            </Link>
          </li>
          <li className="flex-1 md:flex-none flex justify-center">
            <Link href="/#summer-camps" className="flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto hover:bg-primary-light hover:text-primary">
              <FaSun className="text-[22px] md:hidden mb-[2px]" />
              <span className="text-center">Summer Camps</span>
            </Link>
          </li>
          <li className="flex-1 md:flex-none flex justify-center">
            <Link href="/#tutoring" className="flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto hover:bg-primary-light hover:text-primary">
              <FaChalkboardTeacher className="text-[22px] md:hidden mb-[2px]" />
              <span className="text-center hidden md:inline">Personalized Tutoring</span>
              <span className="text-center md:hidden">Tutoring</span>
            </Link>
          </li>
          <li className="flex-1 md:flex-none flex justify-center">
            <Link href="#contact" className="flex flex-col md:flex-row items-center justify-center gap-1 text-[#333] text-[11px] md:text-[12px] lg:text-[13px] xl:text-[15px] font-semibold py-[6px] md:py-[10px] px-[5px] md:px-[14px] rounded-[10px] transition-all duration-300 w-full md:w-auto hover:bg-primary-light hover:text-primary">
              <FaEnvelope className="text-[22px] md:hidden mb-[2px]" />
              <span className="text-center">Contact Us</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
