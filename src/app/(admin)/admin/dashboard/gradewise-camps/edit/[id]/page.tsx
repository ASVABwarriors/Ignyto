import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { H1 } from "@/components/ui/Heading";
import Link from "next/link";
import CourseForm from "../../create/CourseForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      dates: {
        include: { timeSlots: true }
      }
    }
  });

  if (!course) {
    redirect("/admin/dashboard/gradewise-camps");
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={[
        { label: "Gradewise Camps", href: "/admin/dashboard/gradewise-camps" },
        { label: "Edit Camp" }
      ]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <div>
          <H1 className="text-3xl font-bold text-primary-dark">Edit Camp</H1>
          <p className="text-[#555] mt-1">Make changes to the camp details below.</p>
        </div>
        <Link 
          href="/admin/dashboard/gradewise-camps" 
          className="text-gray-500 hover:text-primary font-semibold transition-colors"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <CourseForm initialData={course} />
      </div>
    </div>
  );
}
