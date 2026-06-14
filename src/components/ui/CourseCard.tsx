import { H3 } from "@/components/ui/Heading";
import Link from "next/link";
import { Course, CourseDate } from "@prisma/client";
import { FaCalendarAlt, FaRegClock, FaMoneyBillWave, FaBullseye, FaUsers, FaFilePdf } from "react-icons/fa";

type ExtendedCourse = Course & { dates?: CourseDate[] };

export default function CourseCard({ course }: { course: ExtendedCourse }) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:border-primary min-w-[85vw] sm:min-w-[320px] lg:min-w-0 lg:w-full snap-center shrink-0">
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
  );
}
