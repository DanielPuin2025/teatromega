import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { verifyJWT } from "./jwt";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: Pick<User, "id" | "username" | "name" | "email" | "role"> | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: Pick<User, "id" | "username" | "name" | "email" | "role"> | null = null;

  try {
    const token = opts.req.cookies?.[COOKIE_NAME];
    if (token) {
      const payload = await verifyJWT(token);
      if (payload) {
        const db = await getDb();
        if (db) {
          const [dbUser] = await db
            .select({
              id: users.id,
              username: users.username,
              name: users.name,
              email: users.email,
              role: users.role,
            })
            .from(users)
            .where(eq(users.id, payload.userId))
            .limit(1);

          if (dbUser && dbUser.role === payload.role) {
            user = dbUser;
          }
        }
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
