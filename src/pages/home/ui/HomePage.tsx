import { HomeHeader } from "@/widgets/home-header";
import { HomeFeed } from "@/widgets/home-feed";
import { BottomNav } from "@/widgets/bottom-nav";

export function HomePage() {
  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      <HomeHeader />
      <main className="flex flex-col flex-1 overflow-y-auto min-h-0">
        <HomeFeed />
      </main>
      <BottomNav activeTab="home" />
    </div>
  );
}
