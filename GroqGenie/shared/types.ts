import { Message } from "./schema";

// Extended user type for frontend
export interface User {
  id: number;
  username: string;
  email: string;
  credits: number;
  premium: boolean;
  plan: string;
  profileImageUrl?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Chat type for frontend
export interface Chat {
  id: number;
  userId: number;
  title: string;
  icon: string;
  model: string;
  messages: Message[];
  lastMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Prompt type for frontend
export interface Prompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  premium: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Credit transaction type
export interface CreditTransaction {
  id: number;
  userId: number;
  amount: number;
  type: "purchase" | "usage" | "refund" | "bonus";
  description?: string;
  createdAt: Date;
}

// Groq API response type
export interface GroqChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: null;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Payment plan type
export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}

// Simplified response types for frontend
export interface UserResponse {
  user: User;
}

export interface ChatResponse {
  chat: Chat;
}

export interface CreditsResponse {
  credits: number;
}
