// components/RightSidebar.tsx
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import WhoToFollow from "./WhoToFollow";

export default function RightSidebar() {
  return (
    <aside
      className="hidden lg:block w-[320px] shrink-0 top-5 fixed "
      aria-label="Right sidebar"
    >
      <div className="sticky top-0 bg-background pb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-full bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search"
        />
      </div>
      <div className="sticky top-20 space-y-6">
        {/* Suggested accounts */}
        <WhoToFollow />

        {/* Trends */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Trending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["#NextJS", "#React", "#OpenAI"].map((tag) => (
              <div key={tag} className="text-sm">
                <p className="font-medium">{tag}</p>
                <p className="text-muted-foreground text-xs">12.3K posts</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-xs text-muted-foreground space-x-3">
          <span>About</span>
          <span>Help</span>
          <span>Press</span>
          <span>API</span>
          <span>Jobs</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">&copy; 2025 Postagram</p>
    </aside>
  );
}
