import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getRandomUsers } from "@/lib/actions/user.action";
import FollowButton from "./FollowButton";

async function WhoToFollow() {
  const users = await getRandomUsers();

  if (users.length === 0) return null;

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Suggested for you
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between group"
          >
            {/* Profile Info */}
            <div className="flex items-center gap-3">
              <Link href={`/profile/${user.username}`}>
                <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary transition">
                  <AvatarImage src={user.image ?? "/avatar.png"} />
                </Avatar>
              </Link>
              <div className="text-sm leading-tight">
                <Link
                  href={`/profile/${user.username}`}
                  className="font-semibold hover:underline"
                >
                  {user.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  @{user.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user._count.followers} followers
                </p>
              </div>
            </div>

            {/* Follow Button */}
            <FollowButton userId={user.id} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default WhoToFollow;
