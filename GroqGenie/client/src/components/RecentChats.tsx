import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

export default function RecentChats() {
  const [_, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const { data: chats, isLoading } = useQuery({
    queryKey: [isAuthenticated ? "/api/chats?limit=3" : null],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-foreground font-bold mb-3 text-glow">Recent Chats</h2>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-muted rounded-lg border border-primary/20 evil-border">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-40 bg-primary/20" />
                <Skeleton className="h-4 w-10 bg-primary/20" />
              </div>
              <Skeleton className="h-4 w-full bg-primary/20" />
            </div>
          ))}
        </div>
      ) : chats && chats.length > 0 ? (
        <div className="space-y-3">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              className="p-3 bg-muted rounded-lg border border-primary/30 hover:border-primary/50 transition-colors cursor-pointer evil-border"
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-foreground text-glow">{chat.title}</h3>
                <span className="text-xs text-accent/80">{formatTimeAgo(chat.updatedAt)}</span>
              </div>
              <p className="text-sm text-foreground/70 truncate">{chat.lastMessage}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted rounded-lg border border-primary/30 p-6 text-center evil-border">
          <p className="text-foreground/70 mb-4">No recent conversations yet</p>
          <button 
            className="text-primary text-glow hover:underline"
            onClick={() => navigate('/chat/new')}
          >
            Start a new chat
          </button>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
}
