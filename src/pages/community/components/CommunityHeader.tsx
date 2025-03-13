
import { useUser } from "@/contexts/UserContext";

export function CommunityHeader() {
  const { user } = useUser();
  
  return (
    <header className="flex items-center justify-between mb-4 sm:mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-display">Community</h1>
        <p className="text-sm text-muted-foreground">Connect and share with others</p>
      </div>
    </header>
  );
}
