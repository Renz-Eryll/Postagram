// components/PostCard.tsx
"use client";

import { getPosts } from "@/lib/actions/post.action"; // For type inference
import {
  createComment,
  deletePost,
  toggleLike,
} from "@/lib/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { HeartIcon, LogInIcon, MessageCircleIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import Image from "next/image";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

export default function PostCard({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (isLiking || !user) return;
    try {
      setIsLiking(true);
      const newHasLiked = !hasLiked;
      setHasLiked(newHasLiked);
      setOptimisticLikes((prev) => prev + (newHasLiked ? 1 : -1));
      await toggleLike(post.id);
    } catch (error) {
      console.error(error);
      setHasLiked(!hasLiked); // Revert
      setOptimisticLikes(post._count.likes); // Revert
      toast.error("Failed to toggle like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting || !user) return;
    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success) {
        toast.success("Comment posted successfully");
        setNewComment("");
        // Optionally refetch comments or optimistic update
      } else {
        throw new Error("Comment creation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting || dbUserId !== post.author.id) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) {
        toast.success("Post deleted successfully");
      } else {
        throw new Error(result.error ?? "Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="border-b border-muted-foreground/20 p-4 hover:bg-muted/30 transition">
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <Link
          href={`/profile/${post.author.username}`}
          aria-label={`${post.author.name}'s profile`}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.image ?? "/avatar.png"} />
            <AvatarFallback>{post.author.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </Link>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <Link
                href={`/profile/${post.author.username}`}
                className="font-semibold hover:underline truncate"
              >
                {post.author.name}
              </Link>
              <span className="text-sm text-muted-foreground truncate">
                @{post.author.username} ·{" "}
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </span>
            </div>
            {dbUserId === post.author.id && (
              <DeleteAlertDialog
                isDeleting={isDeleting}
                onDelete={handleDeletePost}
              />
            )}
          </div>

          {/* Text */}
          <p className="mt-2 text-sm sm:text-base">{post.content}</p>

          {/* Image */}
          {post.image && (
            <div className="mt-3 rounded-xl overflow-hidden border">
              <Image
                src={post.image}
                alt="Post image"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-6 mt-3 text-sm text-muted-foreground">
            {/* Like */}
            {user ? (
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 hover:text-red-500 transition ${
                  hasLiked ? "text-red-500" : ""
                }`}
                aria-label={hasLiked ? "Unlike" : "Like"}
                aria-pressed={hasLiked}
              >
                <HeartIcon
                  className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`}
                />
                {optimisticLikes}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="flex items-center gap-2 hover:text-red-500"
                  aria-label="Sign in to like"
                >
                  <HeartIcon className="w-5 h-5" />
                  {optimisticLikes}
                </button>
              </SignInButton>
            )}

            {/* Comment */}
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className={`flex items-center gap-2 hover:text-blue-500 transition ${
                showComments ? "text-blue-500" : ""
              }`}
              aria-label={showComments ? "Hide comments" : "Show comments"}
              aria-expanded={showComments}
            >
              <MessageCircleIcon className="w-5 h-5" />
              {post.comments.length}
            </button>
          </div>

          {/* Comments */}
          {showComments && (
            <div className="mt-4 space-y-4 border-t pt-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author.image ?? "/avatar.png"} />
                    <AvatarFallback>
                      {comment.author.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{comment.author.name}</span>
                      <span className="text-muted-foreground">
                        @{comment.author.username}
                      </span>
                      <span className="text-muted-foreground">
                        · {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}

              {user ? (
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                    <AvatarFallback>
                      {user?.firstName?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Post your reply"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="resize-none min-h-[60px]"
                      aria-label="Reply content"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isCommenting}
                      >
                        {isCommenting ? "Replying..." : "Reply"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center p-3 border rounded-lg bg-muted/40">
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm" className="gap-2">
                      <LogInIcon className="w-4 h-4" /> Sign in to reply
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
