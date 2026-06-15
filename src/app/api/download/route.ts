import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");
  const customFilename = searchParams.get("filename");

  if (!fileUrl) {
    return new Response("Missing URL", { status: 400 });
  }

  try {
    const parsedUrl = new URL(fileUrl);
    // Allow only trusted domains (like Cloudinary) or check if it's a PDF
    const isCloudinary = parsedUrl.hostname.includes("cloudinary.com");
    const isPdf = parsedUrl.pathname.toLowerCase().endsWith(".pdf");

    if (!isCloudinary && !isPdf) {
      return new Response("Invalid download URL", { status: 400 });
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "application/pdf";
    const blob = await response.blob();
    
    // Determine filename
    const urlFilename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1) || "syllabus.pdf";
    let filename = customFilename || urlFilename;
    
    // Sanitize filename to only alphanumeric, spaces, dashes, dots, and underscores
    let sanitizedFilename = filename
      .replace(/[^a-zA-Z0-9\s\-_.]/g, "")
      .trim();
    if (!sanitizedFilename.toLowerCase().endsWith(".pdf")) {
      sanitizedFilename += ".pdf";
    }

    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${sanitizedFilename}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new Response("Failed to download file", { status: 500 });
  }
}
