import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dtpkdwlwv',
  api_key: '172922531957453',
  api_secret: 'ngVRB11c_D1PwZ7H9hwd3Siu-aM',
  secure: true
});

async function run() {
  const dummyPdfBase64 = 'JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCAyNAo+PgpzdHJlYW0KQlQgL0YxIDEyIFRmIDcwMCA3MDAgVGQgKFRlc3QgUERGKSBUaiBFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDc3IDAwMDAwIG4gCjAwMDAwMDAxNTQgMDAwMDAgbiAKMDAwMDAwMDI1NiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjMyNwolJUVPRg==';
  const buffer = Buffer.from(dummyPdfBase64, 'base64');

  try {
    console.log("Uploading PDF as raw resource type with no extension...");
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: 'test_syllabus',
          resource_type: 'raw',
          public_id: 'test_syllabus_raw_file', // No extension
        },
        (error, res) => {
          if (error) reject(error);
          else resolve(res);
        }
      ).end(buffer);
    });

    console.log("Upload Success! Secure URL:", result.secure_url);
    console.log("Fetching uploaded raw file...");
    const fetchRes = await fetch(result.secure_url);
    console.log("Fetch response status:", fetchRes.status);
    console.log("Fetch X-Cld-Error:", fetchRes.headers.get("x-cld-error"));
    if (fetchRes.ok) {
      const text = await fetchRes.text();
      console.log("Fetched file content starts with:", text.slice(0, 10));
    }
  } catch (err) {
    console.error("Failed:", err);
  }
}

run();
