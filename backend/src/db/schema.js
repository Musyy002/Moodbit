import {
    pgTable,
    text,
    integer,
    timestamp,
  } from "drizzle-orm/pg-core";
  
export const users = pgTable("users", {
    id: text("id").primaryKey(), // Clerk userId
    email: text("email").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  });

  export const expenses = pgTable("expenses", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    amount: integer("amount").notNull(),
    category: text("category").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow(),
  });

  export const budgets = pgTable("budgets", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    monthlyLimit: integer("monthly_limit").notNull(),
  });

  export const userStats = pgTable("user_stats", {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id),
  
    xp: integer("xp").default(0),
    level: integer("level").default(1),
  
    saverDays: integer("saver_days").default(0),
    happyDays: integer("happy_days").default(0),
  
    badges: text("badges").array().default([]),
  });
  