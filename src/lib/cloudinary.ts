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

export async function deleteFromCloudinary(url: string, resourceType: "image" | "raw" = "image") {
  try {
    if (!url) return;

    // Example url: https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg
    // Need to extract: sample (or folder/sample)
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return;

    let path = urlParts[1];
    
    // Remove version like "v1234567890/"
    const versionRegex = /^v\d+\//;
    path = path.replace(versionRegex, '');

    // Remove extension
    const extensionIdx = path.lastIndexOf('.');
    const publicId = extensionIdx !== -1 ? path.substring(0, extensionIdx) : path;

    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
  }
}
