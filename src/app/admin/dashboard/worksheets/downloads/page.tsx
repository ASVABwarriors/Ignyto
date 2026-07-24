import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaArrowLeft, FaDownload } from "react-icons/fa";

export default async function WorksheetDownloadsPage() {
  const downloads = await prisma.worksheetDownload.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      worksheet: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/dashboard/worksheets"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaDownload className="text-primary" /> Worksheet Downloads
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {downloads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No worksheet downloads yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-600">Date</th>
                  <th className="p-4 font-semibold text-gray-600">Name</th>
                  <th className="p-4 font-semibold text-gray-600">Email</th>
                  <th className="p-4 font-semibold text-gray-600">Grade</th>
                  <th className="p-4 font-semibold text-gray-600">Worksheet</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((download) => (
                  <tr
                    key={download.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(download.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {download.name}
                    </td>
                    <td className="p-4 text-gray-600">
                      <a
                        href={`mailto:${download.email}`}
                        className="hover:text-primary hover:underline"
                      >
                        {download.email}
                      </a>
                    </td>
                    <td className="p-4 text-gray-600">{download.grade}</td>
                    <td className="p-4">
                      <Link
                        href={`/worksheets/${download.worksheet.slug}`}
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        {download.worksheet.title}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
