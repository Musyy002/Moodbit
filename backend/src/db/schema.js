import {
    pgTable,
    text,
    integer,
    timestamp,
  } from "drizzle-orm/pg-core";

//Users Table:
export const users = pgTable("users", {
    id: text("id").primaryKey(), 
    email: text("email").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  });

//Expenses Table:
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

//Budgets Table:
export const budgets = pgTable("budgets", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    monthlyLimit: integer("monthly_limit").notNull(),
  });

//User Stats Table:
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
