// components/CreatePost.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/lib/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import Image from "next/image";

export default function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        setContent("");
        setImageUrl("");
        toast.success("Post created successfully");
      } else {
        throw new Error("Post creation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="border-b border-muted-foreground/20 p-4 flex space-x-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>{user?.firstName?.[0] ?? "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <Textarea
          placeholder="What's happening?"
          className="w-full resize-none border-none focus-visible:ring-0 p-3 text-base"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPosting}
          aria-label="Post content"
        />

        {imageUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border">
            <Image
              width={20}
              height={20}
              src={imageUrl}
              alt="preview"
              className="w-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-3 border-t pt-3">
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            disabled={isPosting}
          />

          <Button
            onClick={handleSubmit}
            disabled={(!content.trim() && !imageUrl) || isPosting}
            className="rounded-full px-6"
          >
            {isPosting ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
