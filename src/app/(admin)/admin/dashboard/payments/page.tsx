import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { H1, H4 } from "@/components/ui/Heading";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PaymentsTableClient from "./PaymentsTableClient";

export default async function PaymentsPage() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: true, user: true, enrollment: true }
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={[{ label: "Payments Log" }]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <H1 className="text-3xl font-bold text-primary-dark">Payments Log</H1>
      </div>

      <PaymentsTableClient initialPayments={payments} />
    </div>
  );
}
