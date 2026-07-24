import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { H1, H2 } from "@/components/ui/Heading";
import Link from "next/link";
import { formatCourseDate } from "@/lib/formatTime";
import { FaCalendarAlt, FaRegClock, FaMoneyBillWave, FaBullseye, FaUsers, FaArrowLeft, FaFilePdf } from "react-icons/fa";
import GradeWiseCampRegisterClient from "./GradeWiseCampRegisterClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const gradeWiseCamp = await prisma.gradeWiseCamp.findUnique({
    where: { slug }
  });

  if (!gradeWiseCamp) {
    return {
      title: "Course Not Found",
    };
  }

  // Extract a plain text snippet from description if possible, or use a default
  const plainTextDesc = gradeWiseCamp.description ? gradeWiseCamp.description.replace(/<[^>]+>/g, '').slice(0, 160) + '...' : `Enroll in ${gradeWiseCamp.title} at Ignyto Tutoring.`;

  return {
    title: gradeWiseCamp.title,
    description: plainTextDesc,
    keywords: [gradeWiseCamp.category, gradeWiseCamp.title, "Ignyto Tutoring", "Group Camp", "Course", gradeWiseCamp.classMode],
    openGraph: {
      title: gradeWiseCamp.title,
      description: plainTextDesc,
      images: gradeWiseCamp.thumbnailUrl ? [{ url: gradeWiseCamp.thumbnailUrl }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: gradeWiseCamp.title,
      description: plainTextDesc,
      images: gradeWiseCamp.thumbnailUrl ? [gradeWiseCamp.thumbnailUrl] : [],
    }
  };
}

export default async function GradeWiseCampDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gradeWiseCamp = await prisma.gradeWiseCamp.findUnique({
    where: { slug },
    include: {
      dates: {
        include: {
          timeSlots: true
        }
      }
    }
  });

  if (!gradeWiseCamp) {
    redirect("/");
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-[40px] pt-[40px] px-4">

      <div className="w-full max-w-[1200px] mx-auto bg-white rounded-[30px] shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Image */}
        <div className="w-full aspect-video max-h-[500px] bg-gray-100 relative">
          {gradeWiseCamp.thumbnailUrl ? (
            <img src={gradeWiseCamp.thumbnailUrl} alt={gradeWiseCamp.title} className="w-full h-full object-cover" />
          ) : gradeWiseCamp.imageName ? (
            <img src={`/images/${gradeWiseCamp.imageName}`} alt={gradeWiseCamp.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">No Image Available</div>
          )}
          <Link href="/" className="absolute top-[20px] left-[20px] bg-white/90 p-[12px] rounded-full shadow-md text-primary hover:text-white hover:bg-primary transition-colors">
            <FaArrowLeft size={20} />
          </Link>
        </div>

        {/* Content */}
        <div className="p-[30px] md:p-[50px] pb-[15px] md:pb-[25px]">
          <H1 className="text-[clamp(1.85rem,4.5vw,2.75rem)] font-bold text-primary-dark mb-[20px] leading-tight">{gradeWiseCamp.title}</H1>
          
          {/* Metadata Top Row */}
          <div className="flex flex-wrap items-center gap-6 mb-[30px] border-b border-gray-100 pb-6">
            <div className="flex items-center gap-2">
              <FaBullseye className="text-primary text-xl" />
              <span className="font-semibold text-gray-700">{gradeWiseCamp.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-primary text-xl" />
              <span className="font-semibold text-gray-700">{gradeWiseCamp.classMode}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary text-xl" />
              <span className="font-semibold text-gray-700">{gradeWiseCamp.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaRegClock className="text-primary text-xl" />
              <span className="font-semibold text-gray-700">{gradeWiseCamp.dailyHours}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[40px]">
            <div className="lg:col-span-2 min-w-0">
              <H2 className="text-[28px] font-bold text-text-dark mb-[20px]">Course Overview</H2>
              {gradeWiseCamp.description ? (
                <div 
                  className="text-lg text-[#444] leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_strong]:font-bold [&_em]:italic [&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full [&_table]:w-full [&_img]:max-w-full [&_img]:h-auto" 
                  dangerouslySetInnerHTML={{ __html: gradeWiseCamp.description.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ') }} 
                  suppressHydrationWarning={true}
                />
              ) : (
                <p className="text-[#666] italic">No description provided.</p>
              )}
            </div>

            <div>
              <div className="space-y-6">
                
                {/* Card 1: Batch Dates */}
                {gradeWiseCamp.dates && gradeWiseCamp.dates.length > 0 && (
                  <div className="bg-white rounded-[20px] p-[25px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Batch Dates</p>
                    <ul className="space-y-3">
                      {gradeWiseCamp.dates.map(date => (
                        <li key={date.id} className="flex items-center gap-3 font-semibold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <FaCalendarAlt className="text-primary"/> {date.dateStr}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Card 2: Time Slots */}
                {gradeWiseCamp.dates && gradeWiseCamp.dates.length > 0 && (() => {
                  const allTimeSlots = Array.from(new Set(gradeWiseCamp.dates.flatMap(d => d.timeSlots.map(t => t.timeStr))));
                  if (allTimeSlots.length === 0) return null;
                  return (
                    <div className="bg-white rounded-[20px] p-[25px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                      <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Time Slots</p>
                      <div className="flex flex-col gap-3">
                        {allTimeSlots.map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-3 font-semibold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <FaRegClock className="text-primary"/> {slot}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Card 3: Course Fee & Actions */}
                <div className="bg-white rounded-[20px] p-[30px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                  <div className="text-center mb-[25px]">
                    <span className="block text-[#555] font-semibold mb-1">Course Fee</span>
                    <span className="text-[40px] font-bold text-green-600 flex items-center justify-center gap-2">
                      ${gradeWiseCamp.fee}
                    </span>
                  </div>

                  <a 
                    href="#registration-form" 
                    className="block text-center bg-primary text-white py-[16px] rounded-xl text-xl font-bold transition-transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,118,255,0.3)] shadow-md mb-4"
                  >
                    Enroll Now
                  </a>

                  {gradeWiseCamp.pdfUrl && (
                    <a 
                      href={`/api/download?url=${encodeURIComponent(gradeWiseCamp.pdfUrl)}&filename=${encodeURIComponent(gradeWiseCamp.title + ' Syllabus')}`}
                      className="flex items-center justify-center gap-2 w-full text-center border-2 border-primary text-primary py-[14px] rounded-xl text-[18px] font-bold transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      <FaFilePdf /> Download Syllabus
                    </a>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Registration Form below Course Overview */}
        <div className="bg-gray-50/50 p-[30px] md:p-[50px] pt-[15px] md:pt-[25px] border-t border-gray-100">
          <GradeWiseCampRegisterClient course={gradeWiseCamp} />
        </div>

      </div>
    </div>
  );
}
