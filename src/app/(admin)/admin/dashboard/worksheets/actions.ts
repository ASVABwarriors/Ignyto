"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function createWorksheet(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const grade = formData.get("grade") as string;
    const estimatedTime = formData.get("estimatedTime") as string;
    const questionCount = formData.get("questionCount") as string;
    const pdfUrl = formData.get("pdfUrl") as string;
    const heroImage = formData.get("heroImage") as string;
    const conceptImage = formData.get("conceptImage") as string;
    const learningObjectives = formData.get("learningObjectives") as string;
    const downloadFeatures = formData.get("downloadFeatures") as string;
    const pdfPageCount = formData.get("pdfPageCount") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const previewImagesStr = formData.get("previewImages") as string;
    let previewImages: string[] = [];
    if (previewImagesStr) {
      try {
        previewImages = JSON.parse(previewImagesStr);
      } catch (e) {}
    }

    await prisma.worksheet.create({
      data: {
        title,
        slug,
        description,
        grade,
        estimatedTime,
        questionCount,
        pdfUrl,
        heroImage: heroImage || null,
        conceptImage: conceptImage || null,
        learningObjectives: learningObjectives || null,
        downloadFeatures: downloadFeatures || null,
        pdfPageCount: pdfPageCount || null,
        isFeatured,
        previewImages,
      },
    });

    revalidatePath("/admin/dashboard/worksheets");
    revalidatePath("/worksheets");
    return { success: true };
  } catch (err: any) {
    if (err.code === 'P2002') {
      return { error: "A worksheet with this slug already exists." };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function updateWorksheet(id: string, formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const grade = formData.get("grade") as string;
    const estimatedTime = formData.get("estimatedTime") as string;
    const questionCount = formData.get("questionCount") as string;
    const pdfUrl = formData.get("pdfUrl") as string;
    const heroImage = formData.get("heroImage") as string;
    const conceptImage = formData.get("conceptImage") as string;
    const learningObjectives = formData.get("learningObjectives") as string;
    const downloadFeatures = formData.get("downloadFeatures") as string;
    const pdfPageCount = formData.get("pdfPageCount") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const previewImagesStr = formData.get("previewImages") as string;
    let previewImages: string[] = [];
    if (previewImagesStr) {
      try {
        previewImages = JSON.parse(previewImagesStr);
      } catch (e) {}
    }

    await prisma.worksheet.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        grade,
        estimatedTime,
        questionCount,
        pdfUrl,
        heroImage: heroImage || null,
        conceptImage: conceptImage || null,
        learningObjectives: learningObjectives || null,
        downloadFeatures: downloadFeatures || null,
        pdfPageCount: pdfPageCount || null,
        isFeatured,
        previewImages,
      },
    });

    revalidatePath("/admin/dashboard/worksheets");
    revalidatePath("/worksheets");
    revalidatePath(`/worksheets/${slug}`);
    return { success: true };
  } catch (err: any) {
    if (err.code === 'P2002') {
      return { error: "A worksheet with this slug already exists." };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function deleteWorksheet(id: string) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    const worksheet = await prisma.worksheet.findUnique({
      where: { id },
    });

    if (worksheet) {
      if (worksheet.pdfUrl) await deleteFromCloudinary(worksheet.pdfUrl, "raw");
      if (worksheet.heroImage) await deleteFromCloudinary(worksheet.heroImage, "image");
      if (worksheet.conceptImage) await deleteFromCloudinary(worksheet.conceptImage, "image");
      if (worksheet.previewImages && worksheet.previewImages.length > 0) {
        for (const img of worksheet.previewImages) {
          await deleteFromCloudinary(img, "image");
        }
      }
    }

    await prisma.worksheet.delete({
      where: { id },
    });
    revalidatePath("/admin/dashboard/worksheets");
    revalidatePath("/worksheets");
    return { success: true };
  } catch (err: any) {
    return { error: "Failed to delete worksheet." };
  }
}

export async function toggleWorksheetFeatured(id: string, isFeatured: boolean) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.worksheet.update({
      where: { id },
      data: { isFeatured },
    });

    revalidatePath("/admin/dashboard/worksheets");
    revalidatePath("/worksheets");
    return { success: true };
  } catch (err: any) {
    return { error: "Failed to update worksheet status." };
  }
}
