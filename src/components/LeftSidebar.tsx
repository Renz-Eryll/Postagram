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
      className="hidden lg:flex flex-col fixed top-0 left-0 w-64 h-screen p-6 space-y-4 bg-background border-r z-50"
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-primary mb-10 ml-1 hover:text-primary/80 transition-colors"
        aria-label="Home"
      >
        <Image src="/logo.png" alt="Postagram Logo" width={40} height={40} />
      </Link>

      {/* Navigation Items */}
      <Link
        href="/"
        className="flex items-center gap-3 text-lg font-medium text-foreground py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
        aria-label="Home"
      >
        <HomeIcon className="w-5 h-5" /> Home
      </Link>

      {isSignedIn && (
        <Link
          href="/notifications"
          className="relative flex items-center gap-3 text-lg font-medium text-foreground py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
          aria-label={`Notifications${
            unreadCount > 0 ? `, ${unreadCount} unread` : ""
          }`}
        >
          <BellIcon className="w-5 h-5" /> Notifications
          {unreadCount > 0 && (
            <span className="absolute left-2 top-0 -translate-y-1/2 translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
      )}

      {isSignedIn && (
        <Link
          href={profileUrl}
          className="flex items-center gap-3 text-lg font-medium text-foreground py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
          aria-label="Profile"
        >
          <UserIcon className="w-5 h-5" /> Profile
        </Link>
      )}

      {/* Mode Toggle as Sidebar Item */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 text-lg font-medium text-foreground py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors focus:outline-none"
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

      <div className="mt-auto border-t border-muted-foreground/20 py-4">
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
                <span className="font-medium text-foreground truncate">
                  {user.fullName}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </div>

            {/* Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  aria-label="User menu"
                >
                  <MoreHorizontal className="h-5 w-5 text-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-background border border-muted-foreground/20"
              >
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-foreground hover:bg-muted/50"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <SignInButton mode="modal">
            <Button className="w-full rounded-full">Sign In</Button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
