import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { attendanceRecords, attendanceSessions, students } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db;
}

export async function listStudents() {
  const db = await requireDb();
  return db.select().from(students).orderBy(students.fullName);
}

export async function createStudent(input: { fullName: string; document?: string; grade: string; groupName: string }) {
  const db = await requireDb();
  const result = await db.insert(students).values({
    fullName: input.fullName.trim(),
    document: input.document?.trim() || null,
    grade: input.grade.trim(),
    groupName: input.groupName.trim(),
  });
  const id = Number(result[0].insertId);
  const created = await db.select().from(students).where(eq(students.id, id)).limit(1);
  return created[0];
}

export async function updateStudent(input: { id: number; fullName: string; document?: string; grade: string; groupName: string; status?: "active" | "inactive" }) {
  const db = await requireDb();
  await db.update(students).set({
    fullName: input.fullName.trim(),
    document: input.document?.trim() || null,
    grade: input.grade.trim(),
    groupName: input.groupName.trim(),
    status: input.status,
  }).where(eq(students.id, input.id));
  const updated = await db.select().from(students).where(eq(students.id, input.id)).limit(1);
  return updated[0];
}

export async function listSessions(groupName?: string) {
  const db = await requireDb();
  const query = db.select().from(attendanceSessions);
  const filtered = groupName ? query.where(eq(attendanceSessions.groupName, groupName)) : query;
  return filtered.orderBy(desc(attendanceSessions.sessionDate), desc(attendanceSessions.id)).limit(100);
}

export async function getStudentByUserId(userId: number) {
  const db = await requireDb();
  const [student] = await db.select().from(students).where(eq(students.userId, userId)).limit(1);
  return student ?? null;
}

export async function listStudentAttendance(studentId: number) {
  const db = await requireDb();
  return db.select({
    recordId: attendanceRecords.id,
    sessionId: attendanceSessions.id,
    activity: attendanceSessions.activity,
    sessionDate: attendanceSessions.sessionDate,
    groupName: attendanceSessions.groupName,
    status: attendanceRecords.status,
    note: attendanceRecords.note,
  }).from(attendanceRecords)
    .innerJoin(attendanceSessions, eq(attendanceRecords.sessionId, attendanceSessions.id))
    .where(eq(attendanceRecords.studentId, studentId))
    .orderBy(desc(attendanceSessions.sessionDate), desc(attendanceSessions.id));
}

export async function getStudentStats(studentId: number) {
  const records = await listStudentAttendance(studentId);
  const count = (status: string) => records.filter(r => r.status === status).length;
  return { students: 1, sessions: records.length, present: count("present"), absent: count("absent") };
}

export async function updateSession(input: { id: number; sessionDate: string; activity: string; groupName: string }) {
  const db = await requireDb();
  await db.update(attendanceSessions).set({
    sessionDate: input.sessionDate,
    activity: input.activity.trim(),
    groupName: input.groupName,
  }).where(eq(attendanceSessions.id, input.id));
  const [session] = await db.select().from(attendanceSessions).where(eq(attendanceSessions.id, input.id)).limit(1);
  return session;
}

export async function deleteSession(sessionId: number) {
  const db = await requireDb();
  await db.delete(attendanceRecords).where(eq(attendanceRecords.sessionId, sessionId));
  await db.delete(attendanceSessions).where(eq(attendanceSessions.id, sessionId));
  return { success: true };
}

// Vincula una cuenta de usuario (rol estudiante) con su ficha de estudiante; una ficha solo puede tener una cuenta.
export async function linkStudentToUser(userId: number, studentId: number | null) {
  const db = await requireDb();
  await db.update(students).set({ userId: null }).where(eq(students.userId, userId));
  if (studentId !== null) {
    await db.update(students).set({ userId }).where(eq(students.id, studentId));
  }
}

export async function getDashboardStats() {
  const db = await requireDb();
  const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(students).where(eq(students.status, "active"));
  const [sessionCount] = await db.select({ count: sql<number>`count(*)` }).from(attendanceSessions);
  const [presentCount] = await db.select({ count: sql<number>`count(*)` }).from(attendanceRecords).where(eq(attendanceRecords.status, "present"));
  const [absentCount] = await db.select({ count: sql<number>`count(*)` }).from(attendanceRecords).where(eq(attendanceRecords.status, "absent"));
  return { students: Number(studentCount?.count ?? 0), sessions: Number(sessionCount?.count ?? 0), present: Number(presentCount?.count ?? 0), absent: Number(absentCount?.count ?? 0) };
}

export async function createSession(input: { sessionDate: string; activity: string; groupName: string; createdBy: number; studentIds?: number[] }) {
  const db = await requireDb();
  const result = await db.insert(attendanceSessions).values({
    sessionDate: input.sessionDate,
    activity: input.activity,
    groupName: input.groupName,
    createdBy: input.createdBy,
  });
  const sessionId = Number(result[0].insertId);

  // Si se proporcionan IDs de estudiantes específicos, usar esos
  // Si no, vincular todos los estudiantes activos del grupo
  let studentsToLink: { id: number }[] = [];

  if (input.studentIds && input.studentIds.length > 0) {
    // Solo vincular los estudiantes seleccionados
    studentsToLink = input.studentIds.map(id => ({ id }));
  } else {
    // Vincular todos los estudiantes activos del grupo
    const activeStudents = await db.select({ id: students.id }).from(students).where(and(eq(students.status, "active"), eq(students.groupName, input.groupName)));
    studentsToLink = activeStudents;
  }

  if (studentsToLink.length > 0) {
    await db.insert(attendanceRecords).values(studentsToLink.map(student => ({ sessionId, studentId: student.id, status: "absent" as const })));
  }

  const session = await db.select().from(attendanceSessions).where(eq(attendanceSessions.id, sessionId)).limit(1);
  return session[0];
}

export async function listSessionRecords(sessionId: number) {
  const db = await requireDb();
  return db.select({
    recordId: attendanceRecords.id,
    studentId: students.id,
    fullName: students.fullName,
    groupName: students.groupName,
    status: attendanceRecords.status,
    note: attendanceRecords.note,
  }).from(attendanceRecords).innerJoin(students, eq(attendanceRecords.studentId, students.id)).where(eq(attendanceRecords.sessionId, sessionId)).orderBy(students.fullName);
}

export async function updateAttendance(input: { recordId: number; status: "present" | "absent" | "late" | "excused"; note?: string }) {
  const db = await requireDb();
  await db.update(attendanceRecords).set({ status: input.status, note: input.note?.trim() || null }).where(eq(attendanceRecords.id, input.recordId));
  const updated = await db.select().from(attendanceRecords).where(eq(attendanceRecords.id, input.recordId)).limit(1);
  return updated[0];
}

export async function deleteStudent(studentId: number) {
  const db = await requireDb();
  await db.delete(attendanceRecords).where(eq(attendanceRecords.studentId, studentId));
  await db.delete(students).where(eq(students.id, studentId));
  return { success: true };
}

// Nuevas funciones para reportes completos
export async function getFullAttendanceReport() {
  const db = await requireDb();
  const allStudents = await db.select().from(students).where(eq(students.status, "active")).orderBy(students.groupName, students.fullName);

  const results = await Promise.all(allStudents.map(async (student) => {
    const records = await db.select({ status: attendanceRecords.status })
      .from(attendanceRecords)
      .where(eq(attendanceRecords.studentId, student.id));

    const totalSessions = records.length;
    const present = records.filter(r => r.status === "present").length;
    const absent = records.filter(r => r.status === "absent").length;
    const late = records.filter(r => r.status === "late").length;
    const excused = records.filter(r => r.status === "excused").length;
    const attendanceRate = totalSessions > 0 ? Math.round((present / totalSessions) * 100) : 0;

    return {
      studentId: student.id,
      fullName: student.fullName,
      document: student.document,
      groupName: student.groupName,
      grade: student.grade,
      totalSessions,
      present,
      absent,
      late,
      excused,
      attendanceRate
    };
  }));

  return results;
}

export async function getStudentDetailedReport(studentId: number) {
  const db = await requireDb();
  const [student] = await db.select().from(students).where(eq(students.id, studentId)).limit(1);

  if (!student) return null;

  const records = await db.select({
    sessionId: attendanceSessions.id,
    sessionDate: attendanceSessions.sessionDate,
    activity: attendanceSessions.activity,
    status: attendanceRecords.status,
    note: attendanceRecords.note,
  }).from(attendanceRecords)
    .innerJoin(attendanceSessions, eq(attendanceRecords.sessionId, attendanceSessions.id))
    .where(eq(attendanceRecords.studentId, studentId))
    .orderBy(desc(attendanceSessions.sessionDate));

  const totalSessions = records.length;
  const present = records.filter(r => r.status === "present").length;
  const absent = records.filter(r => r.status === "absent").length;
  const late = records.filter(r => r.status === "late").length;
  const excused = records.filter(r => r.status === "excused").length;
  const attendanceRate = totalSessions > 0 ? Math.round((present / totalSessions) * 100) : 0;

  return {
    student,
    records,
    stats: { totalSessions, present, absent, late, excused, attendanceRate }
  };
}

export async function getGroupReport(groupName: string) {
  const db = await requireDb();
  const groupStudents = await db.select().from(students)
    .where(and(eq(students.groupName, groupName), eq(students.status, "active")))
    .orderBy(students.fullName);

  const results = await Promise.all(groupStudents.map(async (student) => {
    const records = await db.select({ status: attendanceRecords.status })
      .from(attendanceRecords)
      .where(eq(attendanceRecords.studentId, student.id));

    const totalSessions = records.length;
    const present = records.filter(r => r.status === "present").length;
    const attendanceRate = totalSessions > 0 ? Math.round((present / totalSessions) * 100) : 0;

    return {
      fullName: student.fullName,
      document: student.document,
      totalSessions,
      present,
      absent: records.filter(r => r.status === "absent").length,
      late: records.filter(r => r.status === "late").length,
      excused: records.filter(r => r.status === "excused").length,
      attendanceRate
    };
  }));

  return { groupName, students: results };
}

export async function getDateRangeReport(startDate: string, endDate: string) {
  const db = await requireDb();
  const sessions = await db.select()
    .from(attendanceSessions)
    .where(and(
      sql`${attendanceSessions.sessionDate} >= ${startDate}`,
      sql`${attendanceSessions.sessionDate} <= ${endDate}`
    ))
    .orderBy(desc(attendanceSessions.sessionDate));

  const results = await Promise.all(sessions.map(async (session) => {
    const records = await db.select({
      studentName: students.fullName,
      status: attendanceRecords.status,
    }).from(attendanceRecords)
      .innerJoin(students, eq(attendanceRecords.studentId, students.id))
      .where(eq(attendanceRecords.sessionId, session.id));

    return {
      sessionId: session.id,
      sessionDate: session.sessionDate,
      activity: session.activity,
      groupName: session.groupName,
      present: records.filter(r => r.status === "present").length,
      absent: records.filter(r => r.status === "absent").length,
      late: records.filter(r => r.status === "late").length,
      excused: records.filter(r => r.status === "excused").length,
      total: records.length
    };
  }));

  return results;
}
