// app/page.tsx
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/actions/post.action";
import { getDbUserId } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const [user, posts, dbUserId] = await Promise.all([
    currentUser(),
    getPosts(),
    getDbUserId(),
  ]);

  return (
    <div className="py-10">
      {user ? <CreatePost /> : null}
      {posts.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">
          No posts yet. Be the first to share something!
        </p>
      ) : (
        <div className="divide-y">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      )}
    </div>
  );
}
