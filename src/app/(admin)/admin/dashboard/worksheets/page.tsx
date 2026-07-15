import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { H1, H2, H4 } from "@/components/ui/Heading";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WorksheetListActions from "./WorksheetListActions";

export default async function WorksheetsPage() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const worksheets = await prisma.worksheet.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={[{ label: "Worksheets" }]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <H1 className="text-3xl font-bold text-primary-dark">Manage Worksheets</H1>
        <Link 
          href="/admin/dashboard/worksheets/create" 
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-sm"
        >
          + Add New Worksheet
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600">Worksheet Name</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Grade</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Estimated Time</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Questions</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {worksheets.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No worksheets found. Create one to get started!
                  </td>
                </tr>
              )}
              {worksheets.map(w => (
                <tr key={w.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      {w.heroImage ? (
                        <img src={w.heroImage} alt={w.title} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">No Img</div>
                      )}
                      <div>
                        <p className="font-bold text-gray-800">{w.title}</p>
                        <p className="text-sm text-gray-500">Slug: /{w.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-700">{w.grade}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{w.estimatedTime}</td>
                  <td className="py-4 px-6 font-semibold text-accent">{w.questionCount}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <a 
                        href={`/worksheets/${w.slug}`}
                        target="_blank"
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-600 hover:text-white transition-colors"
                      >
                        Preview
                      </a>
                      <Link 
                        href={`/admin/dashboard/worksheets/edit/${w.id}`} 
                        className="px-3 py-1 bg-primary-light text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                      >
                        Edit
                      </Link>
                      <WorksheetListActions worksheetId={w.id} isFeatured={w.isFeatured} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
