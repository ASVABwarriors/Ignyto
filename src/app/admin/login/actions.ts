"use server";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { generateSecret, verify } from "otplib";
import qrcode from "qrcode";

export async function verifyCredentials(data: any) {
  const { email, password } = data;
  
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN") || !user.password) {
    return { error: "Invalid credentials." };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    return { error: "Invalid credentials." };
  }

  if (!user.isTwoFactorEnabled) {
    // Generate new secret for onboarding
    const secret = generateSecret();
    const issuer = "Ignyto Admin";
    const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    const qrCodeDataUrl = await qrcode.toDataURL(otpauth);
    
    return { 
      success: true, 
      needsSetup: true, 
      userId: user.id,
      setupData: { secret, qrCodeDataUrl }
    };
  }

  return { success: true, needsSetup: false, userId: user.id };
}

export async function verifyLogin2FA(data: any) {
  const { email, password, token, isSetup, setupSecret } = data;
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return { error: "Invalid login state." };
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { error: "Invalid credentials." };
  }

  const secretToVerify = isSetup ? setupSecret : user.twoFactorSecret;
  if (!secretToVerify) {
    return { error: "2FA secret not found." };
  }

  const isValid = verify({ token, secret: secretToVerify });
  if (!isValid) {
    return { error: "Invalid 2FA code." };
  }

  if (isSetup) {
    // Save the secret and mark as enabled
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        twoFactorSecret: setupSecret,
        isTwoFactorEnabled: true
      }
    });
  }

  await createSession(user.id, user.role);
  return { success: true };
}
