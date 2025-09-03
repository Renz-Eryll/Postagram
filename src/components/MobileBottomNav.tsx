// components/MobileBottomNav.tsx
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
    <nav
      className="fixed bottom-0 left-0 right-0 border-t bg-background flex justify-around items-center py-3 z-50"
      aria-label="Mobile navigation"
    >
      {/* Home */}
      <Link href="/" aria-label="Home">
        <HomeIcon className="w-6 h-6" />
      </Link>

      {/* Search */}
      <Link href="/search" aria-label="Search">
        <SearchIcon className="w-6 h-6" />
      </Link>

      {/* Notifications + Profile only if signed in */}
      {isSignedIn && (
        <>
          <Link href="/notifications" aria-label="Notifications">
            <BellIcon className="w-6 h-6" />
          </Link>
          <Link href={profileUrl} aria-label="Profile">
            <UserIcon className="w-6 h-6" />
          </Link>
        </>
      )}

      {/* Mode Toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-1 rounded-full"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>
      )}
    </nav>
  );
}
