"use client";

import {
  HomeIcon,
  BellIcon,
  UserIcon,
  SearchIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function MobileBottomNav() {
  const { isSignedIn, user } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const profileUrl = user
    ? `/profile/${
        user.username ?? user.primaryEmailAddress?.emailAddress.split("@")[0]
      }`
    : "/profile";

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background flex justify-around items-center py-3 z-50">
      {/* Home */}
      <Link href="/">
        <HomeIcon className="w-6 h-6" />
      </Link>

      {/* Search */}
      <Link href="/search">
        <SearchIcon className="w-6 h-6" />
      </Link>

      {/* Notifications + Profile only if signed in */}
      {isSignedIn && (
        <>
          <Link href="/notifications">
            <BellIcon className="w-6 h-6" />
          </Link>
          <Link href={profileUrl}>
            <UserIcon className="w-6 h-6" />
          </Link>
        </>
      )}

      {/* Mode Toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-1 rounded-full"
        >
          {theme === "dark" ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>
      )}
    </div>
  );
}
