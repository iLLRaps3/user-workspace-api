import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/Header";
import ChatInput from "@/components/ChatInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, MoreVertical, Copy, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGroq } from "@/hooks/useGroq";
import { CategoryIcons } from "@/lib/constants";
import { useCredits } from "@/hooks/useCredits";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [_, navigate] = useLocation();
  const { credits, refreshCredits } = useCredits();
  const [match, params] = useRoute("/chat/:id?");
  const chatId = params?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [chatIcon, setChatIcon] = useState("graduation-cap");
  const { deductCredits } = useCredits();
  const { sendMessageToGroq } = useGroq();

  const searchParams = new URLSearchParams(window.location.search);
  const initialMessage = searchParams.get("message");

  // Check authentication after all hooks are called
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  // Fetch chat if ID exists
  const { data: chatData, isLoading } = useQuery({
    queryKey: [chatId ? `/api/chats/${chatId}` : null],
    enabled: !!chatId && chatId !== "new",
  });

  useEffect(() => {
    if (chatData) {
      setMessages(chatData.messages || []);
      setChatTitle(chatData.title || "Chat");
      setChatIcon(chatData.icon || "graduation-cap");
    }
  }, [chatData]);

  // Handle initial message from search params
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleUserMessage(initialMessage);
      // Clear the URL parameter without navigating
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [initialMessage]);

  // Always scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Create a new chat
  const createChatMutation = useMutation({
    mutationFn: async (data: { title: string; messages: Message[] }) => {
      const res = await apiRequest("POST", "/api/chats", data);
      return res.json();
    },
    onSuccess: (data) => {
      // Navigate to the new chat
      navigate(`/chat/${data.id}`, { replace: true });
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
    },
    onError: (error) => {
      toast({
        title: "Error creating chat",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  // Update an existing chat
  const updateChatMutation = useMutation({
    mutationFn: async (data: { messages: Message[] }) => {
      const res = await apiRequest(
        "PATCH",
        `/api/chats/${chatId}`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chats/${chatId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating chat",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  const handleUserMessage = async (content: string) => {
    // Add user message to the UI immediately
    const userMessage: Message = { role: "user", content, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Deduct credits for the API call
      const creditResult = await deductCredits(1);
      if (!creditResult.success) {
        toast({
          title: "Insufficient credits",
          description: "Please purchase more credits to continue using the service",
          variant: "destructive",
        });
        setIsTyping(false);
        return;
      }

      // Send to Groq API
      const aiResponse = await sendMessageToGroq(updatedMessages);

      // Add AI response to UI
      const assistantMessage: Message = { 
        role: "assistant", 
        content: aiResponse.content,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Save to database
      if (chatId && chatId !== "new") {
        updateChatMutation.mutate({ messages: finalMessages });
      } else {
        // Create new chat with a title based on the first message
        createChatMutation.mutate({ 
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          messages: finalMessages
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getIconClass = (icon: string) => {
    return CategoryIcons[icon] || "fa-graduation-cap";
  };

  const formatTimestamp = useCallback((timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Message content copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  }, [toast]);

  const formatMessageContent = useCallback((content: string) => {
    // Enhanced markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        // Code blocks
        if (line.startsWith('```')) {
          return (
            <div key={i} className="bg-void p-3 rounded-md border border-primary/20 font-mono text-sm overflow-x-auto my-2">
              <code className="text-accent">{line.slice(3)}</code>
            </div>
          );
        }
        // Inline code
        line = line.replace(/`([^`]+)`/g, '<code class="bg-void px-1 py-0.5 rounded text-accent font-mono text-sm">$1</code>');
        // Bold text
        line = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-primary font-bold">$1</strong>');
        // Italic text
        line = line.replace(/\*([^*]+)\*/g, '<em class="text-secondary italic">$1</em>');

        return (
          <p key={i} className="mb-1 text-sm sm:text-base mobile-text-sm" dangerouslySetInnerHTML={{ __html: line }} />
        );
      });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <header className="bg-background shadow-md py-2 px-3 border-b border-primary/30 flex items-center justify-between sticky top-0 z-10 evil-gradient">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
            className="mr-2 text-foreground hover:bg-primary/20"
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary/20 flex items-center justify-center mr-2 evil-border">
              <i className={`fas ${getIconClass(chatIcon)} text-accent text-glow-accent text-sm`}></i>
            </div>
            <h1 className="font-medium text-foreground text-sm sm:text-base text-glow">{chatTitle}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-accent hover:bg-primary/20 w-8 h-8">
            <Share2 size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="text-accent hover:bg-primary/20 w-8 h-8">
            <MoreVertical size={16} />
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="overflow-auto p-3 pb-20 h-[calc(100vh-120px)] mobile-full">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* System Message - Today's date */}
          <div className="text-center my-3">
            <span className="inline-block bg-muted text-foreground/80 text-xs px-3 py-1 rounded-full border border-primary/20">
              Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Message list */}
          {messages.map((message, index) => (
            <div key={index} className={`group flex ${message.role === "user" ? "justify-end mb-3" : "mb-3"} hover:bg-background/50 rounded-lg p-1 transition-all duration-200`}>
              {message.role === "assistant" && (
                <div className="flex-shrink-0 mr-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary flex items-center justify-center evil-border shadow-lg">
                    <span className="text-white font-bold text-xs text-glow">iLL</span>
                  </div>
                </div>
              )}

              <div className={`relative ${
                message.role === "user" 
                  ? "bg-primary/10 text-foreground rounded-lg rounded-tr-none max-w-[80%] border border-primary/30 shadow-md" 
                  : "bg-muted border border-secondary/30 rounded-lg max-w-[80%] shadow-md"
              } p-2 sm:p-3 mobile-compact transition-all duration-200 hover:shadow-xl hover:border-accent/50`}>

                {/* Message controls */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-foreground/60 hover:text-accent hover:bg-background/50"
                    onClick={() => copyToClipboard(message.content)}
                  >
                    <Copy size={12} />
                  </Button>
                </div>

                <div className="pr-8">
                  {formatMessageContent(message.content)}
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-foreground/50">
                    {formatTimestamp(message.timestamp)}
                  </div>
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-1 text-xs text-accent/70">
                      <i className="fas fa-magic-wand-sparkles text-glow-accent"></i>
                      <span>AI</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex mb-3">
              <div className="flex-shrink-0 mr-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary flex items-center justify-center evil-border">
                  <span className="text-white font-bold text-xs">iLL</span>
                </div>
              </div>
              <div className="bg-muted px-4 py-2 rounded-lg inline-block border border-secondary/30">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{animationDelay: "0.2s"}}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{animationDelay: "0.4s"}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input - fixed at the very bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/30 p-2 sm:p-3 evil-gradient z-50">
        <div className="max-w-3xl mx-auto">
          <ChatInput 
            onSubmit={handleUserMessage} 
            placeholder="Message iLL AI..."
            disabled={isTyping} 
          />
        </div>
      </div>
    </div>
  );
}