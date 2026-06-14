import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import SummerCamps from "@/components/home/SummerCamps";
import Tutoring from "@/components/home/Tutoring";

export const dynamic = "force-dynamic";

export default async function Home() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  const trialSlots = await prisma.freeTrialDate.findMany({
    include: { timeSlots: true },
    orderBy: { dateStr: "asc" },
  });

  return (
    <>
      <Hero 
        courses={courses.map(c => ({ id: c.id, title: c.title }))} 
        trialSlots={trialSlots}
      />
      <About />
      <SummerCamps courses={courses} />
      <Tutoring />
    </>
  );
}
