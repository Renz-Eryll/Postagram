// "use client";
// import { useState } from "react";
// import { XIcon } from "lucide-react";
// import toast from "react-hot-toast";

// interface ImageUploadProps {
//   value: string;
//   onChange: (url: string) => void;
// }

// export default function ImageUpload({ value, onChange }: ImageUploadProps) {
//   const [isUploading, setIsUploading] = useState(false);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onloadend = async () => {
//       setIsUploading(true);
//       try {
//         const res = await fetch("/api/upload-image", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ file: reader.result }),
//         });
//         const data = await res.json();
//         if (data.url) {
//           onChange(data.url);
//           toast.success("Image uploaded!");
//         } else {
//           toast.error("Upload failed");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Upload failed");
//       } finally {
//         setIsUploading(false);
//       }
//     };
//   };

//   if (value) {
//     return (
//       <div className="relative w-40 h-40">
//         <img
//           src={value}
//           alt="Upload"
//           className="rounded-md w-full h-full object-cover"
//         />
//         <button
//           onClick={() => onChange("")}
//           className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm"
//           type="button"
//         >
//           <XIcon className="h-4 w-4 text-white" />
//         </button>
//       </div>
//     );
//   }

//   return (
//     <input
//       type="file"
//       accept="image/*"
//       onChange={handleFileChange}
//       disabled={isUploading}
//       className="border p-2 rounded-md"
//     />
//   );
// }
