"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateSectionSetting(sectionName: string, formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const bannerUrl = formData.get("bannerUrl") as string | null;

  try {
    await prisma.sectionSetting.upsert({
      where: { sectionName },
      update: {
        title,
        description,
        ...(bannerUrl && { bannerUrl }),
      },
      create: {
        sectionName,
        title,
        description,
        bannerUrl,
      },
    });
  } catch (err: any) {
    console.error(err);
    return { error: "Failed to update section settings." };
  }

  revalidatePath("/admin/dashboard/grade-wise-camps/settings");
  revalidatePath("/");
  return { success: true };
}
