import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { H1, H2 } from "@/components/ui/Heading";
import Link from "next/link";
import { formatCourseDateShort, timezoneAbbreviationMap } from "@/lib/formatTime";
import CourseListActions from "./CourseListActions";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default async function CoursesPage() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { dates: true }
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={[{ label: "Courses" }]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <H1 className="text-3xl font-bold text-primary-dark">Manage Courses</H1>
        <div className="flex gap-3">
          <Link 
            href="/admin/dashboard/courses/payments" 
            className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-sm"
          >
            View Payments
          </Link>
          <Link 
            href="/admin/dashboard/courses/create" 
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-sm"
          >
            + Add New Course
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600">Course Name</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Start Date</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Duration</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Fee</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No courses found. Create one to get started!
                  </td>
                </tr>
              )}
              {courses.map(c => {
                let displayDate = "TBD";
                if (c.dates && c.dates.length > 0) {
                  displayDate = c.dates[0].dateStr;
                }
                
                return (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {c.thumbnailUrl ? (
                          <img src={c.thumbnailUrl} alt={c.title} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                        <div>
                          <p className="font-bold text-gray-800">{c.title}</p>
                          <p className="text-sm text-gray-500">{c.category} • {c.classMode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-700">{displayDate}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{c.duration}</td>
                    <td className="py-4 px-6 font-semibold text-accent">${c.fee}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/dashboard/courses/view/${c.slug}`}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-600 hover:text-white transition-colors"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/admin/dashboard/courses/edit/${c.id}`} 
                          className="px-3 py-1 bg-primary-light text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                        >
                          Edit
                        </Link>
                        <CourseListActions courseId={c.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
