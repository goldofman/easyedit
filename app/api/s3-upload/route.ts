import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_REGION = process.env.AWS_REGION ?? "eu-north-1"; 
const BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET;

if (!S3_REGION || !BUCKET) {
  console.warn("Missing S3 config: S3_REGION or NEXT_PUBLIC_S3_BUCKET");
}

const s3 = new S3Client({
  region: S3_REGION,
});

export async function POST(request: Request) {
  try {
    const contentType = (request.headers.get("content-type") || "").toLowerCase();

    // Branch A: client asks for a presigned PUT url (sends JSON { filename, contentType })
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const filename = body.filename ?? `upload-${Date.now()}`;
      const key = `edmypic/uploads/${Date.now()}-${filename}`;
      const contentTypeHeader = body.contentType ?? "application/octet-stream";

      const cmd = new PutObjectCommand({
        Bucket: BUCKET!,
        Key: key,
        ContentType: contentTypeHeader,
        // ACL: "public-read", // ВИДАЛЕНО: Слід керувати доступом через Bucket Policy
      });

      const signedUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 }); // 5 min

      // Використовуємо узгоджений регіон для публічного URL
      const publicUrl = `https://${BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`; 

      return NextResponse.json({ url: signedUrl, bucket: BUCKET, key, publicUrl }, { status: 200 });
    }

    // ... (Branch B та C залишаються без змін, крім можливого видалення ACL)

    // Якщо це не спрацює, ймовірно, проблема з Content-Type або ACL. 

    // ...
  } catch (err) {
    console.error("s3-upload error:", err);
    return NextResponse.json({ error: "Upload failed", details: String(err) }, { status: 500 });
  }
}