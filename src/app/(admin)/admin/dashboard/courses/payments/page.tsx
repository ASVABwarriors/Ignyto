import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { H1, H4 } from "@/components/ui/Heading";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PaymentsTableClient from "../../payments/PaymentsTableClient";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default async function CoursesPaymentsPage() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const payments = await prisma.payment.findMany({
    where: { course: { category: { not: "Group Camp" } } },
    orderBy: { createdAt: "desc" },
    include: { course: true, user: true, enrollment: true }
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={[{ label: "Courses", href: "/admin/dashboard/courses" }, { label: "Payments Log" }]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/courses" className="text-primary hover:text-primary-dark p-2 rounded-full hover:bg-primary/10 transition-colors">
            <FaArrowLeft size={20} />
          </Link>
          <H1 className="text-3xl font-bold text-primary-dark">Courses Payments</H1>
        </div>
      </div>

      <PaymentsTableClient initialPayments={payments} />
    </div>
  );
}
