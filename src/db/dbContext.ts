import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database(process.env.DATABASE_URL as string);
/**
 * The database context used by Drizzle ORM for interacting with the SQLite database.
 * 
 * This instance is configured with a connection to the database using the DATABASE_URL
 * environment variable and is used for all database queries.
 */
export const dbContext = drizzle({ client: sqlite });