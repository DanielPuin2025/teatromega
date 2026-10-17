import "dotenv/config";
import { hashPassword } from "./auth";
import { requireDb } from "./db";
import { users } from "../drizzle/schema";

async function seed() {
  console.log("Iniciando seed de la base de datos...");

  const db = await requireDb();

  // Crear usuario administrador
  const adminPassword = await hashPassword("admin123");
  await db.insert(users).values({
    username: "admin",
    password: adminPassword,
    name: "Administrador",
    email: "admin@teatroelmega.com",
    role: "admin",
    status: "active",
  }).onDuplicateKeyUpdate({ set: { password: adminPassword } });
  console.log("✓ Usuario administrador creado (username: admin, password: admin123)");

  // Crear usuario docente
  const teacherPassword = await hashPassword("docente123");
  await db.insert(users).values({
    username: "docente",
    password: teacherPassword,
    name: "Docente Encargado",
    email: "docente@teatroelmega.com",
    role: "teacher",
    status: "active",
  }).onDuplicateKeyUpdate({ set: { password: teacherPassword } });
  console.log("✓ Usuario docente creado (username: docente, password: docente123)");

  // Crear usuario estudiante
  const studentPassword = await hashPassword("estudiante123");
  await db.insert(users).values({
    username: "estudiante",
    password: studentPassword,
    name: "Estudiante Demo",
    email: "estudiante@teatroelmega.com",
    role: "student",
    status: "active",
  }).onDuplicateKeyUpdate({ set: { password: studentPassword } });
  console.log("✓ Usuario estudiante creado (username: estudiante, password: estudiante123)");

  console.log("\n¡Seed completado exitosamente!");
  console.log("\nCredenciales de acceso:");
  console.log("  Administrador: admin / admin123");
  console.log("  Docente: docente / docente123");
  console.log("  Estudiante: estudiante / estudiante123");

  process.exit(0);
}

seed().catch((error) => {
  console.error("Error en el seed:", error);
  process.exit(1);
});
