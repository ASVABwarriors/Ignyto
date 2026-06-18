import { H2, H3 } from "@/components/ui/Heading";
import { FaBullseye, FaChalkboardTeacher, FaChartLine, FaTrophy, } from "react-icons/fa";
export default function About() {
  return (
    <section id="about" className="bg-primary-light py-[20px] md:py-[30px] pb-[50px] md:pb-[80px]">
      <div className="w-[90%] max-w-[1300px] mx-auto xl:grid xl:grid-cols-[1.4fr_0.9fr] gap-[40px] xl:gap-[50px] items-center">
        
        {/* Left side: Text Content */}
        <div>
          <div className="mb-[20px] md:mb-[30px]">
            <H2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] text-primary mt-0px mb-[5px] font-bold">
              About Us
            </H2>
            <H3 className="text-[16px] md:text-[18px] font-bold text-[#2563EB] tracking-wide">
              Inspiring Confidence. Igniting Potential.
            </H3>
          </div>
          
          <div className="p-0">
            <p className="text-[16px] md:text-[18px] leading-[1.6] md:leading-[1.8] text-[#333] mb-[20px] md:mb-[25px]">
              At IgNyto Tutoring, we believe every student can excel with the right guidance, support, and encouragement. 
              Through personalized tutoring, engaging summer camps, and enrichment programs, 
              we help students build confidence, strengthen skills, and achieve their academic goals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] md:gap-[18px] mt-[20px] md:mt-[30px]">
              {[
                { icon: <FaBullseye />, text: "Personalized Learning" },
                { icon: <FaChalkboardTeacher />, text: "Experts Mentors" },
                { icon: <FaChartLine />, text: "Measurable Progress" },
                { icon: <FaTrophy />, text: "Academic Excellence" }
              ].map((feature, i) => (
                <div key={i} className="bg-white px-[12px] py-[10px] md:px-[16px] md:py-[12px] rounded-[10px] md:rounded-[12px] font-semibold flex items-center gap-[8px] md:gap-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-[3px] hover:bg-primary hover:text-white group text-[13px] md:text-[15px]">
                  <span className="text-primary group-hover:text-white text-[18px] md:text-[22px]">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            {/*
            <p className="text-[16px] md:text-[18px] leading-[1.6] md:leading-[1.8] text-[#333] mb-[25px]">
              We believe every student has untapped potential. Through
              carefully designed competitions, quality learning resources,
              and expert guidance, we help students achieve academic excellence
              and build confidence for future success.
            </p> */}
          </div>
        </div>

        <div className="mt-[30px] xl:mt-0 flex justify-center xl:justify-end w-full">
          <div className="relative w-full max-w-[320px] md:max-w-[360px] group">
            <div className="absolute inset-0 border-[6px] border-transparent group-hover:border-primary rounded-[30px] z-10 transition-colors duration-300 pointer-events-none"></div>
            <img 
              src="https://res.cloudinary.com/dtpkdwlwv/image/upload/v1781783045/AboutUs_s0him0.png" 
              alt="About Olympiad Portal" 
              className="w-full h-auto object-contain rounded-[30px] transition-transform duration-700 group-hover:scale-[1.05]" 
            />
          </div>
        </div>

      </div>
    </section>
  );
}
