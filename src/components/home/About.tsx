import { H2, H3 } from "@/components/ui/Heading";
export default function About() {
  return (
    <section id="about" className="bg-primary-light py-[40px] md:py-[60px] pb-[60px] md:pb-[100px]">
      <div className="w-[90%] max-w-[1300px] mx-auto">
        <div className="mb-[25px] md:mb-[40px]">
          <span className="text-[12px] md:text-[14px] font-bold tracking-[2px] text-primary relative after:content-[''] after:w-[40px] md:after:w-[60px] after:h-[2px] after:bg-primary after:absolute after:top-1/2 after:ml-[12px]">
            OLYMPIAD PORTAL
          </span>
          <H2 className="text-[32px] md:text-[42px] text-primary mt-[10px] mb-[10px] font-bold">
            About Us
          </H2>
        </div>
        
        <div className="p-0">
          <H3 className="text-[20px] md:text-[24px] text-primary mb-[20px] md:mb-[30px] font-bold">
            Welcome To Olympiad Portal
          </H3>
          <p className="text-[16px] md:text-[18px] leading-[1.6] md:leading-[1.8] text-[#333] mb-[20px] md:mb-[25px] max-w-[1100px]">
            Are you tired of the mundane and predictable questions that plague
            most Olympiad examinations? If you're looking for a refreshing
            change, you've come to the right place! Our Olympiad Portal is
            designed to inspire students with innovative challenges that
            strengthen conceptual understanding and analytical thinking.
          </p>
          <p className="text-[16px] md:text-[18px] leading-[1.6] md:leading-[1.8] text-[#333] mb-[25px] max-w-[1100px]">
            We believe every student has untapped potential. Through
            carefully designed competitions, quality learning resources,
            and expert guidance, we help students achieve academic excellence
            and build confidence for future success.
          </p>
        </div>
      </div>
    </section>
  );
}
