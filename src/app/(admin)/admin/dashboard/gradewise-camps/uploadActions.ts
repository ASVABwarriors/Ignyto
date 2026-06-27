"use server";

import { v2 as cloudinary } from 'cloudinary';
import { getSession } from '@/lib/auth';

cloudinary.config({
  secure: true,
});

export async function getCloudinarySignature(folder: string = "ignyto_courses") {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    throw new Error("Unauthorized");
  }

  const timestamp = Math.round((new Date).getTime() / 1000);
  const config = cloudinary.config();

  const signature = cloudinary.utils.api_sign_request({
    timestamp,
    folder
  }, config.api_secret!);

  return {
    timestamp,
    signature,
    cloudName: config.cloud_name,
    apiKey: config.api_key,
    folder
  };
}
