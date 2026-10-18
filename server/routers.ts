import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createSession,
  createStudent,
  deleteSession,
  deleteStudent,
  getDashboardStats,
  getStudentByUserId,
  getStudentStats,
  linkStudentToUser,
  listSessionRecords,
  listSessions,
  listStudentAttendance,
  listStudents,
  updateAttendance,
  updateSession,
  updateStudent,
  getFullAttendanceReport,
  getStudentDetailedReport,
  getGroupReport,
  getDateRangeReport,
} from "./db";
import { authenticateUser, createUser, listUsers, updateUser, deleteUser } from "./auth";
import { TRPCError } from "@trpc/server";
import { signJWT } from "./_core/jwt";

const studentInput = z.object({
  fullName: z.string().min(3, "Escribe el nombre completo."),
  document: z.string().optional(),
  grade: z.string().min(1),
  groupName: z.string().min(1),
});

const userInput = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  name: z.string().min(3, "Escribe el nombre completo."),
  email: z.string().email("Email inválido.").optional().or(z.literal("")),
  role: z.enum(["admin", "teacher", "student"]),
  studentId: z.number().nullable().optional(),
});

const sessionInput = z.object({
  sessionDate: z.string().min(10),
  activity: z.string().min(3),
  groupName: z.string().min(1),
  studentIds: z.array(z.number()).optional(),
});

// Solo administradores: gestión completa (CRUD) de usuarios y de todo el sistema.
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acceso denegado. Solo administradores." });
  }
  return next({ ctx });
});

// Administradores e instructores: control de estudiantes, eventos y asistencia.
const staffProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "teacher") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acceso denegado. Solo administradores e instructores." });
  }
  return next({ ctx });
});

const studentOnlyProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "student") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Solo disponible para estudiantes." });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const user = await authenticateUser(input.username, input.password);
        if (!user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuario o contraseña incorrectos." });
        }
        const token = await signJWT({ userId: user.id, role: user.role });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);
        return { success: true, user };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, cookieOptions);
      return { success: true } as const;
    }),
  }),
  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "student") {
        const student = await getStudentByUserId(ctx.user.id);
        return student ? getStudentStats(student.id) : { students: 0, sessions: 0, present: 0, absent: 0 };
      }
      return getDashboardStats();
    }),
  }),
  users: router({
    list: adminProcedure.query(async () => {
      const [allUsers, allStudents] = await Promise.all([listUsers(), listStudents()]);
      return allUsers.map(u => ({ ...u, studentId: allStudents.find(s => s.userId === u.id)?.id ?? null }));
    }),
    create: adminProcedure.input(userInput).mutation(async ({ input }) => {
      const { studentId, ...data } = input;
      const created = await createUser({ ...data, email: data.email || undefined });
      if (data.role === "student" && studentId) await linkStudentToUser(created.id, studentId);
      return created;
    }),
    update: adminProcedure
      .input(userInput.partial().extend({ id: z.number(), status: z.enum(["active", "inactive"]).optional() }))
      .mutation(async ({ input, ctx }) => {
        const { studentId, ...data } = input;
        if (data.id === ctx.user.id && (data.role && data.role !== "admin" || data.status === "inactive")) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "No puedes quitarte el rol de administrador ni desactivar tu propia cuenta." });
        }
        const updated = await updateUser({ ...data, email: data.email || undefined });
        if (studentId !== undefined) await linkStudentToUser(data.id, updated.role === "student" ? studentId : null);
        return updated;
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input, ctx }) => {
      if (input.id === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No puedes eliminar tu propia cuenta." });
      }
      return deleteUser(input.id);
    }),
  }),
  students: router({
    list: staffProcedure.query(() => listStudents()),
    create: staffProcedure.input(studentInput).mutation(({ input }) => createStudent(input)),
    update: staffProcedure.input(studentInput.extend({ id: z.number(), status: z.enum(["active", "inactive"]).optional() })).mutation(({ input }) => updateStudent(input)),
    delete: staffProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteStudent(input.id)),
  }),
  attendance: router({
    // Los eventos son visibles para todos; el estudiante solo ve los de su grupo.
    sessions: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "student") {
        const student = await getStudentByUserId(ctx.user.id);
        return student ? listSessions(student.groupName) : [];
      }
      return listSessions();
    }),
    records: staffProcedure.input(z.object({ sessionId: z.number() })).query(({ input }) => listSessionRecords(input.sessionId)),
    mine: studentOnlyProcedure.query(async ({ ctx }) => {
      const student = await getStudentByUserId(ctx.user.id);
      if (!student) return { student: null, records: [] };
      return { student, records: await listStudentAttendance(student.id) };
    }),
    createSession: staffProcedure.input(sessionInput).mutation(({ input, ctx }) => createSession({ ...input, createdBy: ctx.user.id })),
    updateSession: staffProcedure.input(sessionInput.extend({ id: z.number() })).mutation(({ input }) => updateSession(input)),
    deleteSession: staffProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteSession(input.id)),
    updateRecord: staffProcedure.input(z.object({ recordId: z.number(), status: z.enum(["present", "absent", "late", "excused"]), note: z.string().optional() })).mutation(({ input }) => updateAttendance(input)),
  }),
  reports: router({
    full: staffProcedure.query(() => getFullAttendanceReport()),
    student: staffProcedure.input(z.object({ studentId: z.number() })).query(({ input }) => getStudentDetailedReport(input.studentId)),
    group: staffProcedure.input(z.object({ groupName: z.string() })).query(({ input }) => getGroupReport(input.groupName)),
    dateRange: staffProcedure.input(z.object({ startDate: z.string(), endDate: z.string() })).query(({ input }) => getDateRangeReport(input.startDate, input.endDate)),
  }),
});

export type AppRouter = typeof appRouter;
