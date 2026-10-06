"use server";
import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";

export async function getNotifications() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
}

export async function getUnreadNotificationCount() {
  try {
    const userId = await getDbUserId();
    if (!userId) return 0;

    return await prisma.notification.count({
      where: { userId, read: false },
    });
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    return 0;
  }
}

export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false };

    // Scope to the current user so nobody can mark someone else's notifications
    await prisma.notification.updateMany({
      where: {
        userId,
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false };
  }
}
