import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function PremiumBanner() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();

  // Don't show premium banner for premium users
  if (user?.premium) {
    return null;
  }

  const handleClick = () => {
    navigate("/pricing");
  };

  return (
    <>
      {/* Desktop version */}
      <Button
        variant="outline"
        onClick={handleClick}
        className="hidden md:flex items-center px-3 py-1.5 bg-background/80 text-sm font-medium border border-primary/50 hover:bg-primary/20 evil-border"
      >
        <span className="mr-1">
          <i className="fas fa-skull text-accent text-glow-accent"></i>
        </span>
        <span className="text-glow">GO PREMIUM</span>
        <i className="fas fa-bolt ml-1 text-xs text-accent"></i>
      </Button>

      {/* Mobile version (full width banner) */}
      <div 
        className="md:hidden bg-gradient-to-r from-primary/20 to-secondary/20 p-2 flex items-center justify-between w-full border-y border-primary/30" 
        onClick={handleClick}
      >
        <div className="flex items-center">
          <i className="fas fa-skull text-accent mr-2 text-glow-accent"></i>
          <span className="text-sm text-foreground text-glow">GO PREMIUM</span>
        </div>
        <i className="fas fa-bolt text-accent text-xs"></i>
      </div>
    </>
  );
}
