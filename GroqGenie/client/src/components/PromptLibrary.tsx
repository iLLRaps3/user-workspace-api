import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { PromptCategories } from "@/lib/constants";

export default function PromptLibrary() {
  const [_, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const { data: prompts, isLoading } = useQuery({
    queryKey: ["/api/prompts?featured=true"],
  });

  const handlePromptClick = (prompt: any) => {
    if (prompt.premium && !user?.premium) {
      toast({
        title: "Premium Prompt",
        description: "This prompt template requires a premium subscription.",
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
    
    navigate(`/chat/new?prompt=${prompt.id}`);
  };

  // Use placeholder prompts if API hasn't loaded yet
  const displayPrompts = isLoading || !prompts ? PromptCategories : prompts;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Prompt Library</h2>
        <button 
          onClick={() => navigate("/prompts")}
          className="text-sm text-primary-600 font-medium"
        >
          View all
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayPrompts.map((prompt) => (
          <div 
            key={prompt.id}
            className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer"
            onClick={() => handlePromptClick(prompt)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 ${prompt.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <i className={`${prompt.icon} ${prompt.iconColor} text-sm`}></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{prompt.title}</h3>
                <p className="text-sm text-gray-500">{prompt.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
