// app/profile/[username]/ProfileClient.tsx
"use client";

import {
  getProfileByUsername,
  getUserPosts,
  updateProfile,
} from "@/lib/actions/profile.action";
import { toggleFollow } from "@/lib/actions/user.action";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;

interface ProfilePageClientProps {
  user: NonNullable<User>;
  posts: Posts;
  likedPosts: Posts;
  isFollowing: boolean;
  dbUserId: string | null;
}

export default function ProfileClient({
  isFollowing: initialIsFollowing,
  likedPosts,
  posts,
  user: initialUser,
  dbUserId,
}: ProfilePageClientProps) {
  const { user: currentUser } = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [user, setUser] = useState(initialUser);

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    image: user.image || "",
  });

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setShowEditDialog(false);
        toast.success("Profile updated successfully");
        // Refresh user data
        const updatedUser = await getProfileByUsername(user.username);
        if (updatedUser) {
          setUser(updatedUser);
          setEditForm({
            name: updatedUser.name || "",
            bio: updatedUser.bio || "",
            location: updatedUser.location || "",
            website: updatedUser.website || "",
            image: updatedUser.image || "",
          });
        }
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const isOwnProfile = currentUser?.id === user.clerkId;

  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

  return (
    <div className="max-w-4xl mt-3 mx-auto" role="main">
      {/* --- Profile Header --- */}
      <div className="relative">
        {/* Banner Placeholder */}
        <div className="h-40 bg-gradient-to-r from-primary/60 to-primary/30 rounded-md" />

        {/* Avatar + Edit/Follow button */}
        <div className="flex justify-between px-4 -mt-12">
          <Avatar className="w-28 h-28 border-4 border-background rounded-full">
            <AvatarImage
              src={user.image ?? "/avatar.png"}
              alt={`${user.name ?? user.username}'s avatar`}
            />
            <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="flex items-center">
            {!currentUser ? (
              <SignInButton mode="modal">
                <Button>Follow</Button>
              </SignInButton>
            ) : isOwnProfile ? (
              <Button onClick={() => setShowEditDialog(true)}>
                <EditIcon className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button
                onClick={handleFollow}
                disabled={isUpdatingFollow}
                variant={isFollowing ? "outline" : "default"}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 mt-4">
          <h1 className="text-xl font-bold">{user.name ?? user.username}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" /> {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={
                  user.website.startsWith("http")
                    ? user.website
                    : `https://${user.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <LinkIcon className="w-4 h-4" /> {user.website}
              </a>
            )}
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              Joined {formattedDate}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 text-sm">
            <span>
              <strong>{user._count.following}</strong>{" "}
              <span className="text-muted-foreground">Following</span>
            </span>
            <span>
              <strong>{user._count.followers}</strong>{" "}
              <span className="text-muted-foreground">Followers</span>
            </span>
            <span>
              <strong>{user._count.posts}</strong>{" "}
              <span className="text-muted-foreground">Posts</span>
            </span>
          </div>
        </div>
      </div>

      {/* --- Tabs Section --- */}
      <Tabs defaultValue="posts" className="mt-6">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="posts"
            className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
              data-[state=active]:bg-transparent px-6 font-semibold"
          >
            <FileTextIcon className="w-4 h-4" /> Posts
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
              data-[state=active]:bg-transparent px-6 font-semibold"
          >
            <HeartIcon className="w-4 h-4" /> Likes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} dbUserId={dbUserId} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No posts yet
            </div>
          )}
        </TabsContent>

        <TabsContent value="likes" className="mt-6">
          {likedPosts.length > 0 ? (
            <div className="space-y-6">
              {likedPosts.map((post) => (
                <PostCard key={post.id} post={post} dbUserId={dbUserId} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No liked posts to show
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* --- Edit Profile Dialog --- */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Avatar</Label>
              <ImageUpload
                value={editForm.image}
                onChange={(url) => setEditForm({ ...editForm, image: url })}
              />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                name="bio"
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                className="min-h-[100px]"
                placeholder="Tell us about yourself"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                name="location"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                placeholder="Where are you based?"
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                name="website"
                value={editForm.website}
                onChange={(e) =>
                  setEditForm({ ...editForm, website: e.target.value })
                }
                placeholder="Your personal website"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
