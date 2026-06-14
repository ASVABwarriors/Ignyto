import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import SummerCamps from "@/components/home/SummerCamps";
import Tutoring from "@/components/home/Tutoring";

export default async function Home() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Hero courses={courses.map(c => ({ id: c.id, title: c.title }))} />
      <About />
      <SummerCamps courses={courses} />
      <Tutoring />
    </>
  );
}
