import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { H1, H2, H3 } from "@/components/ui/Heading";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { formatCourseDate } from "@/lib/formatTime";
import { FaCalendarAlt, FaRegClock, FaMoneyBillWave, FaBullseye, FaUsers, FaFilePdf, FaLink } from "react-icons/fa";

export default async function ViewCourseAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      dates: {
        include: { timeSlots: true }
      }
    }
  });

  if (!course) {
    redirect("/admin/dashboard/courses");
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={[
        { label: "Courses", href: "/admin/dashboard/courses" },
        { label: "View Course" }
      ]} />
      
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <div>
          <H1 className="text-3xl font-bold text-primary-dark">Course Details</H1>
          <p className="text-[#555] mt-1 flex items-center gap-2">
            <FaLink className="text-gray-400" />
            <a href={`/course/${course.slug}`} target="_blank" className="text-primary hover:underline">
              Public Link: /course/{course.slug}
            </a>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/dashboard/courses" 
            className="text-gray-500 hover:text-primary font-semibold transition-colors"
          >
            Back to Courses
          </Link>
          <Link 
            href={`/admin/dashboard/courses/edit/${course.id}`} 
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-sm"
          >
            Edit Course
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media & Primary Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <H3 className="font-bold text-gray-800 mb-4 border-b pb-2">Thumbnail Image</H3>
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-auto rounded-xl shadow-sm" />
            ) : (
              <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 font-medium">
                No thumbnail uploaded
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <H3 className="font-bold text-gray-800 mb-4 border-b pb-2">Course Material</H3>
            {course.pdfUrl ? (
              <a 
                href={course.pdfUrl} 
                target="_blank"
                download
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full text-center border-2 border-primary text-primary py-3 rounded-xl font-bold transition-all hover:bg-primary hover:text-white"
              >
                <FaFilePdf /> Download Syllabus
              </a>
            ) : (
              <p className="text-gray-500 italic text-center py-4">No syllabus PDF uploaded.</p>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <H2 className="text-2xl font-bold text-primary-dark mb-6">{course.title}</H2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8">
              <div>
                <span className="block text-sm font-semibold text-gray-400 mb-1">Category</span>
                <span className="flex items-center gap-2 text-lg font-medium text-gray-800"><FaBullseye className="text-primary"/> {course.category}</span>
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-400 mb-1">Fee</span>
                <span className="flex items-center gap-2 text-lg font-bold text-green-600"><FaMoneyBillWave /> ${course.fee}</span>
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-400 mb-1">Class Mode</span>
                <span className="flex items-center gap-2 text-lg font-medium text-gray-800"><FaUsers className="text-primary"/> {course.classMode}</span>
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-400 mb-1">Duration</span>
                <span className="flex items-center gap-2 text-lg font-medium text-gray-800"><FaCalendarAlt className="text-primary"/> {course.duration}</span>
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-400 mb-1">Daily Hours</span>
                <span className="flex items-center gap-2 text-lg font-medium text-gray-800"><FaRegClock className="text-primary"/> {course.dailyHours}</span>
              </div>
              <div className="md:col-span-2">
                <span className="block text-sm font-semibold text-gray-400 mb-3 border-b pb-2">Start Dates & Time Slots</span>
                {course.dates && course.dates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {course.dates.map(d => (
                      <div key={d.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="font-bold text-gray-800 block mb-2">{d.dateStr}</span>
                        {d.timeSlots && d.timeSlots.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {d.timeSlots.map(t => (
                              <span key={t.id} className="bg-white text-xs font-semibold px-2 py-1 rounded-md border border-gray-200 text-gray-600">
                                {t.timeStr}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No time slots added</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="italic text-gray-500">Not set</span>
                )}
              </div>
            </div>

            <div>
              <span className="block text-sm font-semibold text-gray-400 mb-3 border-b pb-2">Description / Instructions</span>
              {course.description ? (
                <div 
                  className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-700 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_strong]:font-bold [&_em]:italic" 
                  dangerouslySetInnerHTML={{ __html: course.description }} 
                  suppressHydrationWarning={true}
                />
              ) : (
                <p className="text-gray-500 italic bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">No description provided.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
