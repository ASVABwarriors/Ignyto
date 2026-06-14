"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";

export async function createAdmin(data: any) {
  const session = await getSession();
  
  if (!session || session.role !== "SUPERADMIN") {
    return { error: "Unauthorized. Only superadmins can create admins." };
  }

  const { email, name, phone, password } = data;

  if (!email || !password || !name || !phone) {
    return { error: "All fields are required." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    return { error: "User already exists with this email." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      phone,
      password: hashedPassword,
      role: "ADMIN",
      isTwoFactorEnabled: false // Force QR code scan on first login
    }
  });

  return { success: true };
}
