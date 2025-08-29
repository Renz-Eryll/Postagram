"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/lib/actions/post.action";
import toast from "react-hot-toast";

function CreatePost() {
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
      }
    } catch {
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="border-b border-muted-foreground/20 p-4 flex space-x-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={user?.imageUrl || "/avatar.png"} />
      </Avatar>

      <div className="flex-1">
        <Textarea
          placeholder="What's happening?"
          className="w-full resize-none border-none focus-visible:ring-0 p-3 text-base"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPosting}
        />

        {imageUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border">
            <img src={imageUrl} alt="preview" className="w-full object-cover" />
          </div>
        )}

        <div className="flex items-center justify-between mt-3 border-t pt-3">
          <button
            type="button"
            onClick={() => toast("Image upload UI goes here")}
            className="flex items-center text-blue-500 hover:bg-blue-500/10 px-2 py-1 rounded-full transition"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

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
export default CreatePost;
