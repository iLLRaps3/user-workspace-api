import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "./use-toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface GroqResponse {
  content: string;
  model: string;
  usageTokens: number;
}

export function useGroq() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessageToGroq = async (messages: Message[]): Promise<GroqResponse> => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest("POST", "/api/groq/chat", {
        messages
      });
      
      const data = await response.json();
      
      return {
        content: data.content,
        model: data.model,
        usageTokens: data.usageTokens
      };
    } catch (error) {
      console.error("Error sending message to Groq:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessageToGroq,
    isLoading
  };
}
