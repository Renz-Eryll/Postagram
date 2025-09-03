// app/notifications/NotificationsClient.tsx
"use client";

import {
  getNotifications,
  markNotificationsAsRead,
} from "@/lib/actions/notification.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NotifSkeleton } from "@/components/NotifSkeleton";
import Image from "next/image";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "LIKE":
      return <HeartIcon className="w-4 h-4 text-red-500" />;
    case "COMMENT":
      return <MessageCircleIcon className="w-4 h-4 text-blue-500" />;
    case "FOLLOW":
      return <UserPlusIcon className="w-4 h-4 text-green-500" />;
    default:
      return null;
  }
};

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notifications>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data.map((n) => ({ ...n, read: true }))); // Optimistically mark as read

        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length > 0) {
          await markNotificationsAsRead(unreadIds);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) return <NotifSkeleton />;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl shadow-sm border">
        <CardHeader className="border-b pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Notifications
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {unreadCount} unread
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No notifications yet 🚀
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-4 border-b transition-colors hover:bg-muted/30 ${
                    !n.read ? "border-l-4 border-l-primary bg-muted/20" : ""
                  }`}
                >
                  {/* Avatar */}
                  <Avatar className="mt-1 shrink-0">
                    <AvatarImage
                      src={n.creator.image ?? "/avatar.png"}
                      alt={`${n.creator.name ?? n.creator.username}'s avatar`}
                    />
                    <AvatarFallback>
                      {n.creator.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {getNotificationIcon(n.type)}
                      <span>
                        <span className="font-medium">
                          {n.creator.name ?? n.creator.username}
                        </span>{" "}
                        {n.type === "FOLLOW"
                          ? "started following you"
                          : n.type === "LIKE"
                          ? "liked your post"
                          : "commented on your post"}
                      </span>
                    </div>

                    {/* Post Preview */}
                    {n.post && (n.type === "LIKE" || n.type === "COMMENT") && (
                      <div className="ml-6 space-y-2">
                        <div className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
                          <p className="line-clamp-2">{n.post.content}</p>
                          {n.post.image && (
                            <Image
                              src={n.post.image}
                              alt="Post preview"
                              className="mt-2 rounded-md w-full max-w-[220px] h-auto object-cover"
                            />
                          )}
                        </div>

                        {n.type === "COMMENT" && n.comment && (
                          <div className="text-xs bg-accent/40 p-2 rounded-md">
                            {n.comment.content}
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground ml-6">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
