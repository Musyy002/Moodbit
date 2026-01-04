import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

console.log("DB URL exists:", !!process.env.DATABASE_URL);
