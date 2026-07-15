import WorksheetForm from "./WorksheetForm";
import { H1, H2, H4 } from "@/components/ui/Heading";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function CreateWorksheetPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs items={[
        { label: "Worksheets", href: "/admin/dashboard/worksheets" },
        { label: "Add New" }
      ]} />
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100">
        <H2 className="text-2xl font-bold text-primary-dark border-b border-gray-100 pb-4 mb-6">Add New Worksheet</H2>
        <WorksheetForm />
      </div>
    </div>
  );
}
