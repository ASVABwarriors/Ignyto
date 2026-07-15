import { H2, H3 } from "@/components/ui/Heading";
import Link from "next/link";
import { GradeWiseCamp, GradeWiseCampDate } from "@prisma/client";
import { formatCourseDateShort } from "@/lib/formatTime";
import GradeWiseCampCard from "@/components/ui/GradeWiseCampCard";

type ExtendedGradeWiseCamp = GradeWiseCamp & { dates?: GradeWiseCampDate[] };

export default function GradeWiseCamps({ gradeWiseCamps }: { gradeWiseCamps: ExtendedGradeWiseCamp[] }) {
  const displayGradeWiseCamps = gradeWiseCamps.slice(0, 4);
  const hasMore = gradeWiseCamps.length > 4;

  return (
    <section id="group-camps" className="w-[90%] max-w-[1400px] mx-auto mt-[80px] mb-[30px] md:mb-[40px]">
      <div className="mb-[40px]">
        <span className="text-[12px] md:text-[14px] font-bold tracking-[2px] text-primary relative after:content-[''] after:w-[40px] md:after:w-[60px] after:h-[2px] after:bg-primary after:absolute after:top-1/2 after:ml-[12px]">
          COLLABORATIVE LEARNING
        </span>
        <H2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] text-primary mt-[10px] mb-[10px] font-bold">
          Grade Wise Camps
        </H2>
        <p className="text-[16px] md:text-[18px] text-[#555]">
          Join our group sessions to learn and grow together with peers.
        </p>
      </div>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-[20px] md:gap-[25px] lg:gap-[30px] pt-4 pb-4 -mt-4 scrollbar-hide mx-auto">
        {displayGradeWiseCamps.map((gradeWiseCamp) => (
          <GradeWiseCampCard key={gradeWiseCamp.id} course={gradeWiseCamp} />
        ))}
      </div>

      <div className="mt-[40px] text-center">
        <Link href="/grade-wise-camps" className="inline-block bg-white text-primary border-2 border-primary py-[12px] px-[40px] rounded-[30px] font-bold no-underline transition-all hover:bg-primary hover:text-white">
          View All Grade Wise Camps
        </Link>
      </div>
    </section>
  );
}
