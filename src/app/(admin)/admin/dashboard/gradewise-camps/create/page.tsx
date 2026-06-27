import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { H1 } from "@/components/ui/Heading";
import Link from "next/link";
import CourseForm from "./CourseForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default async function CreateCoursePage() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={[
        { label: "Gradewise Camps", href: "/admin/dashboard/gradewise-camps" },
        { label: "Create Camp" }
      ]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <div>
          <H1 className="text-3xl font-bold text-primary-dark">Create New Camp</H1>
          <p className="text-[#555] mt-1">Fill in the details below to add a new gradewise camp.</p>
        </div>
        <Link 
          href="/admin/dashboard/gradewise-camps" 
          className="text-gray-500 hover:text-primary font-semibold transition-colors"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <CourseForm />
      </div>
    </div>
  );
}
