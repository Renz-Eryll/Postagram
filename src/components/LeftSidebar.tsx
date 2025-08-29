"use client";

import { getNotifications } from "@/lib/actions/notification.action";
import { HomeIcon, BellIcon, UserIcon, SunIcon, MoonIcon } from "lucide-react";
import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LeftSidebar() {
  const { isSignedIn, user } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);

    if (isSignedIn) {
      const fetchUnread = async () => {
        try {
          const notifications = await getNotifications();
          const unread = notifications.filter((n) => !n.read).length;
          setUnreadCount(unread);
        } catch (err) {
          console.error("Failed to fetch notifications", err);
        }
      };

      fetchUnread();
    }
  }, [isSignedIn]);

  const profileUrl = user
    ? `/profile/${
        user.username ?? user.primaryEmailAddress?.emailAddress.split("@")[0]
      }`
    : "/profile";

  return (
    <nav className="flex flex-col h-full p-4 space-y-4">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-primary mb-10 ml-1">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
      </Link>

      {/* Navigation Items */}
      <Link href="/" className="flex items-center gap-3 text-lg font-medium">
        <HomeIcon className="w-5 h-5" /> Home
      </Link>

      {isSignedIn && (
        <Link
          href="/notifications"
          className="relative flex items-center gap-3 text-lg font-medium"
        >
          <BellIcon className="w-5 h-5" /> Notifications
          {unreadCount > 0 && (
            <span className="absolute left-5 top-0 -translate-y-1/2 translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
      )}

      {isSignedIn && (
        <Link
          href={profileUrl}
          className="flex items-center gap-3 text-lg font-medium"
        >
          <UserIcon className="w-5 h-5" /> Profile
        </Link>
      )}

      {/* Mode Toggle as Sidebar Item */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 text-lg font-medium focus:outline-none"
        >
          {theme === "dark" ? (
            <>
              <SunIcon className="w-5 h-5" /> Light Mode
            </>
          ) : (
            <>
              <MoonIcon className="w-5 h-5" /> Dark Mode
            </>
          )}
        </button>
      )}

      {/* User Section */}
      <div className="mt-auto">
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <Button className="w-full">Sign In</Button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
