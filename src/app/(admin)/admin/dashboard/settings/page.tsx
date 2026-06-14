import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { H1 } from "@/components/ui/Heading";
import SettingsForm from "./SettingsForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, phone: true }
  });

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <Breadcrumbs items={[{ label: "Settings" }]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <H1 className="text-3xl font-bold text-primary-dark">Account Settings</H1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-500 mb-8 pb-4 border-b border-gray-100">
          Update your profile information. For your security, any changes require you to enter a code from your Authenticator app.
        </p>

        <SettingsForm initialName={user.name || ""} initialEmail={user.email} initialPhone={user.phone || ""} />
      </div>
    </div>
  );
}
