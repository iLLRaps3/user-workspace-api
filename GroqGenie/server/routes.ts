import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { isAuthenticated, generateToken, hashPassword, comparePassword } from "./auth";
import { insertUserSchema, creditTransactionSchema, insertChatSchema, updateChatSchema } from "@shared/schema";
import Stripe from "stripe";
import axios from "axios";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import cookieParser from "cookie-parser";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-04-30.basil" })
  : null;

// Initialize API clients
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MINIMAX_API_URL = "https://api.minimaxi.chat/v1";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add middleware
  app.use(cookieParser());

  // Auth routes
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { username, email, password } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        credits: 100, // Give new users 100 free credits
        premium: false,
        plan: "basic",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Generate token
      const token = generateToken(user.id);
      
      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate token
      const token = generateToken(user.id);
      
      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/user", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Credit routes
  app.get("/api/credits", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const credits = await storage.getUserCredits(user.id);
      res.status(200).json({ credits });
    } catch (error) {
      console.error("Get credits error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/credits/deduct", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { amount } = creditTransactionSchema.parse(req.body);
      
      // Get current credits
      const currentCredits = await storage.getUserCredits(user.id);
      
      // Check if user has enough credits
      if (currentCredits < amount) {
        return res.status(400).json({ message: "Insufficient credits" });
      }
      
      // Deduct credits
      const newCredits = await storage.updateUserCredits(user.id, currentCredits - amount);
      
      // Log transaction
      await storage.createCreditTransaction({
        userId: user.id,
        amount: -amount,
        type: "usage",
        description: "API usage",
        createdAt: new Date()
      });
      
      res.status(200).json({ credits: newCredits });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Deduct credits error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/credits/add", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { amount } = creditTransactionSchema.parse(req.body);
      
      // Get current credits
      const currentCredits = await storage.getUserCredits(user.id);
      
      // Add credits
      const newCredits = await storage.updateUserCredits(user.id, currentCredits + amount);
      
      // Log transaction
      await storage.createCreditTransaction({
        userId: user.id,
        amount: amount,
        type: "purchase",
        description: "Credit purchase",
        createdAt: new Date()
      });
      
      res.status(200).json({ credits: newCredits });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Add credits error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Chat routes
  app.get("/api/chats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const limit = Number(req.query.limit) || 10;
      const chats = await storage.getUserChats(user.id, limit);
      res.status(200).json(chats);
    } catch (error) {
      console.error("Get chats error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/chats/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const chatId = Number(req.params.id);
      
      // Get chat
      const chat = await storage.getChat(chatId);
      
      // Check if chat exists and belongs to user
      if (!chat || chat.userId !== user.id) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      res.status(200).json(chat);
    } catch (error) {
      console.error("Get chat error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/chats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const chatData = insertChatSchema.parse(req.body);
      
      // Create chat with proper type handling
      const chat = await storage.createChat({
        title: chatData.title,
        icon: chatData.icon,
        model: chatData.model,
        lastMessage: chatData.lastMessage,
        messages: Array.isArray(chatData.messages) 
          ? chatData.messages.map((msg: any) => ({
              role: msg.role as "user" | "assistant" | "system",
              content: msg.content,
              timestamp: msg.timestamp
            })) 
          : [],
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      res.status(201).json(chat);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Create chat error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/chats/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const chatId = Number(req.params.id);
      const chatData = updateChatSchema.parse(req.body);
      
      // Get chat
      const chat = await storage.getChat(chatId);
      
      // Check if chat exists and belongs to user
      if (!chat || chat.userId !== user.id) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      // Update chat with proper Message type handling
      const chatDataToUpdate: any = {
        ...chatData,
        updatedAt: new Date()
      };
      
      // Ensure messages are correctly typed if present
      if (chatData.messages) {
        chatDataToUpdate.messages = Array.isArray(chatData.messages) 
          ? chatData.messages.map(msg => ({
              role: msg.role as "user" | "assistant" | "system",
              content: msg.content,
              timestamp: msg.timestamp
            })) 
          : [];
      }
      
      const updatedChat = await storage.updateChat(chatId, chatDataToUpdate);
      
      res.status(200).json(updatedChat);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Update chat error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/chats/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const chatId = Number(req.params.id);
      
      // Get chat
      const chat = await storage.getChat(chatId);
      
      // Check if chat exists and belongs to user
      if (!chat || chat.userId !== user.id) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      // Delete chat
      await storage.deleteChat(chatId);
      
      res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
      console.error("Delete chat error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Prompt library routes
  app.get("/api/prompts", async (req: Request, res: Response) => {
    try {
      const featured = req.query.featured === "true";
      const prompts = await storage.getPrompts(featured);
      res.status(200).json(prompts);
    } catch (error) {
      console.error("Get prompts error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Groq API routes
  app.post("/api/groq/chat", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { messages, model = "llama-3.3-70b-versatile" } = req.body;
      
      if (!GROQ_API_KEY) {
        return res.status(500).json({ message: "Groq API key not configured" });
      }
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required" });
      }
      
      // Format messages properly for Groq API
      const formattedMessages = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call Groq API
      const response = await axios.post(
        GROQ_API_URL,
        {
          model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1024,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          }
        }
      );
      
      // Extract the response content
      const responseData = response.data;
      const content = responseData.choices[0].message.content;
      const usageTokens = responseData.usage ? responseData.usage.total_tokens : 0;
      
      res.status(200).json({
        content,
        model: responseData.model,
        usageTokens
      });
    } catch (error) {
      console.error("Groq API error:", error);
      
      if (axios.isAxiosError(error)) {
        return res.status(error.response?.status || 500).json({
          message: error.response?.data?.error?.message || "Failed to get response from Groq API"
        });
      }
      
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Stripe configuration status
  app.get("/api/stripe/status", async (req: Request, res: Response) => {
    try {
      const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
      const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
      
      res.status(200).json({
        configured: hasStripeKey && hasWebhookSecret,
        hasSecretKey: hasStripeKey,
        hasWebhookSecret: hasWebhookSecret
      });
    } catch (error) {
      console.error("Stripe status check error:", error);
      res.status(500).json({ message: "Failed to check Stripe configuration" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-checkout", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe not configured" });
      }
      
      const user = (req as any).user;
      const { planId, priceAmount, credits } = req.body;
      
      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
                description: `${credits} credits`
              },
              unit_amount: Math.round(priceAmount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get("host")}/pricing`,
        metadata: {
          userId: user.id.toString(),
          planId,
          credits: credits.toString()
        },
      });
      
      res.status(200).json({ checkoutUrl: session.url });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.post("/api/webhook/stripe", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe not configured" });
      }
      
      const sig = req.headers["stripe-signature"] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!endpointSecret) {
        return res.status(500).json({ message: "Stripe webhook secret not configured" });
      }
      
      let event;
      
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return res.status(400).json({ message: "Webhook signature verification failed" });
      }
      
      // Handle the event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Process the payment
        if (session.payment_status === "paid") {
          const userId = Number(session.metadata?.userId);
          const planId = session.metadata?.planId;
          const credits = Number(session.metadata?.credits);
          
          if (userId && planId && credits) {
            // Update user's plan and add credits
            await storage.updateUserPlan(userId, planId);
            const currentCredits = await storage.getUserCredits(userId);
            await storage.updateUserCredits(userId, currentCredits + credits);
            
            // Log transaction
            await storage.createCreditTransaction({
              userId,
              amount: credits,
              type: "purchase",
              description: `${planId} plan purchase`,
              createdAt: new Date()
            });
          }
        }
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Stripe webhook error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Video generation routes
  app.post("/api/video/generate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { prompt, model = "T2V-01" } = req.body;
      
      if (!MINIMAX_API_KEY) {
        return res.status(500).json({ message: "MiniMax API key not configured" });
      }
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const response = await axios.post(
        `${MINIMAX_API_URL}/video_generation`,
        {
          prompt,
          model
        },
        {
          headers: {
            "Authorization": `Bearer ${MINIMAX_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      res.json({ taskId: response.data.task_id });
    } catch (error) {
      console.error("Video generation error:", error);
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json({ 
          message: error.response?.data?.message || "Video generation failed" 
        });
      } else {
        res.status(500).json({ message: "Video generation failed" });
      }
    }
  });

  app.get("/api/video/status/:taskId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      
      if (!MINIMAX_API_KEY) {
        return res.status(500).json({ message: "MiniMax API key not configured" });
      }
      
      const response = await axios.get(
        `${MINIMAX_API_URL}/query/video_generation?task_id=${taskId}`,
        {
          headers: {
            "Authorization": `Bearer ${MINIMAX_API_KEY}`
          }
        }
      );
      
      res.json(response.data);
    } catch (error) {
      console.error("Video status check error:", error);
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json({ 
          message: error.response?.data?.message || "Status check failed" 
        });
      } else {
        res.status(500).json({ message: "Status check failed" });
      }
    }
  });

  app.get("/api/video/download/:fileId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { fileId } = req.params;
      
      if (!MINIMAX_API_KEY) {
        return res.status(500).json({ message: "MiniMax API key not configured" });
      }
      
      const response = await axios.get(
        `${MINIMAX_API_URL}/files/retrieve?file_id=${fileId}`,
        {
          headers: {
            "Authorization": `Bearer ${MINIMAX_API_KEY}`
          }
        }
      );
      
      res.json({ downloadUrl: response.data.file.download_url });
    } catch (error) {
      console.error("Video download error:", error);
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json({ 
          message: error.response?.data?.message || "Download failed" 
        });
      } else {
        res.status(500).json({ message: "Download failed" });
      }
    }
  });

  // Prompt optimization route
  app.post("/api/prompt/optimize", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { 
        prompt, 
        style, 
        cartoonStyle, 
        duration, 
        cameraMovement, 
        lighting, 
        effects, 
        realisticLevel, 
        hideTextOnScreen 
      } = req.body;
      
      if (!GROQ_API_KEY) {
        return res.status(500).json({ message: "Groq API key not configured" });
      }
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const systemPrompt = `You are an expert AI video prompt optimizer specializing in creating professional prompts for AI video generation models like MiniMax T2V. Your expertise includes:

- Film production techniques and cinematography
- Visual effects and post-production
- Animation styles and cartoon aesthetics
- Music video production (especially Cole Bennett/Lyrical Lemonade style)
- Advanced camera movements and lighting setups

Transform basic prompts into detailed, professional video generation prompts that will produce stunning results.

Guidelines:
- Be extremely specific about visual elements, lighting, and composition
- Include technical camera details and movements
- Specify mood, atmosphere, and aesthetic style
- Add post-production effects when relevant
- Consider realistic vs stylized balance
- Focus on cinematic storytelling elements
- Keep prompts detailed but well-structured`;

      let styleDetails = '';
      if (style) {
        styleDetails += `Style: ${style}`;
        if (style === 'cartoon' && cartoonStyle) {
          styleDetails += ` (specifically ${cartoonStyle} style)`;
        } else if (style === 'cole-bennett') {
          styleDetails += ' - Include vibrant colors, creative transitions, animated elements, dynamic camera work, and surreal visual effects typical of Lyrical Lemonade music videos';
        } else if (style === 'trippy') {
          styleDetails += ' - Include psychedelic colors, warping effects, kaleidoscope patterns, and mind-bending visuals';
        } else if (style === 'glitch') {
          styleDetails += ' - Include digital glitch effects, data corruption aesthetics, and cyberpunk elements';
        }
        styleDetails += '\n';
      }

      const userMessage = `Optimize this video prompt: "${prompt}"

Parameters:
${styleDetails}${duration ? `Duration: ${duration}\n` : ''}${cameraMovement ? `Camera movement: ${cameraMovement}\n` : ''}${lighting ? `Lighting: ${lighting}\n` : ''}${effects && effects.length > 0 ? `Effects: ${effects.join(', ')}\n` : ''}${realisticLevel !== undefined ? `Realistic level: ${realisticLevel}% (0=highly stylized, 100=photorealistic)\n` : ''}${hideTextOnScreen ? 'Note: Ensure no visible text or captions appear in the video\n' : ''}
Return ONLY the optimized prompt without explanations or additional text.`;

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 512,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          }
        }
      );
      
      const optimizedPrompt = response.data.choices[0].message.content;
      res.json({ optimizedPrompt });
    } catch (error) {
      console.error("Prompt optimization error:", error);
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json({ 
          message: error.response?.data?.message || "Prompt optimization failed" 
        });
      } else {
        res.status(500).json({ message: "Prompt optimization failed" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
