import path from "path";
import { count } from "drizzle-orm";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { users } from "../drizzle/schema";
import { hashPassword } from "./auth";
import { getDb } from "./db";

// Aplica las migraciones pendientes para que la base de datos siempre coincida con el código desplegado.
export async function runMigrations() {
  const db = await getDb();
  if (!db) {
    console.warn("[Bootstrap] DATABASE_URL no configurada: se omiten las migraciones.");
    return;
  }
  await migrate(db, { migrationsFolder: path.resolve(process.cwd(), "drizzle") });
  console.log("[Bootstrap] Migraciones aplicadas.");
}

// Crea el administrador inicial solo si no existe ningún usuario y se definieron las variables.
export async function ensureInitialAdmin() {
  const db = await getDb();
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!db || !username || !password) return;

  const [{ total }] = await db.select({ total: count() }).from(users);
  if (total > 0) return;

  await db.insert(users).values({
    username,
    password: await hashPassword(password),
    name: process.env.ADMIN_NAME || "Administrador",
    role: "admin",
    status: "active",
  });
  console.log(`[Bootstrap] Administrador inicial "${username}" creado.`);
}
