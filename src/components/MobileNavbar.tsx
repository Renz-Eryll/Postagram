// components/MobileNavbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function MobileNavbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b bg-white px-4 py-5 dark:bg-black md:hidden">
      {/* Logo / Brand */}
      <Link href="/" className="text-lg font-bold" aria-label="Postagram Home">
        <Image
          src="/logo.png"
          alt="Postagram Logo"
          width={30}
          height={30}
          className="inline-block mr-2"
        />
        Postagram
      </Link>
    </div>
  );
}
