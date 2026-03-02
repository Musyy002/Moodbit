import {
    pgTable,
    text,
    integer,
    timestamp, boolean
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
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
    amount: integer("amount").notNull(),
    category: text("category").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow(),
    isDeleted: boolean("is_deleted").default(false)
  });

//Budgets Table:
export const budgets = pgTable("budgets", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
    monthlyLimit: integer("monthly_limit").notNull(),
  });

//User Stats Table:
export const userStats = pgTable("user_stats", {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  
    xp: integer("xp").default(0),
    level: integer("level").default(1),
  
    saverDays: integer("saver_days").default(0),
    happyDays: integer("happy_days").default(0),
  
    badges: text("badges").array().default([]),
  });


export const userIncome = pgTable("user_income", {
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull().unique(),
  
    amount: integer("amount").notNull(),
    source: text("source"),
    frequency: text("frequency"),
  });
  