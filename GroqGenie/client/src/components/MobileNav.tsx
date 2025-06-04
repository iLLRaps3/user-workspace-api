import { useLocation } from "wouter";
import { Home, Compass, Clock, User } from "lucide-react";

export default function MobileNav() {
  const [location, navigate] = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path === "/explore" && location === "/explore") return true;
    if (path === "/recents" && location.startsWith("/chat")) return true;
    if (path === "/profile" && location === "/profile") return true;
    return false;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-primary/50 py-1 evil-gradient">
      <div className="flex justify-around">
        <button 
          className={`flex flex-col items-center p-2 ${
            isActive("/") ? "text-primary text-glow" : "text-foreground/80"
          }`}
          onClick={() => navigate("/")}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-2 ${
            isActive("/explore") ? "text-accent text-glow-accent" : "text-foreground/80"
          }`}
          onClick={() => navigate("/explore")}
        >
          <Compass className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Explore</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-2 ${
            isActive("/recents") ? "text-secondary text-glow" : "text-foreground/80"
          }`}
          onClick={() => navigate("/chat")}
        >
          <Clock className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Chats</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-2 ${
            isActive("/profile") ? "text-primary text-glow" : "text-foreground/80"
          }`}
          onClick={() => navigate("/profile")}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
}
