import { H2, H3 } from "@/components/ui/Heading";
export default function About() {
  return (
    <section id="about" className="bg-primary-light py-[20px] md:py-[30px]">
      <div className="w-[90%] max-w-[1300px] mx-auto xl:grid xl:grid-cols-[1.2fr_1fr] gap-[40px] xl:gap-[60px] items-center">
        
        {/* Left side: Text Content */}
        <div>
          <div className="mb-[20px] md:mb-[30px]">
            <H2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] text-primary mt-0px mb-[5px] font-bold">
              About Us
            </H2>
            <h3 className="text-[16px] md:text-[18px] font-bold text-[#2563EB] tracking-wide">
              Inspiring Confidence. Igniting Potential.
            </h3>
          </div>
          
          <div className="p-0">
            <p className="text-[16px] md:text-[18px] leading-[1.6] md:leading-[1.8] text-[#333] mb-[20px] md:mb-[25px]">
              Are you tired of the mundane and predictable questions that plague most Olympiad examinations? If you're looking for a refreshing
              change, you've come to the right place! Our Olympiad Portal is
              designed to inspire students with innovative challenges that
              strengthen conceptual understanding and analytical thinking.
            </p>
            <p className="text-[16px] md:text-[18px] leading-[1.6] md:leading-[1.8] text-[#333] mb-[25px]">
              We believe every student has untapped potential. Through
              carefully designed competitions, quality learning resources,
              and expert guidance, we help students achieve academic excellence
              and build confidence for future success.
            </p>
          </div>
        </div>

        <div className="mt-[30px] xl:mt-0 flex justify-center xl:justify-end w-full">
          <div className="relative w-full max-w-[400px] md:max-w-[450px] group">
            <div className="absolute inset-0 border-[6px] border-transparent group-hover:border-primary rounded-[30px] z-10 transition-colors duration-300 pointer-events-none"></div>
            <img 
              src="https://res.cloudinary.com/dtpkdwlwv/image/upload/v1781437035/Ignyto_logo_stprab.png" 
              alt="About Olympiad Portal" 
              className="w-full h-auto object-contain rounded-[30px] transition-transform duration-700 group-hover:scale-[1.05]" 
            />
          </div>
        </div>

      </div>
    </section>
  );
}
