// components/LeftSidebar.tsx
"use client";

import { getNotifications } from "@/lib/actions/notification.action";
import {
  HomeIcon,
  BellIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";

export default function LeftSidebar() {
  const { isSignedIn, user } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { signOut } = useClerk();

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
    <nav
      className="flex flex-col h-full p-4 space-y-4"
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-primary mb-10 ml-1"
        aria-label="Home"
      >
        <Image src="/logo.png" alt="Postagram Logo" width={40} height={40} />
      </Link>

      {/* Navigation Items */}
      <Link
        href="/"
        className="flex items-center gap-3 text-lg font-medium"
        aria-label="Home"
      >
        <HomeIcon className="w-5 h-5" /> Home
      </Link>

      {isSignedIn && (
        <Link
          href="/notifications"
          className="relative flex items-center gap-3 text-lg font-medium"
          aria-label={`Notifications${
            unreadCount > 0 ? `, ${unreadCount} unread` : ""
          }`}
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
          aria-label="Profile"
        >
          <UserIcon className="w-5 h-5" /> Profile
        </Link>
      )}

      {/* Mode Toggle as Sidebar Item */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 text-lg font-medium focus:outline-none"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
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

      <div className="mt-auto border-t py-2">
        {isSignedIn ? (
          <div className="flex items-center justify-between gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Image
                width={40}
                height={40}
                src={user.imageUrl}
                alt={user.fullName || "User avatar"}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col text-sm leading-tight truncate">
                <span className="font-medium truncate">{user.fullName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </div>

            {/* Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="User menu"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <SignInButton mode="modal">
            <Button className="w-full">Sign In</Button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
