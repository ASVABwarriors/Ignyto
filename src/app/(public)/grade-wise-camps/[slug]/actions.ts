"use server";

import { prisma } from "@/lib/prisma";

export async function saveGradeWiseCampPendingEnrollment(formData: FormData, gradeWiseCampId: string) {
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

  const enrollment = await prisma.gradeWiseCampEnrollment.create({
    data: {
      gradeWiseCampId,
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

export async function recordGradeWiseCampPayment(data: {
  enrollmentId: string;
  gradeWiseCampId: string;
  paypalOrderId: string;
  amount: number;
}) {
  const { enrollmentId, gradeWiseCampId, paypalOrderId, amount } = data;

  try {
    // Check if the webhook already created this payment
    let payment = await prisma.gradeWiseCampPayment.findUnique({
      where: { paypalOrderId }
    });

    if (!payment) {
      payment = await prisma.gradeWiseCampPayment.create({
        data: {
          gradeWiseCampId,
          paypalOrderId,
          amount,
          status: "COMPLETED"
        }
      });
    }

    await prisma.gradeWiseCampEnrollment.update({
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

