"use client";

import { H3 } from "@/components/ui/Heading";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="bg-primary text-white mt-0 relative z-10 pb-[70px] md:pb-0">
      <div className="w-[90%] max-w-[1300px] mx-auto flex flex-col md:grid md:grid-cols-[1.2fr_1fr_1fr] gap-[30px] md:gap-[50px] py-[40px] md:py-[50px] md:pb-[35px]">
        
        {/* LOGO */}
        <div>
          <div className="mb-[15px] md:mb-[20px]">
            <img src="/images/logo.png" alt="Ignyto Tutoring Logo" className="w-[150px] md:w-[200px] lg:w-[240px] h-auto block rounded-[20px]" />
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <H3 className="text-[18px] md:text-[20px] mb-[10px] font-semibold">Quick Links</H3>
          <ul className="list-none m-0 p-0">
            <li className="mb-[8px]">
              <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white no-underline text-[14px] md:text-[15px] transition-all duration-300 hover:pl-[8px] hover:opacity-90">Home</Link>
            </li>
            <li className="mb-[8px]">
              <Link href="#about" className="text-white no-underline text-[14px] md:text-[15px] transition-all duration-300 hover:pl-[8px] hover:opacity-90">About Us</Link>
            </li>
            <li className="mb-[8px]">
              <Link href="#summer-camps" className="text-white no-underline text-[14px] md:text-[15px] transition-all duration-300 hover:pl-[8px] hover:opacity-90">Summer Camps</Link>
            </li>

            <li className="mb-[8px]">
              <Link href="#tutoring" className="text-white no-underline text-[14px] md:text-[15px] transition-all duration-300 hover:pl-[8px] hover:opacity-90">Personalized Tutoring</Link>
            </li>
            <li className="mb-[8px]">
              <Link href="#contact" className="text-white no-underline text-[14px] md:text-[15px] transition-all duration-300 hover:pl-[8px] hover:opacity-90">Contact Us</Link>
            </li>

          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <H3 className="text-[18px] md:text-[20px] mb-[15px] font-semibold">Contact Us</H3>
          <div>
            <p className="text-[14px] md:text-[15px] leading-[1.6] mb-[9px]">
              <strong>Email:</strong>{" "}
              <a href="mailto:info.ignyto@gmail.com" className="text-white no-underline hover:underline break-all">
                info.ignyto@gmail.com
              </a>
            </p>
            <div className="flex flex-wrap items-center gap-[10px] text-[14px] md:text-[15px] leading-[1.6] mt-[12px]">
              <strong>Call/WhatsApp:</strong>
              <a 
                href="https://wa.me/917720077480" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-[6px] bg-[#25D366] text-white px-[14px] py-[6px] rounded-[50px] text-[13px] md:text-[14px] font-bold transition-transform hover:-translate-y-[2px] shadow-sm"
              >
                <i className="fab fa-whatsapp text-[16px]"></i> +91 77200 77480
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className="w-full border-t border-white/20">
        <div className="w-[90%] max-w-[1300px] mx-auto flex flex-col md:flex-row justify-between items-center py-[15px] md:py-[20px] text-[12px] md:text-[14px] gap-3">
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} Ignyto Tutoring. All Rights Reserved.
          </div>
          <div className="text-center md:text-right">
            Crafted by <a href="https://www.nirmeva.com" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-white">Nirmeva</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
