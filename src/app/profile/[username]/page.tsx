// src/app/profile/[username]/page.tsx
import { type NextPage } from "next";
import { notFound } from "next/navigation";
import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/lib/actions/profile.action";
import { getDbUserId } from "@/lib/actions/user.action";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { username: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ params }: PageProps) {
  const user = await getProfileByUsername(params.username);
  if (!user) return { title: "Profile not found" };

  return {
    title: `${user.name ?? user.username} (@${user.username})`,
    description:
      user.bio || `Check out ${user.username}'s profile on Postagram.`,
  };
}

const ProfilePageServer: NextPage<PageProps> = async ({ params }) => {
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
};

export default ProfilePageServer;
