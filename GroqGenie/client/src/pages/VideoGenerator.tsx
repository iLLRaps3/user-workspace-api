
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoGenerator from "@/components/VideoGenerator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function VideoGeneratorPage() {
  const [_, navigate] = useLocation();
  
  // Get initial prompt from URL params if coming from prompt builder
  const urlParams = new URLSearchParams(window.location.search);
  const initialPrompt = urlParams.get('prompt') || '';

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
            <h1 className="text-3xl font-bold text-foreground">AI Video Generator</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Generate stunning videos using MiniMax's advanced AI models. 
              Support for text-to-video, image-to-video, and subject reference generation.
            </p>
          </div>
        </div>

        <VideoGenerator initialPrompt={initialPrompt} />
      </div>

      <Footer />
    </div>
  );
}
