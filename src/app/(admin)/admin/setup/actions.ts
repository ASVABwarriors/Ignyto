"use server";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { generateSecret, verify } from "otplib";
import qrcode from "qrcode";

export async function checkSetupStatus() {
  const superadmin = await prisma.user.findFirst({
    where: { role: "SUPERADMIN" }
  });
  return !!superadmin; // true if locked, false if setup is available
}

export async function initSuperadmin(data: any) {
  const { name, email, phone, password } = data;

  if (!name || !email || !password || !phone) {
    return { error: "All fields are required." };
  }

  const isLocked = await checkSetupStatus();
  if (isLocked) {
    return { error: "Superadmin already exists. Setup is locked." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      role: "SUPERADMIN",
      isTwoFactorEnabled: false
    }
  });

  // Generate 2FA
  const secret = generateSecret();
  const issuer = "Ignyto Admin";
  const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
  const qrCodeDataUrl = await qrcode.toDataURL(otpauth);

  return { 
    success: true, 
    userId: user.id, 
    secret, 
    qrCodeDataUrl 
  };
}

export async function verifySuperadminSetup(data: any) {
  const { userId, secret, token } = data;

  const isValid = verify({ token, secret });
  
  if (!isValid) {
    return { error: "Invalid 2FA code." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { 
      twoFactorSecret: secret,
      isTwoFactorEnabled: true
    }
  });

  await createSession(userId, "SUPERADMIN");
  return { success: true };
}
