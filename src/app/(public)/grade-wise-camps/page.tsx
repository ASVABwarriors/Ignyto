import { prisma } from "@/lib/prisma";
import { H2 } from "@/components/ui/Heading";
import GradeWiseCampCard from "@/components/ui/GradeWiseCampCard";

export const dynamic = "force-dynamic";

export default async function GradeWiseCampsPage() {
  const gradeWiseCamps = await prisma.gradeWiseCamp.findMany({
    where: { category: "Group Camp" },
    include: {
      dates: {
        orderBy: { dateStr: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-bg-light min-h-screen py-[60px] md:py-[100px]">
      <div className="w-[90%] max-w-[1300px] mx-auto">
        <div className="mb-[60px] text-center">
          <span className="text-[12px] md:text-[14px] font-bold tracking-[2px] text-primary relative after:content-[''] after:w-[40px] md:after:w-[60px] after:h-[2px] after:bg-primary after:absolute after:top-1/2 after:ml-[12px] before:content-[''] before:w-[40px] md:before:w-[60px] before:h-[2px] before:bg-primary before:absolute before:top-1/2 before:-translate-x-full before:-ml-[12px]">
            COLLABORATIVE LEARNING
          </span>
          <H2 className="text-[clamp(1.75rem,4vw,2.75rem)] text-primary mt-[15px] mb-[15px] font-bold">
            Explore All Grade Wise Camps
          </H2>
          <p className="text-[16px] md:text-[20px] text-[#555] max-w-[700px] mx-auto">
            Discover our comprehensive range of group-based academic programs designed to foster collaboration and teamwork.
          </p>
        </div>

        {gradeWiseCamps.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <h3 className="text-2xl font-bold text-gray-500 mb-2">No camps found</h3>
            <p className="text-gray-400">Check back later for upcoming programs!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] lg:gap-[40px]">
            {gradeWiseCamps.map((gradeWiseCamp) => (
              <GradeWiseCampCard key={gradeWiseCamp.id} course={gradeWiseCamp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
