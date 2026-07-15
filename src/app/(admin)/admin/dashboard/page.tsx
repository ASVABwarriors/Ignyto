import { H1, H2, H3, H4 } from "@/components/ui/Heading";
import { getSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const coursesCount = await prisma.course.count();
  const gradeWiseCampsCount = await prisma.gradeWiseCamp.count();
  const worksheetsCount = await prisma.worksheet.count();
  const totalEnrollments = await prisma.enrollment.count() + await prisma.gradeWiseCampEnrollment.count();

  const coursePayments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { course: true }
  });

  const gradeWiseCampPayments = await prisma.gradeWiseCampPayment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { gradeWiseCamp: true }
  });

  // Combine and sort payments
  const allPayments = [
    ...coursePayments.map(p => ({ ...p, type: 'Course', title: p.course.title })),
    ...gradeWiseCampPayments.map(p => ({ ...p, type: 'Group Camp', title: p.gradeWiseCamp.title }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 15);

  const totalPaymentsCount = await prisma.payment.count() + await prisma.gradeWiseCampPayment.count();
  
  const allCoursePayments = await prisma.payment.findMany();
  const allGradeWiseCampPayments = await prisma.gradeWiseCampPayment.findMany();
  const totalRevenue = 
    allCoursePayments.reduce((acc, p) => acc + (p.status === "COMPLETED" ? p.amount : 0), 0) +
    allGradeWiseCampPayments.reduce((acc, p) => acc + (p.status === "COMPLETED" ? p.amount : 0), 0);

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
          <H3 className="text-gray-500 font-semibold mb-2 text-lg">Total Enrollments</H3>
          <p className="text-4xl font-bold text-primary-dark">{totalEnrollments}</p>
        </div>
        <div className="p-8 bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border-l-4 border-secondary hover:-translate-y-1 transition-transform">
          <H3 className="text-gray-500 font-semibold mb-2 text-lg">Total Payments</H3>
          <p className="text-4xl font-bold text-primary-dark">{totalPaymentsCount}</p>
        </div>
        <div className="p-8 bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border-l-4 border-accent hover:-translate-y-1 transition-transform">
          <H3 className="text-gray-500 font-semibold mb-2 text-lg">Revenue</H3>
          <p className="text-4xl font-bold text-primary-dark">
            ${totalRevenue}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Access */}
        <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col">
          <div className="bg-primary-light p-5 border-b border-gray-100">
            <H2 className="text-xl font-bold text-primary-dark">Manage Programs</H2>
          </div>
          <div className="p-8 flex-1 flex flex-col gap-6 justify-center">
            <Link 
              href="/admin/dashboard/courses"
              className="flex items-center justify-between bg-bg-light border-2 border-primary-light p-6 rounded-2xl hover:border-primary hover:bg-white hover:shadow-md transition-all group"
            >
              <div>
                <H3 className="text-2xl font-bold text-primary-dark mb-1 flex items-center gap-3">
                  Courses 
                  <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">{coursesCount}</span>
                </H3>
                <p className="text-gray-500 text-sm">Manage all regular camps and courses</p>
              </div>
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform shadow-sm">
                →
              </div>
            </Link>

            <Link 
              href="/admin/dashboard/grade-wise-camps"
              className="flex items-center justify-between bg-bg-light border-2 border-secondary/20 p-6 rounded-2xl hover:border-secondary hover:bg-white hover:shadow-md transition-all group"
            >
              <div>
                <H3 className="text-2xl font-bold text-secondary mb-1 flex items-center gap-3">
                  Grade Wise Camps
                  <span className="bg-secondary/10 text-secondary text-sm px-3 py-1 rounded-full">{gradeWiseCampsCount}</span>
                </H3>
                <p className="text-gray-500 text-sm">Manage dedicated group collaboration camps</p>
              </div>
              <div className="bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform shadow-sm">
                →
              </div>
            </Link>

            <Link 
              href="/admin/dashboard/worksheets"
              className="flex items-center justify-between bg-bg-light border-2 border-green-200 p-6 rounded-2xl hover:border-green-500 hover:bg-white hover:shadow-md transition-all group"
            >
              <div>
                <H3 className="text-2xl font-bold text-green-600 mb-1 flex items-center gap-3">
                  Worksheets
                  <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">{worksheetsCount}</span>
                </H3>
                <p className="text-gray-500 text-sm">Manage free practice worksheets</p>
              </div>
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform shadow-sm">
                →
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-primary-light p-4 border-b border-gray-100 shrink-0">
            <H2 className="text-lg font-bold text-primary-dark">Recent Transactions</H2>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto flex-1 scrollbar-hide">
            {allPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">No recent transactions.</p>
            ) : (
              allPayments.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-bg-light rounded-xl border border-primary-light/50 hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <H4 className="font-bold text-primary-dark text-base">{p.title}</H4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${p.type === 'Course' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>
                        {p.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">ID: {p.paypalOrderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base text-[#333]">${p.amount}</p>
                    <div className="mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
