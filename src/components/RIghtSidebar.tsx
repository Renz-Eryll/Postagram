// components/RightSidebar.tsx
import WhoToFollow from "./WhoToFollow";

export default function RightSidebar() {
  return (
    <aside
      className="hidden lg:block w-[320px] shrink-0 top-5 fixed "
      aria-label="Right sidebar"
    >
      <div className="sticky top-0 space-y-6">
        {/* Suggested accounts */}
        <WhoToFollow />
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        &copy; {new Date().getFullYear()} Postagram
      </p>
    </aside>
  );
}
