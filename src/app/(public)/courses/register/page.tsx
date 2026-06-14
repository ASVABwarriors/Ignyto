import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RegisterClient from "./RegisterClient";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const { course: slug } = await searchParams;

  if (!slug) {
    redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      dates: {
        include: { timeSlots: true }
      }
    }
  });

  if (!course) {
    return (
      <div className="bg-[#f0f4f8] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Course Not Found</h1>
          <p className="text-gray-500">The course you are trying to register for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-16 px-4">
      <RegisterClient course={course} />
    </div>
  );
}
