import { 
  users, 
  chats, 
  creditTransactions, 
  prompts,
  type User, 
  type InsertUser,
  type Chat,
  type InsertChat,
  type UpdateChat,
  type CreditTransaction,
  type InsertCreditTransaction,
  type Prompt,
  type Message
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  getUserCredits(id: number): Promise<number>;
  updateUserCredits(id: number, amount: number): Promise<number>;
  updateUserPlan(id: number, plan: string): Promise<User>;
  
  // Chat operations
  getChat(id: number): Promise<Chat | undefined>;
  getUserChats(userId: number, limit?: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  updateChat(id: number, chatData: UpdateChat): Promise<Chat>;
  deleteChat(id: number): Promise<void>;
  
  // Credit transaction operations
  createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;
  getUserTransactions(userId: number): Promise<CreditTransaction[]>;
  
  // Prompt operations
  getPrompt(id: number): Promise<Prompt | undefined>;
  getPrompts(featured?: boolean): Promise<Prompt[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserCredits(id: number): Promise<number> {
    const [user] = await db
      .select({ credits: users.credits })
      .from(users)
      .where(eq(users.id, id));
    
    return user?.credits || 0;
  }

  async updateUserCredits(id: number, amount: number): Promise<number> {
    const [user] = await db
      .update(users)
      .set({ credits: amount, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({ credits: users.credits });
    
    return user.credits;
  }

  async updateUserPlan(id: number, plan: string): Promise<User> {
    const isPremium = plan !== "basic";
    
    const [user] = await db
      .update(users)
      .set({ 
        plan, 
        premium: isPremium,
        updatedAt: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    
    return user;
  }

  // Chat operations
  async getChat(id: number): Promise<Chat | undefined> {
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    return chat;
  }

  async getUserChats(userId: number, limitCount: number = 10): Promise<Chat[]> {
    return db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt))
      .limit(limitCount);
  }

  async createChat(chatData: InsertChat): Promise<Chat> {
    const [chat] = await db.insert(chats).values(chatData).returning();
    return chat;
  }

  async updateChat(id: number, chatData: UpdateChat): Promise<Chat> {
    const [chat] = await db
      .update(chats)
      .set({ ...chatData, updatedAt: new Date() })
      .where(eq(chats.id, id))
      .returning();
    return chat;
  }

  async deleteChat(id: number): Promise<void> {
    await db.delete(chats).where(eq(chats.id, id));
  }

  // Credit transaction operations
  async createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const [creditTransaction] = await db
      .insert(creditTransactions)
      .values(transaction)
      .returning();
    return creditTransaction;
  }

  async getUserTransactions(userId: number): Promise<CreditTransaction[]> {
    return db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt));
  }

  // Prompt operations
  async getPrompt(id: number): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt;
  }

  async getPrompts(featured: boolean = false): Promise<Prompt[]> {
    if (featured) {
      return db
        .select()
        .from(prompts)
        .where(eq(prompts.featured, true))
        .limit(4);
    }
    
    return db.select().from(prompts);
  }
}

export const storage = new DatabaseStorage();
