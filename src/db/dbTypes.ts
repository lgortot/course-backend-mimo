import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { User } from './schemaTables';

/**
 * Drizzle User data model for SELECT operations.
 */
export type UserRow = InferSelectModel<typeof User>;
/**
 * Drizzle User data model for INSERT operations.
 */
export type NewUserRow = InferInsertModel<typeof User>;