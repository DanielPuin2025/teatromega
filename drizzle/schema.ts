import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["admin", "teacher", "student"]).notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
});

export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 180 }).notNull(),
  document: varchar("document", { length: 40 }),
  grade: varchar("grade", { length: 20 }).default("11").notNull(),
  groupName: varchar("groupName", { length: 20 }).default("11A").notNull(),
  userId: int("userId"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const attendanceSessions = mysqlTable("attendanceSessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionDate: varchar("sessionDate", { length: 10 }).notNull(),
  activity: varchar("activity", { length: 160 }).notNull(),
  groupName: varchar("groupName", { length: 20 }).default("11A").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const attendanceRecords = mysqlTable("attendanceRecords", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  studentId: int("studentId").notNull(),
  status: mysqlEnum("status", ["present", "absent", "late", "excused"]).notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Student = typeof students.$inferSelect;
export type AttendanceSession = typeof attendanceSessions.$inferSelect;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
