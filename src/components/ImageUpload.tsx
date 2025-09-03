// components/ImageUpload.tsx
"use client";

import { useState, useRef } from "react";
import { ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
        toast.success("Image uploaded!");
      } else {
        throw new Error("No URL returned");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  if (value) {
    return (
      <div className="relative">
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full shadow-sm text-white"
          type="button"
          aria-label="Remove image"
        >
          <XIcon className="h-3 w-3" />
        </button>
        <Image
          src={value}
          alt="Uploaded image"
          className="max-h-20 rounded-md object-cover"
        />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading || disabled}
        className="flex items-center text-blue-500 hover:bg-blue-500/10 px-2 py-1 rounded-full transition"
        aria-label="Upload image"
      >
        {isUploading ? (
          <Loader2Icon className="w-5 h-5 animate-spin" />
        ) : (
          <ImageIcon className="w-5 h-5" />
        )}
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isUploading || disabled}
        className="hidden"
      />
    </>
  );
}
