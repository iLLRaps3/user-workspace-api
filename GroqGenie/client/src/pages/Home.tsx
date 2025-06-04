import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import PremiumBanner from "@/components/PremiumBanner";
import ModelSelector from "@/components/ModelSelector";
import CategoryNav from "@/components/CategoryNav";
import ToolGrid from "@/components/ToolGrid";
import RecentChats from "@/components/RecentChats";
import PromptLibrary from "@/components/PromptLibrary";
import ChatInput from "@/components/ChatInput";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedModel, setSelectedModel] = useState("Groq"); // Default model

  const handlePromptSubmit = (message: string) => {
    // Create a new chat and navigate to it
    if (message.trim()) {
      // In a real app, we'd create the chat on the server first
      navigate("/chat/new?message=" + encodeURIComponent(message));
    } else {
      toast({
        title: "Empty message",
        description: "Please enter a message to start a chat",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      {/* Mobile Premium Banner */}
      <div className="md:hidden">
        <PremiumBanner />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28">
          <ModelSelector 
            selectedModel={selectedModel} 
            onSelectModel={setSelectedModel} 
          />
          
          <CategoryNav 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
          
          <ToolGrid 
            category={selectedCategory} 
            premium={!!user?.premium} 
          />
          
          <RecentChats />
          
          <PromptLibrary />
        </div>
      </main>

      {/* Chat Input - fixed at bottom */}
      <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 bg-background border-t border-primary/30 p-2 sm:p-3 evil-gradient z-40">
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            onSubmit={handlePromptSubmit} 
            placeholder="Message iLL AI..." 
          />
        </div>
      </div>
      
      {/* Mobile Navigation - at very bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
        <MobileNav />
      </div>
      
      {/* Footer with attribution - hide on mobile */}
      <div className="hidden sm:block">
        <Footer />
      </div>
    </div>
  );
}
