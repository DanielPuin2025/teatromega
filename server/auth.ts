import { eq } from "drizzle-orm";
import { students, users } from "../drizzle/schema";
import { requireDb } from "./db";
import * as crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex"));
    });
  });
}

export async function authenticateUser(username: string, password: string) {
  const db = await requireDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) return null;
  if (user.status !== "active") return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  await db
    .update(users)
    .set({ lastSignedIn: new Date() })
    .where(eq(users.id, user.id));

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function createUser(input: {
  username: string;
  password: string;
  name: string;
  email?: string;
  role: "admin" | "teacher" | "student";
}) {
  const db = await requireDb();
  const hashedPassword = await hashPassword(input.password);

  const result = await db.insert(users).values({
    username: input.username,
    password: hashedPassword,
    name: input.name,
    email: input.email || null,
    role: input.role,
    status: "active",
  });

  const userId = Number(result[0].insertId);
  const [created] = await db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return created;
}

export async function listUsers() {
  const db = await requireDb();
  return db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      lastSignedIn: users.lastSignedIn,
    })
    .from(users)
    .orderBy(users.name);
}

export async function updateUser(input: {
  id: number;
  name?: string;
  email?: string;
  role?: "admin" | "teacher" | "student";
  status?: "active" | "inactive";
  password?: string;
}) {
  const db = await requireDb();
  const updateData: Record<string, any> = {};

  if (input.name) updateData.name = input.name;
  if (input.email !== undefined) updateData.email = input.email || null;
  if (input.role) updateData.role = input.role;
  if (input.status) updateData.status = input.status;
  if (input.password) updateData.password = await hashPassword(input.password);

  await db.update(users).set(updateData).where(eq(users.id, input.id));

  const [updated] = await db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .where(eq(users.id, input.id))
    .limit(1);

  return updated;
}

export async function deleteUser(userId: number) {
  const db = await requireDb();
  await db.update(students).set({ userId: null }).where(eq(students.userId, userId));
  await db.delete(users).where(eq(users.id, userId));
  return { success: true };
}
