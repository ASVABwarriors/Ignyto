import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, grade, worksheetId } = body;

    if (!name || !email || !grade || !worksheetId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify worksheet exists
    const worksheet = await prisma.worksheet.findUnique({
      where: { id: worksheetId },
    });

    if (!worksheet) {
      return NextResponse.json({ error: "Worksheet not found" }, { status: 404 });
    }

    const downloadRecord = await prisma.worksheetDownload.create({
      data: {
        name,
        email,
        grade,
        worksheetId,
      },
    });

    return NextResponse.json(downloadRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating worksheet download record:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
