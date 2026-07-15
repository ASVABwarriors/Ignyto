import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const worksheet = await prisma.worksheet.findUnique({
      where: { slug },
    });

    if (!worksheet || !worksheet.pdfUrl) {
      return new NextResponse("Worksheet not found", { status: 404 });
    }

    // Fetch the PDF from Cloudinary
    const response = await fetch(worksheet.pdfUrl);
    
    if (!response.ok) {
      return new NextResponse("Failed to fetch PDF", { status: 500 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a clean filename
    const filename = `${worksheet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });

  } catch (error) {
    console.error("Error downloading worksheet:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
