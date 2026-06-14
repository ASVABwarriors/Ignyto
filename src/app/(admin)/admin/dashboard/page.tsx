import { H1, H2, H3, H4 } from "@/components/ui/Heading";
import { getSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { course: true }
  });

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  async function logoutAction() {
    "use server";
    await destroySession();
    redirect("/admin/login");
  }

  return (
    <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-start mb-8 bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <div>
          <H1 className="text-3xl font-bold text-primary-dark">
            Welcome back, {user?.name || "Admin"}
          </H1>
          <p className="text-[#555] mt-1 font-medium bg-primary-light inline-block px-3 py-1 rounded-lg text-primary text-xs mt-2">
            {session.role} PORTAL
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2 rounded-xl font-bold transition-colors border border-red-200">
            Logout
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="p-8 bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border-l-4 border-primary hover:-translate-y-1 transition-transform">
          <H3 className="text-gray-500 font-semibold mb-2 text-lg">Total Courses</H3>
          <p className="text-4xl font-bold text-primary-dark">{courses.length}</p>
        </div>
        <div className="p-8 bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border-l-4 border-secondary hover:-translate-y-1 transition-transform">
          <H3 className="text-gray-500 font-semibold mb-2 text-lg">Total Payments</H3>
          <p className="text-4xl font-bold text-primary-dark">{payments.length}</p>
        </div>
        <div className="p-8 bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border-l-4 border-accent hover:-translate-y-1 transition-transform">
          <H3 className="text-gray-500 font-semibold mb-2 text-lg">Revenue</H3>
          <p className="text-4xl font-bold text-primary-dark">
            ${payments.reduce((acc, p) => acc + (p.status === "COMPLETED" ? p.amount : 0), 0)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Manage Courses */}
        <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          <div className="bg-primary-light p-5 border-b border-gray-100">
            <H2 className="text-xl font-bold text-primary-dark">Manage Courses</H2>
          </div>
          <div className="p-5 space-y-4">
            {courses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No courses available.</p>
            ) : (
              courses.map(c => (
                <div key={c.id} className="flex justify-between items-center p-4 bg-bg-light rounded-xl border border-primary-light/50 hover:border-primary transition-colors">
                  <div>
                    <H4 className="font-bold text-primary-dark text-lg">{c.title}</H4>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold text-accent">${c.fee}</span> | {c.duration}
                    </p>
                  </div>
                  <button className="text-primary bg-primary-light px-4 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                    Edit
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          <div className="bg-primary-light p-5 border-b border-gray-100">
            <H2 className="text-xl font-bold text-primary-dark">Recent Transactions</H2>
          </div>
          <div className="p-5 space-y-4">
            {payments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent transactions.</p>
            ) : (
              payments.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 bg-bg-light rounded-xl border border-primary-light/50">
                  <div>
                    <H4 className="font-bold text-primary-dark text-lg">{p.course.title}</H4>
                    <p className="text-sm text-gray-500 mt-1 font-mono">ID: {p.paypalOrderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-[#333]">${p.amount}</p>
                    <div className="mt-1">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
