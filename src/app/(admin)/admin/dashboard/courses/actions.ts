"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const fee = parseFloat(formData.get("fee") as string);
  const duration = formData.get("duration") as string;
  const dailyHours = formData.get("dailyHours") as string;
  const category = formData.get("category") as string;
  const classMode = formData.get("classMode") as string;
  const syllabus = formData.get("syllabus") as string;
  
  // Date and Timezone handling
  // Removed single startDate logic since we use multiple dates
  const datesRaw = formData.get("dates") as string;
  
  let dates: { dateStr: string, timeSlots: string[] }[] = [];
  try {
    if (datesRaw) dates = JSON.parse(datesRaw);
  } catch (e) {}
  
  // Files are already uploaded to Cloudinary on the client side!
  const thumbnailUrl = formData.get("thumbnailUrl") as string | null;
  const pdfUrl = formData.get("pdfUrl") as string | null;

  try {
    await prisma.course.create({
      data: {
        title,
        slug,
        description,
        fee,
        duration,
        dailyHours,
        category,
        classMode,
        syllabus,
        thumbnailUrl,
        pdfUrl,
        dates: { 
          create: dates.map(d => ({ 
            dateStr: d.dateStr,
            timeSlots: {
              create: d.timeSlots.map(t => ({ timeStr: t }))
            }
          })) 
        },
      }
    });
  } catch (err: any) {
    if (err.code === 'P2002') return { error: "A course with this URL slug already exists. Please choose a different slug." };
    console.error(err);
    return { error: "Failed to create course." };
  }

  revalidatePath("/admin/dashboard/courses");
  revalidatePath("/admin/dashboard");
  revalidatePath("/courses");
  revalidatePath("/");
  return { success: true };
}

export async function updateCourse(id: string, formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const fee = parseFloat(formData.get("fee") as string);
  const duration = formData.get("duration") as string;
  const dailyHours = formData.get("dailyHours") as string;
  const category = formData.get("category") as string;
  const classMode = formData.get("classMode") as string;
  const syllabus = formData.get("syllabus") as string;
  
  // Removed single startDate logic since we use multiple dates
  const datesRaw = formData.get("dates") as string;
  
  let dates: { dateStr: string, timeSlots: string[] }[] = [];
  try {
    if (datesRaw) dates = JSON.parse(datesRaw);
  } catch (e) {}
  
  const thumbnailUrl = formData.get("thumbnailUrl") as string | null;
  const pdfUrl = formData.get("pdfUrl") as string | null;

  try {
    await prisma.course.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        fee,
        duration,
        dailyHours,
        category,
        classMode,
        syllabus,
        ...(thumbnailUrl && { thumbnailUrl }),
        ...(pdfUrl && { pdfUrl }),
        dates: { 
          deleteMany: {}, 
          create: dates.map(d => ({ 
            dateStr: d.dateStr,
            timeSlots: {
              create: d.timeSlots.map(t => ({ timeStr: t }))
            }
          })) 
        },
      }
    });
  } catch (err: any) {
    if (err.code === 'P2002') return { error: "A course with this URL slug already exists. Please choose a different slug." };
    console.error(err);
    return { error: "Failed to update course." };
  }

  revalidatePath("/admin/dashboard/courses");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/course/${slug}`);
  revalidatePath("/courses");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCourse(id: string) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    return { error: "Unauthorized" };
  }

  await prisma.course.delete({ where: { id } });

  revalidatePath("/admin/dashboard/courses");
  revalidatePath("/admin/dashboard");
  revalidatePath("/courses");
  revalidatePath("/");
  return { success: true };
}
