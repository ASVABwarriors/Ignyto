import { H3 } from "@/components/ui/Heading";
import Link from "next/link";
import { Course, CourseDate } from "@prisma/client";
import { FaCalendarAlt, FaRegClock, FaMoneyBillWave, FaBullseye, FaUsers, FaFilePdf } from "react-icons/fa";

type ExtendedCourse = Course & { dates?: CourseDate[] };

export default function CourseCard({ course }: { course: ExtendedCourse }) {
  return (
    <div className="block h-full group min-w-[280px] sm:min-w-[320px] max-w-[450px] mx-auto lg:max-w-none lg:min-w-0 lg:w-full snap-center shrink-0">
      <div className="bg-white rounded-[25px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 h-full flex flex-col relative">
        
        {/* Absolute Overlay Link */}
        <Link href={`/course/${course.slug}`} className="absolute inset-0 z-10" aria-label={`View details for ${course.title}`} />

        {/* Image Container */}
        <div className="relative overflow-hidden w-full aspect-video bg-gray-100 shrink-0">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105" />
          ) : course.imageName ? (
            <img src={`/images/${course.imageName}`} alt={course.title} className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-gray-200">No Image</div>
          )}
        </div>
      
      <div className="p-[15px] md:p-[18px]">
        <H3 className="text-primary-dark text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold mb-2">{course.title}</H3>
        
        <div className="mb-[15px] space-y-1 md:space-y-2 text-[#555] text-[14px] md:text-[16px]">
          <p className="flex items-center gap-2"><FaCalendarAlt className="text-primary shrink-0" /> {course.duration}</p>
          <p className="flex items-center gap-2"><FaRegClock className="text-primary shrink-0" /> {course.dailyHours}</p>
          <p className="flex items-center gap-2 text-primary-dark text-[18px] md:text-[22px] font-bold mt-2 mb-2">
            ONLY ${course.fee}
          </p>

          <p className="flex items-center gap-2"><FaBullseye className="text-primary shrink-0" /> {course.category}</p>
          <p className="flex items-center gap-2"><FaUsers className="text-primary shrink-0" /> {course.classMode}</p>
        </div>

        {course.pdfUrl && (
          <a 
            href={`/api/download?url=${encodeURIComponent(course.pdfUrl)}&filename=${encodeURIComponent(course.title + ' Syllabus')}`}
            className="relative z-20 flex items-center gap-2 no-underline text-primary mb-[12px] font-semibold transition-colors hover:text-primary-dark text-[14px] md:text-[16px]"
          >
            <FaFilePdf /> Download Syllabus
          </a>
        )}
        <Link href={`/course/${course.slug}`} className="relative z-20 block no-underline text-primary mb-[15px] font-bold text-[14px] md:text-[16px]">
          View Details
        </Link>
        <Link href={`/course/${course.slug}`} className="relative z-20 block text-center bg-primary text-white p-[10px] md:p-[12px] rounded-[10px] no-underline font-bold transition-opacity hover:opacity-90 text-[14px] md:text-[16px]">
          Enroll Now
        </Link>
      </div>
      </div>
    </div>
  );
}
