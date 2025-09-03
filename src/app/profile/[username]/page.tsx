// app/profile/[username]/page.tsx
import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/lib/actions/profile.action";
import { getDbUserId } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import ProfileClient from "./ProfileClient";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const user = await getProfileByUsername(params.username);
  if (!user) return { title: "Profile not found" };

  return {
    title: `${user.name ?? user.username} (@${user.username})`,
    description:
      user.bio || `Check out ${user.username}'s profile on Postagram.`,
  };
}

async function ProfilePageServer({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);

  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing, dbUserId] =
    await Promise.all([
      getUserPosts(user.id),
      getUserLikedPosts(user.id),
      isFollowing(user.id),
      getDbUserId(),
    ]);

  return (
    <ProfileClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
      dbUserId={dbUserId}
    />
  );
}
export default ProfilePageServer;
