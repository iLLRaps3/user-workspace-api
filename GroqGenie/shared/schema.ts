import { pgTable, text, serial, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  credits: integer("credits").notNull().default(100),
  premium: boolean("premium").notNull().default(false),
  plan: text("plan").notNull().default("basic"),
  profileImageUrl: text("profile_image_url"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Chat table
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  icon: text("icon").default("robot"),
  model: text("model").default("llama-3.3-70b-versatile"),
  messages: json("messages").$type<Message[]>().notNull(),
  lastMessage: text("last_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Message interface for the messages array in chats
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

// Credit transactions table
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // purchase, usage, refund, bonus
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Prompt library table
export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  icon: text("icon").default("lightbulb"),
  iconColor: text("icon_color").default("text-blue-600"),
  bgColor: text("bg_color").default("bg-blue-100"),
  premium: boolean("premium").default(false),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Session table for authentication
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
});

export const insertChatSchema = createInsertSchema(chats).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateChatSchema = createInsertSchema(chats).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const creditTransactionSchema = z.object({
  amount: z.number().positive(),
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Chat = typeof chats.$inferSelect;
export type InsertChat = typeof chats.$inferInsert;
export type UpdateChat = Partial<InsertChat>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;
export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = typeof prompts.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
