import clsx from "clsx";
import { getImageData } from "next-s3-upload";
import { useRef, useState, useTransition } from "react";
import Spinner from "./Spinner";

export function ImageUploader({
  onUpload,
}: {
  onUpload: ({
    url,
    width,
    height,
  }: {
    url: string;
    width: number;
    height: number;
  }) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pending, startTransition] = useTransition();

  async function uploadFileToS3Presigned(file: File) {
    // 1) Request presigned URL from your server
    const presignRes = await fetch("/api/s3-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });

    if (!presignRes.ok) {
      throw new Error(`Presign request failed: ${presignRes.status}`);
    }
    const presignJson = await presignRes.json();
    const signedUrl: string | undefined = presignJson.url;
    const publicUrl: string | undefined = presignJson.publicUrl;

    if (!signedUrl) {
      throw new Error("No presigned URL returned from server");
    }

    // 2) PUT the file directly to S3 using the signed URL
    const putRes = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!putRes.ok) {
      throw new Error(`Upload to S3 failed: ${putRes.status}`);
    }

    // Return the public URL the server computed
    return publicUrl ?? "";
  }

  async function handleUpload(file: File) {
    startTransition(async () => {
      try {
        const data = await getImageData(file);
        const width = data.width ?? 1024;
        const height = data.height ?? 768;

        const publicUrl = await uploadFileToS3Presigned(file);

        onUpload({
          url: publicUrl,
          width,
          height,
        });
      } catch (err) {
        console.error("Upload failed", err);
      }
    });
  }

  return (
    <button
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const data = e.dataTransfer;
        const file = data?.files?.[0];
        if (file) {
          handleUpload(file);
        }
      }}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => {
        setIsDragging(false);
      }}
      onClick={() => {
        fileInputRef.current?.click();
      }}
      className={clsx(
        isDragging && "text-gray-400",
        !isDragging && !pending && "text-gray-700 hover:text-gray-400",
        "relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-gray-900 focus-visible:text-gray-400 focus-visible:outline-none",
      )}
    >
      <svg className={clsx("absolute inset-0 transition-colors")} viewBox="0 0 400 300">
        <rect
          x=".5"
          y=".5"
          width="399"
          height="299"
          rx="6"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8,10"
        />
      </svg>

      {!pending ? (
        <>
          <div className="flex grow flex-col justify-center">
            <p className="text-xl text-white">Drop a photo</p>
            <p className="mt-1 text-gray-500">or click to upload</p>
          </div>
        </>
      ) : (
        <div className="text-white">
          <Spinner />
          <p className="mt-2 text-lg">Uploading...</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleUpload(file);
          }
        }}
        ref={fileInputRef}
      />
    </button>
  );
}
