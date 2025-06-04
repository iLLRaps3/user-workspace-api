import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import PremiumBanner from "./PremiumBanner";

export default function Header() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { credits } = useCredits();

  return (
    <header className="bg-background shadow-md py-3 px-4 border-b border-primary/20 evil-gradient">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer group transition-all duration-300 hover:scale-105" 
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary flex items-center justify-center evil-border evil-pulse float-animation group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white font-bold text-2xl text-glow group-hover:text-shimmer">iLL</span>
          </div>
          <h1 className="text-xl font-bold text-foreground text-glow group-hover:text-shimmer transition-all duration-300">
            <span className="text-primary">AI</span>
          </h1>
        </div>
        
        {/* Right side: Premium banner, Credits, User menu */}
        <div className="flex items-center space-x-3">
          {/* Premium Banner (desktop only) */}
          <div className="hidden md:block">
            <PremiumBanner />
          </div>
          
          {/* Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => navigate("/")}
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => navigate("/video-generator")}
                className="text-foreground hover:text-primary transition-colors"
              >
                Video Studio
              </button>
              <button 
                onClick={() => navigate("/pricing")}
                className="text-foreground hover:text-primary transition-colors"
              >
                Pricing
              </button>
            </nav>
          )}
          
          {/* Credit Display for logged in users */}
          {isAuthenticated && (
            <div className="flex items-center bg-muted rounded-full px-3 py-1 text-sm font-medium text-foreground border border-primary/30">
              <i className="fas fa-bolt text-accent mr-1 text-glow-accent"></i>
              <span className="text-glow">{credits}</span>
            </div>
          )}
          
          {/* Login/Register buttons for logged out users */}
          {!isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="hidden sm:flex border-primary/50 hover:bg-primary/20"
              >
                Log In
              </Button>
              <Button 
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Sign Up
              </Button>
            </div>
          ) : (
            /* User Avatar for logged in users */
            <div className="relative">
              <button 
                className="w-10 h-10 bg-muted flex items-center justify-center overflow-hidden evil-border"
                onClick={() => navigate("/profile")}
              >
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-accent"></i>
                )}
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-toxic rounded-full border-2 border-background"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
