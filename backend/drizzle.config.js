import 'dotenv/config';

export default {
  schema: "./src/db/schema.js",
  out: './drizzle',

  dialect: 'postgresql', // ✅ IMPORTANT (this fixes the error)

  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
