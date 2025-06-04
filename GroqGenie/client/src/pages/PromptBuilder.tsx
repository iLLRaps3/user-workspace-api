
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptBuilder from "@/components/PromptBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PromptBuilderPage() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">AI Video Prompt Builder</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create detailed prompts for AI video generation with our comprehensive modifier system. 
              Perfect for tools like Hailuo AI, Runway, and other video generation platforms.
            </p>
          </div>
        </div>

        <PromptBuilder />
      </div>

      <Footer />
    </div>
  );
}
