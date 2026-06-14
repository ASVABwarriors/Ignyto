import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from the environment variable CLOUDINARY_URL
cloudinary.config({
  secure: true,
});

export async function uploadImageToCloudinary(buffer: Buffer, folder: string = "ignyto_courses") {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}
