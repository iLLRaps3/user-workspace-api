import { useLocation } from "wouter";
import { ToolCards } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ToolGridProps {
  category: string;
  premium: boolean;
}

export default function ToolGrid({ category, premium }: ToolGridProps) {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Filter tools by category if not "All"
  const filteredTools = category === "All" 
    ? ToolCards 
    : ToolCards.filter(tool => tool.categories.includes(category));

  const handleToolClick = (tool: typeof ToolCards[0]) => {
    if (tool.premium && !premium) {
      // Show upgrade message for premium tools
      toast({
        title: "Premium Feature",
        description: "This tool requires a premium subscription. Upgrade to access it.",
        action: (
          <button 
            onClick={() => navigate("/pricing")}
            className="bg-primary-600 text-white px-3 py-1 rounded-md text-xs"
          >
            Upgrade
          </button>
        )
      });
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Special navigation for video generator
    if (tool.id === "video-generator") {
      navigate("/video-generator");
      return;
    }

    // Navigate to a new chat with the selected tool
    navigate(`/chat/new?tool=${tool.id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {filteredTools.map((tool) => (
        <div 
          key={tool.id}
          className="bg-muted rounded-lg evil-border border border-primary/30 p-4 transition duration-300 card-hover cursor-pointer hover:bg-primary/5"
          onClick={() => handleToolClick(tool)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center evil-border">
              <i className={`${tool.icon} text-accent text-glow-accent`}></i>
            </div>
            {tool.popular && (
              <div className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-md border border-secondary/30">
                Most Used
              </div>
            )}
            {tool.premium && (
              <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md border border-primary/30 text-glow">
                Premium
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1 text-glow">{tool.title}</h3>
          <p className="text-foreground/70 text-sm mb-3">{tool.description}</p>
          <div className="flex flex-wrap gap-2">
            {tool.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block bg-accent/10 text-accent text-xs px-2 py-1 rounded-md border border-accent/30"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}