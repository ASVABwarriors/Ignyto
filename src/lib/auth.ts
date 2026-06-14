import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.SESSION_SECRET || "fallback_super_secret_ignyto_key";

export async function createSession(userId: string, role: string) {
  const token = jwt.sign({ userId, role }, SECRET, { expiresIn: "1d" });
  
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string, role: string };
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
