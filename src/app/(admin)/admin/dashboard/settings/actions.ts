"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { verify } from "otplib";

export async function updateSettings(data: any) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const { name, email, phone, token } = data;

  if (!name || !email || !phone || !token) {
    return { error: "All fields are required, including the 2FA token." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  
  if (!user || !user.twoFactorSecret) {
    return { error: "User or 2FA configuration not found." };
  }

  // Verify 2FA token before allowing changes
  const isValid = verify({ token, secret: user.twoFactorSecret });
  if (!isValid) {
    return { error: "Invalid 2FA code." };
  }

  // Check if new email is already taken
  if (email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Email is already in use by another account." };
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, email, phone }
  });

  return { success: true };
}
