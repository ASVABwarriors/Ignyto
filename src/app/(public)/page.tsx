import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import SummerCamps from "@/components/home/SummerCamps";
import GradeWiseCamps from "@/components/home/GradeWiseCamps";
import Tutoring from "@/components/home/Tutoring";
import Faqs from "@/components/home/Faqs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  const gradeWiseCamps = await prisma.gradeWiseCamp.findMany({
    orderBy: { createdAt: "desc" },
  });

  const trialSlots = await prisma.freeTrialDate.findMany({
    include: { timeSlots: true },
    orderBy: { dateStr: "asc" },
  });

  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const summerCourses = courses;

  return (
    <>
      <Hero />
      <GradeWiseCamps gradeWiseCamps={gradeWiseCamps} />
      <About />
      <SummerCamps courses={summerCourses} />
      <Tutoring />
      <Faqs initialFaqs={faqs} />
    </>
  );
}
