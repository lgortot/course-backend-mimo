import { z } from "zod";

/**
 * Domain User model to be used with repository abstraction.
 */
export interface IUser {
  id: number;
  username: string;
}

/**
 * Zod schema for User upsert operations.
 * - `id` is optional (client apps don't have to care)
 * - `username` is mandatory and must be non-empty, hence "min 1"
 */
export const UserUpsertSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(1, "Username is required."),
});

/**
 * TypeScript DTO inferred from Zod schema
 */
export type UserUpsertDto = z.infer<typeof UserUpsertSchema>;
