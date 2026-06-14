import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { H1, H2 } from "@/components/ui/Heading";
import AdminForm from "./AdminForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default async function ManageAdminsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (session.role !== "SUPERADMIN") {
    return (
      <div className="bg-red-50 p-6 rounded-xl border border-red-100 mt-10 text-center">
        <H2 className="text-red-600 font-bold mb-2">Access Denied</H2>
        <p className="text-red-500">You must be a Superadmin to view this page.</p>
      </div>
    );
  }

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true, email: true, isTwoFactorEnabled: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <Breadcrumbs items={[{ label: "Manage Admins" }]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <H1 className="text-3xl font-bold text-primary-dark">Manage Admins</H1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <H2 className="text-xl font-bold text-primary-dark mb-4">Create New Admin</H2>
            <p className="text-sm text-gray-500 mb-6">
              New admins will be forced to setup their 2FA Authenticator App on their first login.
            </p>
            <AdminForm />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <H2 className="text-xl font-bold text-primary-dark mb-4">Current Sub-Admins</H2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-600">Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Email</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">2FA Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">No admins found.</td>
                    </tr>
                  )}
                  {admins.map(admin => (
                    <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{admin.name || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-600">{admin.email}</td>
                      <td className="py-3 px-4">
                        {admin.isTwoFactorEnabled ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending Setup</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">{admin.createdAt.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
