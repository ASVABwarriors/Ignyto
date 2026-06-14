"use server";

import { prisma } from "@/lib/prisma";

export async function submitInquiry(data: { name: string; email: string; phone: string; message: string; grade?: string; courseId?: string; city?: string; state?: string }) {
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
      },
    });
    return { success: true, inquiry };
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return { success: false, error: "Failed to submit inquiry" };
  }
}
