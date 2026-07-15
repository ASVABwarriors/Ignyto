import WorksheetForm from "../../create/WorksheetForm";
import { H1, H2, H4 } from "@/components/ui/Heading";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditWorksheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const worksheet = await prisma.worksheet.findUnique({
    where: { id }
  });

  if (!worksheet) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs items={[
        { label: "Worksheets", href: "/admin/dashboard/worksheets" },
        { label: "Edit" }
      ]} />
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100">
        <H2 className="text-2xl font-bold text-primary-dark border-b border-gray-100 pb-4 mb-6">Edit Worksheet: {worksheet.title}</H2>
        <WorksheetForm initialData={worksheet} />
      </div>
    </div>
  );
}
