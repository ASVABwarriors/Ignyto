import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { H1 } from "@/components/ui/Heading";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import InquiriesTableClient from "./InquiriesTableClient";

export default async function InquiriesPage() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: { select: { title: true } } },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={[{ label: "Inquiries" }]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <H1 className="text-3xl font-bold text-primary-dark">Inquiries</H1>
      </div>

      <InquiriesTableClient initialInquiries={inquiries} />
    </div>
  );
}
