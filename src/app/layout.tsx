import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "react-hot-toast";
import LeftSidebar from "@/components/LeftSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import RightSidebar from "@/components/RIghtSidebar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Postagram",
  description:
    "A modern social media app to share moments, connect, and explore.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex bg-background text-foreground">
              {/* Left Sidebar */}
              <div className="hidden lg:flex lg:w-64 flex-col border-r">
                <LeftSidebar />
              </div>

              {/* Main Feed */}
              <main className="flex-1 max-w-4xl w-full border-r min-h-screen px-4">
                {children}
              </main>

              {/* Right Sidebar */}
              <div className="hidden xl:flex xl:w-96 flex-col px-4 py-6">
                <RightSidebar />
              </div>
            </div>

            {/* Mobile bottom nav */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background">
              <MobileBottomNav />
            </div>

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
