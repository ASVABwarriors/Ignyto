import { H2, H3 } from "@/components/ui/Heading";
import Link from "next/link";
import { Course, CourseDate } from "@prisma/client";
import { formatCourseDateShort } from "@/lib/formatTime";
import { FaCalendarAlt, FaRegClock, FaMoneyBillWave, FaBullseye, FaUsers, FaFilePdf } from "react-icons/fa";

type ExtendedCourse = Course & { dates?: CourseDate[] };

export default function SummerCamps({ courses }: { courses: ExtendedCourse[] }) {
  const displayCourses = courses.slice(0, 3);
  const hasMore = courses.length > 3;

  return (
    <section id="summer-camps" className="w-[90%] max-w-[1300px] mx-auto my-[80px]">
      <div className="mb-[40px]">
        <span className="text-[14px] font-bold tracking-[2px] text-primary relative after:content-[''] after:w-[60px] after:h-[2px] after:bg-primary after:absolute after:top-1/2 after:ml-[12px]">
          THE FUTURE OF LEARNING
        </span>
        <H2 className="text-[55px] text-primary mt-[8px] mb-[10px] md:text-[42px] font-bold">
          Summer Camps
        </H2>
        <p className="text-[18px] text-[#555]">
          Challenge your logic and skills with our premier academic competitions.
        </p>
      </div>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 gap-[20px] md:gap-[25px] pb-4 scrollbar-hide">
        {displayCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-[20px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 min-w-[85vw] sm:min-w-[320px] lg:w-full snap-center shrink-0">
            <div className="card-image">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-[180px] md:h-[200px] object-cover block" />
              ) : course.imageName ? (
                <img src={`/images/${course.imageName}`} alt={course.title} className="w-full h-[180px] md:h-[200px] object-cover block" />
              ) : (
                <div className="w-full h-[180px] md:h-[200px] bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            
            <div className="p-[15px] md:p-[18px]">
              <H3 className="text-primary-dark text-[24px] md:text-[30px] font-bold mb-2">{course.title}</H3>
              
              <div className="mb-[15px] space-y-1 md:space-y-2 text-[#555] text-[14px] md:text-[16px]">
                <p className="flex items-center gap-2"><FaCalendarAlt className="text-primary shrink-0" /> {course.duration}</p>
                <p className="flex items-center gap-2"><FaRegClock className="text-primary shrink-0" /> {course.dailyHours}</p>
                <p className="flex items-center gap-2 text-primary-dark text-[18px] md:text-[22px] font-bold mt-2 mb-2">
                  ${course.fee} per Week
                </p>
                {course.dates && course.dates.length > 0 && (
                  <span className="flex items-center gap-1.5"><FaCalendarAlt className="shrink-0" /> Starts: {course.dates[0].dateStr}</span>
                )}
                <p className="flex items-center gap-2"><FaBullseye className="text-primary shrink-0" /> {course.category}</p>
                <p className="flex items-center gap-2"><FaUsers className="text-primary shrink-0" /> {course.classMode}</p>
              </div>

              {course.pdfUrl && (
                <a 
                  href={course.pdfUrl} 
                  target="_blank"
                  download
                  rel="noreferrer"
                  className="flex items-center gap-2 no-underline text-primary mb-[12px] font-semibold transition-colors hover:text-primary-dark text-[14px] md:text-[16px]"
                >
                  <FaFilePdf /> Download Syllabus
                </a>
              )}
              <Link href={`/course/${course.slug}`} className="block no-underline text-primary mb-[15px] font-bold text-[14px] md:text-[16px]">
                View Details
              </Link>
              <Link href={`/course/${course.slug}`} className="block text-center bg-primary text-white p-[10px] md:p-[12px] rounded-[10px] no-underline font-bold transition-opacity hover:opacity-90 text-[14px] md:text-[16px]">
                Enroll Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-[30px] text-center">
          <Link href="/courses" className="inline-block bg-white text-primary border-2 border-primary py-[12px] px-[40px] rounded-[30px] font-bold no-underline transition-all hover:bg-primary hover:text-white">
            View All Camps
          </Link>
        </div>
      )}
    </section>
  );
}
