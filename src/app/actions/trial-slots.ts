"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTrialDates() {
  try {
    const dates = await prisma.freeTrialDate.findMany({
      include: {
        timeSlots: true,
      },
      orderBy: {
        dateStr: "asc",
      },
    });
    return { success: true, dates };
  } catch (error) {
    console.error("Failed to fetch trial dates:", error);
    return { success: false, error: "Failed to fetch trial dates" };
  }
}

export async function addTrialDate(dateStr: string) {
  try {
    const date = await prisma.freeTrialDate.create({
      data: { dateStr },
      include: { timeSlots: true }
    });
    revalidatePath("/admin/dashboard/trial-slots");
    revalidatePath("/");
    return { success: true, date };
  } catch (error) {
    console.error("Failed to add trial date:", error);
    return { success: false, error: "Failed to add trial date" };
  }
}

export async function deleteTrialDate(id: string) {
  try {
    await prisma.freeTrialDate.delete({ where: { id } });
    revalidatePath("/admin/dashboard/trial-slots");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete trial date:", error);
    return { success: false, error: "Failed to delete trial date" };
  }
}

export async function addTrialTimeSlot(dateId: string, timeStr: string) {
  try {
    const timeSlot = await prisma.freeTrialTimeSlot.create({
      data: {
        dateId,
        timeStr,
      },
    });
    revalidatePath("/admin/dashboard/trial-slots");
    revalidatePath("/");
    return { success: true, timeSlot };
  } catch (error) {
    console.error("Failed to add time slot:", error);
    return { success: false, error: "Failed to add time slot" };
  }
}

export async function deleteTrialTimeSlot(id: string) {
  try {
    await prisma.freeTrialTimeSlot.delete({ where: { id } });
    revalidatePath("/admin/dashboard/trial-slots");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete time slot:", error);
    return { success: false, error: "Failed to delete time slot" };
  }
}
