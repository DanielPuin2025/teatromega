import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { BarChart3, CalendarCheck, Check, ChevronRight, ClipboardList, LogOut, Menu, Pencil, Plus, Search, ShieldCheck, Trash2, UserCog, Users, X, Clock3, FileText, User as UserIcon, Lock, Info } from "lucide-react";
import { AppModal } from "@/components/AppModal";
import { CreatorCard } from "@/components/CreatorCard";
import { UsersPanel } from "@/components/UsersPanel";
import { EventsList, MyAttendance } from "@/components/StudentPortal";

const statusLabels = { present: "Presente", absent: "Ausente", late: "Tardanza", excused: "Excusa" } as const;
const statusStyles = { present: "bg-emerald-100 text-emerald-700", absent: "bg-rose-100 text-rose-700", late: "bg-amber-100 text-amber-700", excused: "bg-sky-100 text-sky-700" } as const;

type Tab = "resumen" | "estudiantes" | "asistencia" | "reportes" | "usuarios" | "miasistencia" | "eventos";
type StudentRow = { id: number; fullName: string; document: string | null; grade: string; groupName: string; status: "active" | "inactive" };
type SessionRow = { id: number; sessionDate: string; activity: string; groupName: string };

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);
  const utils = trpc.useUtils();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      console.log("Login exitoso:", data);
      toast.success("¡Bienvenido!");
      // Esperar un momento antes de recargar
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    },
    onError: (error) => {
      console.error("Error de login:", error);
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    loginMutation.mutate({ username: username.trim(), password });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#dff4ff,transparent_42%),#f7fbff] px-4 py-4 text-slate-900 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-stretch gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        <section className="relative flex flex-col items-center justify-center gap-[2vh] overflow-hidden rounded-[2rem] bg-[#102a68] p-6 text-center text-white shadow-2xl shadow-blue-950/20 sm:p-8">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#11a8d9]/30 blur-2xl" />
          <img
            src="/logo.jpeg"
            alt="Logo Teatro El Mega"
            className="relative h-[min(30vh,15rem)] w-[min(30vh,15rem)] rounded-3xl bg-black object-cover object-center shadow-xl shadow-black/30 ring-1 ring-white/20"
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7bdcf5]">Teatro El Mega</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Asistencia clara. Seguimiento confiable.</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-blue-100">
              Organiza estudiantes, registra jornadas y convierte la asistencia en información útil para el acompañamiento escolar.
            </p>
          </div>
          <div className="relative grid w-full max-w-md grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl bg-white/10 p-3">
              <Users className="mx-auto mb-2 h-4 w-4 text-[#7bdcf5]" />
              <b>Estudiantes</b>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <CalendarCheck className="mx-auto mb-2 h-4 w-4 text-[#7bdcf5]" />
              <b>Asistencia</b>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <BarChart3 className="mx-auto mb-2 h-4 w-4 text-[#7bdcf5]" />
              <b>Reportes</b>
            </div>
          </div>
          <div className="relative flex items-center justify-center gap-6 rounded-2xl bg-white px-6 py-3 shadow-lg shadow-black/20">
            <img src="/logo_mega.png" alt="Logo Megacolegio El Progreso" className="h-[min(10vh,5rem)] w-[min(10vh,5rem)] object-contain" />
            <div className="h-10 w-px bg-slate-200" />
            <img src="/logo_sena.png" alt="Logo SENA" className="h-[min(10vh,5rem)] w-[min(10vh,5rem)] object-contain" />
          </div>
        </section>

        <section className="flex flex-col justify-center rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0d5cbd]">
            <ClipboardList className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#0d5cbd]">Panel de control</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a68]">Ingresa para comenzar</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Accede con tu cuenta autorizada para gestionar estudiantes y registrar la asistencia de tu grupo.</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d5cbd] px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#102a68] active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
              {!loginMutation.isPending && <ChevronRight className="h-4 w-4" />}
            </button>
          </form>

          <button
            onClick={() => setShowDeveloperInfo(!showDeveloperInfo)}
            className="mt-4 flex items-center justify-center gap-2 w-full text-sm text-slate-500 hover:text-slate-700 transition"
          >
            <Info className="h-4 w-4" />
            {showDeveloperInfo ? "Ocultar información" : "Ver información del desarrollador"}
          </button>

          {showDeveloperInfo && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  SM
                </div>
                <div>
                  <p className="font-bold text-slate-800">Jhon Sebastian Macías Bohórquez</p>
                  <p className="text-sm text-slate-500">Desarrollador Full Stack</p>
                </div>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <p><strong>Institución:</strong> Grado 11A</p>
                <p><strong>Proyecto:</strong> Sistema de Asistencia - Teatro El Mega</p>
                <p><strong>Tecnologías:</strong> React, TypeScript, Node.js, MySQL</p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 text-center">
                © 2026 - Todos los derechos reservados
              </div>
            </div>
          )}

          <p className="mt-4 text-center text-xs text-slate-400">
            © 2026 Teatro El Mega - Todos los derechos reservados
          </p>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof Users; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-[#102a68]">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const { user, logout } = useAuth();
  const isStudent = user?.role === "student";
  const isAdmin = user?.role === "admin";
  const [tab, setTab] = useState<Tab>("resumen");
  const [mobileNav, setMobileNav] = useState(false);
  const utils = trpc.useUtils();
  const stats = trpc.dashboard.stats.useQuery();
  const students = trpc.students.list.useQuery(undefined, { enabled: !isStudent });
  const sessions = trpc.attendance.sessions.useQuery();
  const [studentSearch, setStudentSearch] = useState("");
  const [studentForm, setStudentForm] = useState<StudentRow | "new" | null>(null);
  const [sessionForm, setSessionForm] = useState<SessionRow | "new" | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const records = trpc.attendance.records.useQuery({ sessionId: activeSessionId ?? 0 }, { enabled: !isStudent && activeSessionId !== null });

  const saveStudent = trpc.students.create.useMutation({
    onSuccess: () => {
      toast.success("Estudiante registrado");
      setStudentForm(null);
      utils.students.list.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const editStudent = trpc.students.update.useMutation({
    onSuccess: () => {
      toast.success("Estudiante actualizado");
      setStudentForm(null);
      utils.students.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const removeStudent = trpc.students.delete.useMutation({
    onSuccess: () => {
      toast.success("Estudiante eliminado");
      utils.students.list.invalidate();
      utils.dashboard.stats.invalidate();
      utils.attendance.records.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const createSession = trpc.attendance.createSession.useMutation({
    onSuccess: (session) => {
      toast.success("Sesión creada");
      setSessionForm(null);
      setActiveSessionId(session?.id ?? null);
      utils.attendance.sessions.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const editSession = trpc.attendance.updateSession.useMutation({
    onSuccess: () => {
      toast.success("Sesión actualizada");
      setSessionForm(null);
      utils.attendance.sessions.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const removeSession = trpc.attendance.deleteSession.useMutation({
    onSuccess: (_data, variables) => {
      toast.success("Sesión eliminada");
      if (activeSessionId === variables.id) setActiveSessionId(null);
      utils.attendance.sessions.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateRecord = trpc.attendance.updateRecord.useMutation({
    onSuccess: () => {
      utils.attendance.records.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const filteredStudents = useMemo(
    () => (students.data ?? []).filter((s) => s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || (s.document ?? "").includes(studentSearch)),
    [students.data, studentSearch]
  );

  const nav = isStudent
    ? [
        { id: "resumen" as Tab, label: "Resumen", icon: BarChart3 },
        { id: "miasistencia" as Tab, label: "Mis asistencias", icon: CalendarCheck },
        { id: "eventos" as Tab, label: "Eventos", icon: FileText },
      ]
    : [
        { id: "resumen" as Tab, label: "Resumen", icon: BarChart3 },
        { id: "estudiantes" as Tab, label: "Estudiantes", icon: Users },
        { id: "asistencia" as Tab, label: "Eventos y asistencia", icon: CalendarCheck },
        { id: "reportes" as Tab, label: "Reportes", icon: FileText },
        ...(isAdmin ? [{ id: "usuarios" as Tab, label: "Usuarios", icon: UserCog }] : []),
      ];

  const currentLabel = nav.find((n) => n.id === tab)?.label ?? "Resumen";
  const confirmDelete = (what: string, action: () => void) => window.confirm(`¿Eliminar ${what}? Esta acción no se puede deshacer.`) && action();

  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-[#102a68] p-5 text-white transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 border-b border-white/10 px-2 pb-6">
          <img src="/logo.jpeg" alt="Logo Teatro El Mega" className="h-11 w-11 rounded-xl bg-black object-cover object-center shadow-lg shadow-cyan-950/30" />
          <div>
            <p className="font-black tracking-tight">Teatro El Mega</p>
            <p className="text-xs text-blue-200">Panel de asistencia</p>
          </div>
        </div>
        <nav className="mt-8 space-y-2">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setMobileNav(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                tab === item.id ? "bg-white text-[#102a68] shadow-lg shadow-blue-950/10" : "text-blue-100 hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-xs uppercase tracking-wider text-blue-200">Usuario activo</p>
          <p className="mt-2 truncate text-sm font-bold">{user?.name ?? "Usuario"}</p>
          <p className="text-xs text-blue-200 mt-1">{user?.role === "admin" ? "Administrador" : user?.role === "teacher" ? "Docente" : "Estudiante"}</p>
          <button onClick={() => logout()} className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-100 hover:text-white">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {mobileNav && <button aria-label="Cerrar menú" className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden" onClick={() => setMobileNav(false)} />}

      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-[#f7fbff]/90 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileNav(true)} className="rounded-lg p-2 hover:bg-white lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-[#0d5cbd]">Sistema de Asistencia</p>
                <h1 className="text-2xl font-black tracking-tight text-[#102a68]">{currentLabel}</h1>
              </div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">Grado 11A</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dff4ff] font-bold text-[#0d5cbd]">
                {(user?.name ?? "U").slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
          {tab === "resumen" && (
            <>
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d5cbd] to-[#102a68] p-7 text-white shadow-xl shadow-blue-900/15 sm:p-9">
                <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#11a8d9]/30 blur-2xl" />
                <div className="relative max-w-2xl">
                  <p className="text-sm font-semibold text-sky-200">Buenos días, {user?.name?.split(" ")[0] ?? "equipo"}</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Controla la asistencia con claridad.</h2>
                  <p className="mt-4 max-w-xl leading-7 text-blue-100">
                    {isStudent
                      ? "Consulta tus asistencias y los eventos de tu grupo en Teatro El Mega."
                      : "Administra estudiantes, abre una sesión de asistencia y consulta el historial del proyecto Teatro El Mega."}
                  </p>
                  {!isStudent && (
                    <button
                      onClick={() => {
                        setTab("asistencia");
                        setSessionForm("new");
                      }}
                      className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0d5cbd] transition hover:-translate-y-0.5"
                    >
                      <Plus className="h-4 w-4" />
                      Nueva sesión
                    </button>
                  )}
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {!isStudent && <StatCard label="Estudiantes activos" value={stats.data?.students ?? 0} icon={Users} tone="bg-sky-100 text-sky-700" />}
                <StatCard label={isStudent ? "Eventos con mi registro" : "Sesiones registradas"} value={stats.data?.sessions ?? 0} icon={CalendarCheck} tone="bg-indigo-100 text-indigo-700" />
                <StatCard label={isStudent ? "Mis presentes" : "Presentes acumulados"} value={stats.data?.present ?? 0} icon={Check} tone="bg-emerald-100 text-emerald-700" />
                <StatCard label={isStudent ? "Mis ausencias" : "Ausencias acumuladas"} value={stats.data?.absent ?? 0} icon={X} tone="bg-rose-100 text-rose-700" />
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-[#102a68]">Últimas sesiones</h3>
                      <p className="mt-1 text-sm text-slate-500">Actividad reciente del grupo</p>
                    </div>
                    <button onClick={() => setTab(isStudent ? "eventos" : "asistencia")} className="text-sm font-bold text-[#0d5cbd]">
                      Ver todas
                    </button>
                  </div>
                  <div className="mt-5 space-y-3">
                    {(sessions.data ?? []).slice(0, 4).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          if (!isStudent) setActiveSessionId(s.id);
                          setTab(isStudent ? "eventos" : "asistencia");
                        }}
                        className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 text-left transition hover:bg-sky-50"
                      >
                        <div>
                          <p className="font-bold text-slate-700">{s.activity}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {s.sessionDate} · Grupo {s.groupName}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </button>
                    ))}
                    {!sessions.data?.length && (
                      <p className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">
                        {isStudent ? "Aún no hay eventos para tu grupo." : "Aún no hay sesiones. Crea la primera desde el botón Nueva sesión."}
                      </p>
                    )}
                  </div>
                </div>

                {!isStudent && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-black text-[#102a68]">Flujo recomendado</h3>
                  <div className="mt-5 space-y-5">
                    <div className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-[#0d5cbd]">1</span>
                      <p className="text-sm leading-6 text-slate-600">
                        <b className="text-slate-800">Registra</b> a los estudiantes del grupo.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-[#0d5cbd]">2</span>
                      <p className="text-sm leading-6 text-slate-600">
                        <b className="text-slate-800">Abre</b> una sesión para cada actividad.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-[#0d5cbd]">3</span>
                      <p className="text-sm leading-6 text-slate-600">
                        <b className="text-slate-800">Actualiza</b> estados y consulta reportes.
                      </p>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </>
          )}

          {tab === "miasistencia" && isStudent && <MyAttendance />}
          {tab === "eventos" && isStudent && <EventsList />}
          {tab === "usuarios" && isAdmin && user && <UsersPanel currentUserId={user.id} />}

          {tab === "estudiantes" && !isStudent && (
            <section className="space-y-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-black text-[#102a68]">Directorio de estudiantes</h2>
                  <p className="mt-1 text-sm text-slate-500">Mantén una ficha única para cada estudiante.</p>
                </div>
                <button
                  onClick={() => setStudentForm("new")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d5cbd] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-[#102a68]"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo estudiante
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Buscar por nombre o documento..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="hidden grid-cols-[1fr_130px_110px_100px_90px] gap-4 border-b border-slate-100 px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 sm:grid">
                  <span>Estudiante</span>
                  <span>Documento</span>
                  <span>Grupo</span>
                  <span>Estado</span>
                  <span className="text-right">Acciones</span>
                </div>
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-[1fr_130px_110px_100px_90px] sm:items-center sm:gap-4"
                  >
                    <div>
                      <p className="font-bold text-slate-700">{student.fullName}</p>
                      <p className="text-xs text-slate-400 sm:hidden">
                        {student.document || "Sin documento"} · Grupo {student.groupName}
                      </p>
                    </div>
                    <span className="hidden text-sm text-slate-500 sm:block">{student.document || "—"}</span>
                    <span className="hidden text-sm text-slate-500 sm:block">{student.groupName}</span>
                    <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${student.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                      {student.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setStudentForm(student)} aria-label={`Editar ${student.fullName}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(`al estudiante ${student.fullName} y su historial de asistencia`, () => removeStudent.mutate({ id: student.id }))}
                        aria-label={`Eliminar ${student.fullName}`}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {students.data && filteredStudents.length === 0 && (
                  <p className="p-10 text-center text-sm text-slate-500">No hay estudiantes que coincidan con la búsqueda.</p>
                )}
              </div>
            </section>
          )}

          {tab === "asistencia" && !isStudent && (
            <section className="space-y-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-black text-[#102a68]">Eventos y registro de asistencia</h2>
                  <p className="mt-1 text-sm text-slate-500">Selecciona un evento o crea una nueva jornada.</p>
                </div>
                <button
                  onClick={() => setSessionForm("new")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d5cbd] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-[#102a68]"
                >
                  <Plus className="h-4 w-4" />
                  Nueva sesión
                </button>
              </div>

              <div className="grid gap-5 lg:grid-cols-[.7fr_1.3fr]">
                <div className="space-y-3">
                  {(sessions.data ?? []).map((s) => (
                    <div
                      key={s.id}
                      className={`flex items-start gap-1 rounded-2xl border p-2 transition ${
                        activeSessionId === s.id ? "border-blue-400 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-200"
                      }`}
                    >
                      <button onClick={() => setActiveSessionId(s.id)} className="flex-1 p-2 text-left">
                        <p className="font-bold text-slate-700">{s.activity}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {s.sessionDate} · Grupo {s.groupName}
                        </p>
                      </button>
                      <button onClick={() => setSessionForm(s)} aria-label={`Editar ${s.activity}`} className="rounded-lg p-2 text-slate-500 hover:bg-white">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(`el evento "${s.activity}" y sus registros de asistencia`, () => removeSession.mutate({ id: s.id }))}
                        aria-label={`Eliminar ${s.activity}`}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {!sessions.data?.length && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center text-sm text-slate-500">
                      Crea una sesión para comenzar.
                    </div>
                  )}
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="font-black text-[#102a68]">{activeSessionId ? "Lista de la sesión" : "Selecciona una sesión"}</h3>
                    <p className="mt-1 text-sm text-slate-500">Actualiza el estado de cada estudiante.</p>
                  </div>
                  {activeSessionId && (
                    <div className="divide-y divide-slate-100">
                      {(records.data ?? []).map((record) => (
                        <div key={record.recordId} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-bold text-slate-700">{record.fullName}</p>
                            <p className="text-xs text-slate-400">Grupo {record.groupName}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(Object.keys(statusLabels) as Array<keyof typeof statusLabels>).map((status) => (
                              <button
                                key={status}
                                disabled={updateRecord.isPending}
                                onClick={() => updateRecord.mutate({ recordId: record.recordId, status })}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                  record.status === status ? statusStyles[status] : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                              >
                                {statusLabels[status]}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      {records.data && records.data.length === 0 && (
                        <p className="p-8 text-center text-sm text-slate-500">Esta sesión no tiene estudiantes del grupo.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {tab === "reportes" && !isStudent && (
            <section className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#102a68]">Reportes y seguimiento</h2>
                <p className="mt-1 text-sm text-slate-500">Resumen de las sesiones registradas en el sistema.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Sesiones" value={stats.data?.sessions ?? 0} icon={CalendarCheck} tone="bg-indigo-100 text-indigo-700" />
                <StatCard label="Presentes" value={stats.data?.present ?? 0} icon={Check} tone="bg-emerald-100 text-emerald-700" />
                <StatCard label="Ausentes" value={stats.data?.absent ?? 0} icon={X} tone="bg-rose-100 text-rose-700" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h3 className="font-black text-[#102a68]">Historial de actividades</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {(sessions.data ?? []).map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-2.5 text-[#0d5cbd]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">{s.activity}</p>
                          <p className="text-xs text-slate-500">
                            {s.sessionDate} · Grupo {s.groupName}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveSessionId(s.id);
                          setTab("asistencia");
                        }}
                        className="text-sm font-bold text-[#0d5cbd]"
                      >
                        Ver detalle
                      </button>
                    </div>
                  ))}
                  {!sessions.data?.length && <p className="p-8 text-center text-sm text-slate-500">No hay actividades registradas todavía.</p>}
                </div>
              </div>
            </section>
          )}

          <footer className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
            <CreatorCard />
            <p className="mt-6 font-semibold text-slate-700">© 2026 Teatro El Mega - Sistema de Asistencia</p>
            <p className="mt-1">Todos los derechos reservados</p>
          </footer>
        </div>
      </main>

      {studentForm && (
        <StudentModal
          student={studentForm === "new" ? null : studentForm}
          onClose={() => setStudentForm(null)}
          onSubmit={(values) => (studentForm === "new" ? saveStudent.mutate(values) : editStudent.mutate({ ...values, id: studentForm.id, status: values.status }))}
          loading={saveStudent.isPending || editStudent.isPending}
        />
      )}
      {sessionForm && (
        <SessionModal
          session={sessionForm === "new" ? null : sessionForm}
          onClose={() => setSessionForm(null)}
          onSubmit={(values) => (sessionForm === "new" ? createSession.mutate(values) : editSession.mutate({ ...values, id: sessionForm.id }))}
          loading={createSession.isPending || editSession.isPending}
        />
      )}
    </div>
  );
}

const Modal = AppModal;

function parseGroup(groupName?: string) {
  const match = /^(\d+)([A-Za-z])$/.exec(groupName ?? "");
  return { grade: match?.[1] ?? "11", group: match?.[2] ?? "A" };
}

function StudentModal({
  student,
  onClose,
  onSubmit,
  loading,
}: {
  student: StudentRow | null;
  onClose: () => void;
  onSubmit: (v: { fullName: string; document: string; grade: string; groupName: string; status: "active" | "inactive" }) => void;
  loading: boolean;
}) {
  const initialGroup = parseGroup(student?.groupName);
  const [fullName, setFullName] = useState(student?.fullName ?? "");
  const [document, setDocument] = useState(student?.document ?? "");
  const [grade, setGrade] = useState(initialGroup.grade);
  const [groupName, setGroupName] = useState(initialGroup.group);
  const [status, setStatus] = useState<"active" | "inactive">(student?.status ?? "active");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ fullName, document, grade, groupName: grade + groupName, status });
  };

  return (
    <Modal title={student ? "Editar estudiante" : "Nuevo estudiante"} onClose={onClose}>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Nombre completo
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Ej. Ana María López"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Documento <span className="font-normal text-slate-400">(opcional)</span>
          <input
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Número de documento"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Grado
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="6">6°</option>
              <option value="7">7°</option>
              <option value="8">8°</option>
              <option value="9">9°</option>
              <option value="10">10°</option>
              <option value="11">11°</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Grupo
            <select
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </label>
        </div>
        {student && (
          <label className="block text-sm font-semibold text-slate-700">
            Estado
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </label>
        )}
        <button disabled={loading} className="mt-2 w-full rounded-xl bg-[#0d5cbd] px-4 py-3 font-bold text-white hover:bg-[#102a68] disabled:opacity-60">
          {loading ? "Guardando..." : student ? "Guardar cambios" : "Guardar estudiante"}
        </button>
      </form>
    </Modal>
  );
}

function SessionModal({
  session,
  onClose,
  onSubmit,
  loading,
}: {
  session: SessionRow | null;
  onClose: () => void;
  onSubmit: (v: { sessionDate: string; activity: string; groupName: string }) => void;
  loading: boolean;
}) {
  const initialGroup = parseGroup(session?.groupName);
  const [sessionDate, setSessionDate] = useState(session?.sessionDate ?? new Date().toISOString().slice(0, 10));
  const [activity, setActivity] = useState(session?.activity ?? "");
  const [grade, setGrade] = useState(initialGroup.grade);
  const [groupName, setGroupName] = useState(initialGroup.group);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ sessionDate, activity, groupName: grade + groupName });
  };

  return (
    <Modal title={session ? "Editar evento" : "Nueva sesión de asistencia"} onClose={onClose}>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Actividad
          <input
            required
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Ej. Ensayo general"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Fecha
          <input
            required
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Grado
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="6">6°</option>
              <option value="7">7°</option>
              <option value="8">8°</option>
              <option value="9">9°</option>
              <option value="10">10°</option>
              <option value="11">11°</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Grupo
            <select
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </label>
        </div>
        <button disabled={loading} className="mt-2 w-full rounded-xl bg-[#0d5cbd] px-4 py-3 font-bold text-white hover:bg-[#102a68] disabled:opacity-60">
          {loading ? "Creando..." : "Crear sesión"}
        </button>
      </form>
    </Modal>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbff]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#0d5cbd]" />
      </div>
    );

  return user ? <AppShell /> : <LoginScreen />;
}
