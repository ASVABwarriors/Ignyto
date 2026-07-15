import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // If not logged in, return a clean screen without any navigation
  if (!session) {
    return (
      <div className="min-h-screen bg-bg-light flex flex-col">
        <main className="flex-grow w-full">
          {children}
        </main>
      </div>
    );
  }

  // If logged in, return the Sidebar layout
  return (
    <div className="min-h-screen bg-bg-light flex">
      {/* Sticky Left Sidebar */}
      <aside className="w-64 fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col z-50 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <Link href="/admin/dashboard" className="flex items-center gap-3 font-bold text-xl text-primary">
            <img src="/images/logo.png" alt="Logo" className="h-[40px] rounded-[8px]" />
            Ignyto Admin
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            href="/admin/dashboard" 
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/dashboard/courses" 
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
          >
            Courses
          </Link>

          <Link 
            href="/admin/dashboard/grade-wise-camps" 
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
          >
            Grade Wise Camps
          </Link>
          <Link 
            href="/admin/dashboard/worksheets" 
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
          >
            Worksheets
          </Link>
          <Link 
            href="/admin/dashboard/payments" 
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
          >
            Payments
          </Link>
          <Link 
            href="/admin/dashboard/inquiries" 
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
          >
            Inquiries
          </Link>
          <Link 
            href="/admin/dashboard/trial-slots" 
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
          >
            Trial Slots
          </Link>
          <Link 
            href="/admin/dashboard/faqs" 
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
          >
            FAQs
          </Link>
          {session.role === "SUPERADMIN" && (
            <Link 
              href="/admin/dashboard/admins" 
              className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
            >
              Manage Admins
            </Link>
          )}
          <Link 
            href="/admin/dashboard/settings" 
            className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary transition-colors"
          >
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link 
            href="/" 
            className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            View Public Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      {/* We use ml-64 to push it past the fixed 64 (16rem = 256px) sidebar */}
      <main className="ml-64 w-[calc(100%-16rem)] min-h-screen flex flex-col relative">
        {/* The children inside here will scroll vertically on the right side naturally */}
        <div className="flex-grow w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
