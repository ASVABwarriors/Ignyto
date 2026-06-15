import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dtpkdwlwv',
  api_key: '172922531957453',
  api_secret: 'ngVRB11c_D1PwZ7H9hwd3Siu-aM',
  secure: true
});

async function run() {
  const publicId = 'courses/syllabus/fdrrvfrvzovdlv0rewul.pdf';
  
  // Method 1: Signed URL
  const signedUrl = cloudinary.url(publicId, {
    resource_type: 'raw',
    type: 'upload',
    sign_url: true
  });
  console.log("Generated Signed URL:", signedUrl);

  try {
    const res = await fetch(signedUrl);
    console.log("Signed URL response status:", res.status);
    console.log("Signed URL X-Cld-Error:", res.headers.get("x-cld-error"));
  } catch (err) {
    console.error("Signed URL fetch failed:", err);
  }
}

run();
