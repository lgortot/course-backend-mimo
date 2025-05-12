import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'sqlite',                    // drizzle setup with sqlite (can be put in .env too for "decoupling")
  schema: './src/db/schema*.ts',         // database schema for migrations (includes all files prefixed with "schema")
  out: "./drizzle/migrations",          // migrations folder
  dbCredentials: {
    url: process.env.DATABASE_URL as string,                 // sqlite database path
  },
})