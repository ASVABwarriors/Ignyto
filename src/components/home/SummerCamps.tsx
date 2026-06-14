import { H2, H3 } from "@/components/ui/Heading";
import Link from "next/link";
import { Course, CourseDate } from "@prisma/client";
import { formatCourseDateShort } from "@/lib/formatTime";
import CourseCard from "@/components/ui/CourseCard";

type ExtendedCourse = Course & { dates?: CourseDate[] };

export default function SummerCamps({ courses }: { courses: ExtendedCourse[] }) {
  const displayCourses = courses.slice(0, 4);
  const hasMore = courses.length > 4;

  return (
    <section id="summer-camps" className="w-[90%] max-w-[1400px] mx-auto my-[80px]">
      <div className="mb-[40px]">
        <span className="text-[12px] md:text-[14px] font-bold tracking-[2px] text-primary relative after:content-[''] after:w-[40px] md:after:w-[60px] after:h-[2px] after:bg-primary after:absolute after:top-1/2 after:ml-[12px]">
          THE FUTURE OF LEARNING
        </span>
        <H2 className="text-[32px] md:text-[42px] text-primary mt-[10px] mb-[10px] font-bold">
          Summer Camps
        </H2>
        <p className="text-[16px] md:text-[18px] text-[#555]">
          Challenge your logic and skills with our premier academic competitions.
        </p>
      </div>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-[20px] md:gap-[25px] lg:gap-[30px] pt-4 pb-4 -mt-4 scrollbar-hide mx-auto">
        {displayCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="mt-[40px] text-center">
        <Link href="/courses" className="inline-block bg-white text-primary border-2 border-primary py-[12px] px-[40px] rounded-[30px] font-bold no-underline transition-all hover:bg-primary hover:text-white">
          View All Camps
        </Link>
      </div>
    </section>
  );
}
