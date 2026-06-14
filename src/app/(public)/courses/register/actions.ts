"use server";

import { prisma } from "@/lib/prisma";

export async function savePendingEnrollment(formData: FormData, courseId: string) {
  const studentName = formData.get("studentName") as string;
  const grade = formData.get("grade") as string;
  const studentEmail = formData.get("studentEmail") as string;
  const studentPhone = formData.get("studentPhone") as string;
  
  const parentName = formData.get("parentName") as string;
  const parentEmail = formData.get("parentEmail") as string;
  const parentPhone = formData.get("parentPhone") as string;

  const referredBy = formData.get("referredBy") as string;
  const address = formData.get("address") as string;

  const selectedDate = formData.get("selectedDate") as string;
  const selectedTime = formData.get("selectedTime") as string;

  if (!studentName || !parentEmail) {
    throw new Error("Student Name and Parent Email are required.");
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      courseId,
      studentName,
      grade,
      studentEmail,
      studentPhone,
      parentName,
      parentEmail,
      parentPhone,
      referredBy,
      address,
      selectedDate,
      selectedTime,
      status: "PENDING"
    }
  });

  return { success: true, enrollmentId: enrollment.id };
}

export async function recordPayment(data: {
  enrollmentId: string;
  courseId: string;
  paypalOrderId: string;
  amount: number;
}) {
  const { enrollmentId, courseId, paypalOrderId, amount } = data;

  try {
    // Check if the webhook already created this payment
    let payment = await prisma.payment.findUnique({
      where: { paypalOrderId }
    });

    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          courseId,
          paypalOrderId,
          amount,
          status: "COMPLETED"
        }
      });
    }

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        paymentId: payment.id,
        status: "CONFIRMED"
      }
    });

    return { success: true, payment };
  } catch (error) {
    console.error("Error recording payment:", error);
    throw new Error("Failed to record payment in database");
  }
}

