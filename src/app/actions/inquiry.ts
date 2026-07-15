"use server";

import { prisma } from "@/lib/prisma";

export async function getInquiryData() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: 'desc' }
  });

  const trialSlots = await prisma.freeTrialDate.findMany({
    include: { timeSlots: true },
    orderBy: { dateStr: 'asc' }
  });

  return { courses, trialSlots };
}

export async function submitInquiry(data: { name: string; email: string; phone: string; message: string; grade?: string; courseId?: string; city?: string; state?: string; trialDate?: string; trialTime?: string }) {
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        grade: data.grade || null,
        courseId: data.courseId || null,
        city: data.city || null,
        state: data.state || null,
        trialDate: data.trialDate || null,
        trialTime: data.trialTime || null,
      },
    });
    return { success: true, inquiry };
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return { success: false, error: "Failed to submit inquiry" };
  }
}
