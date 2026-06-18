import { H2 } from "@/components/ui/Heading";
import Link from "next/link";
import { FaChalkboardTeacher, FaGraduationCap, FaBook, FaChartLine, FaMedal } from "react-icons/fa";

export default function Tutoring() {
  return (
    <section id="tutoring" className="py-[40px] md:py-[60px] pb-[50px] md:pb-[70px] bg-bg-light">
      <div className="w-[90%] max-w-[1300px] mx-auto xl:grid xl:grid-cols-[1.1fr_1fr] gap-[40px] md:gap-[70px] items-center">
        
        {/* LEFT CONTENT */}
        <div className="mb-[30px] md:mb-0 lg:mb-0">
          <div className="inline-flex items-center gap-[6px] md:gap-[10px] bg-primary-light text-primary px-[18px] md:px-[24px] py-[10px] md:py-[14px] rounded-[50px] text-[12px] md:text-[14px] font-semibold mb-[12px]">
            <FaChalkboardTeacher /> <span>Personalized Tutoring</span>
          </div>
          <H2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] text-text-dark leading-[1.2] md:leading-[1.15] font-bold mb-[12px]">
            Personalized Tutoring Sessions
          </H2>
          <p className="text-[16px] md:text-[18px] leading-[1.6] md:leading-[1.8] text-[#444] mb-[20px] md:mb-[25px]">
            Learn at your own pace with customized tutoring designed around your academic goals. 
            Our expert tutors provide individualized instruction, targeted practice, and continuous 
            support to help students build confidence, strengthen concepts, and achieve academic success.
            Whether your child needs help with school subjects, test preparation, or Olympiad competitions, 
            every session is tailored to maximize learning and results.
          </p>
          {/*
          <p className="text-[16px] md:text-[18px] leading-[1.6] md:leading-[1.8] text-[#444] mb-[20px] md:mb-[25px]">
            Plans Starting at $20/hour
          </p> */}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] md:gap-[18px] mt-[25px] md:mt-[35px]">
            {[
              { icon: <FaGraduationCap />, text: "Expert Mentors" },
              { icon: <FaBook />, text: "Concept Clarity" },
              { icon: <FaChartLine />, text: "Performance Tracking" },
              { icon: <FaMedal />, text: "Olympiad Excellence" }
            ].map((feature, i) => (
              <div key={i} className="bg-white px-[16px] py-[12px] md:px-[22px] md:py-[18px] rounded-[12px] md:rounded-[15px] font-semibold flex items-center gap-[10px] md:gap-[12px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-[5px] hover:bg-primary hover:text-white group text-[14px] md:text-[16px]">
                <span className="text-primary group-hover:text-white text-[18px] md:text-[22px]">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          <Link href="#" className="inline-block mt-[30px] md:mt-[40px] bg-primary text-white px-[30px] md:px-[38px] py-[14px] md:py-[16px] rounded-[50px] text-[16px] md:text-[18px] font-semibold transition-all duration-300 hover:bg-primary-dark hover:-translate-y-[4px]">
            Book A Free Demo
          </Link>
        </div>

        {/* RIGHT IMAGES */}
        {/* 🌟 EASY IMAGE SWAP 🌟
            Replace these 4 paths below with your full Cloudinary URLs. */}
        <div className="grid grid-cols-2 gap-[15px] md:gap-[40px]">
          {[
            "https://res.cloudinary.com/dtpkdwlwv/image/upload/v1781783467/PT2_i89unw.png",
            "https://res.cloudinary.com/dtpkdwlwv/image/upload/v1781783468/PT3_ld9fwe.png",
            "https://res.cloudinary.com/dtpkdwlwv/image/upload/v1781783467/PT4_s2gcar.png",
            "https://res.cloudinary.com/dtpkdwlwv/image/upload/v1781783467/PT2_i89unw.png"
          ].map((imgSrc, i) => (
            <div key={i} className={`overflow-hidden rounded-[15px] md:rounded-[25px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] md:shadow-[0_12px_25px_rgba(0,0,0,0.15)] relative ${i === 0 ? 'lg:translate-y-[30px]' : i === 3 ? 'lg:-translate-y-[30px]' : ''}`}>
              <img src={imgSrc} alt={`Tutor ${i + 1}`} className="w-full h-[140px] sm:h-[180px] md:h-[260px] object-cover transition-transform duration-500 ease-in-out hover:scale-[1.08]" />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
