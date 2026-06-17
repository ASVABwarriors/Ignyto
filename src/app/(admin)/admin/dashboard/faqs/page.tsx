import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import FaqsClient from "./FaqsClient";

export default async function FaqsPage() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/admin/login");
  }

  const faqs = await prisma.faq.findMany({
    orderBy: { order: "asc" }
  });

  return <FaqsClient initialFaqs={faqs} />;
}
