import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { H1 } from "@/components/ui/Heading";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SettingsForm from "./SettingsForm";

export default async function GradewiseCampSettingsPage() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const settings = await prisma.sectionSetting.findUnique({
    where: { sectionName: "gradewise-camps" }
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={[
        { label: "Gradewise Camps", href: "/admin/dashboard/gradewise-camps" },
        { label: "Settings" }
      ]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <div>
          <H1 className="text-3xl font-bold text-primary-dark">Gradewise Camp Settings</H1>
          <p className="text-[#555] mt-1">Configure the banner image and text for the Gradewise Camps section on the homepage.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
