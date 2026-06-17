import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { question, answer, isActive, order } = await req.json();
    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        isActive: isActive ?? true,
        order: order ?? 0
      }
    });
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
