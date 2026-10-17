import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AppModal, inputClass } from "@/components/AppModal";

type Role = "admin" | "teacher" | "student";
const roleLabels: Record<Role, string> = { admin: "Administrador", teacher: "Instructor", student: "Estudiante" };
const roleStyles: Record<Role, string> = {
  admin: "bg-violet-100 text-violet-700",
  teacher: "bg-sky-100 text-sky-700",
  student: "bg-emerald-100 text-emerald-700",
};

type UserRow = {
  id: number;
  username: string;
  name: string;
  email: string | null;
  role: Role;
  status: "active" | "inactive";
  studentId: number | null;
};

export function UsersPanel({ currentUserId }: { currentUserId: number }) {
  const utils = trpc.useUtils();
  const users = trpc.users.list.useQuery();
  const students = trpc.students.list.useQuery();
  const [editing, setEditing] = useState<UserRow | "new" | null>(null);

  const refresh = () => utils.users.list.invalidate();
  const createUser = trpc.users.create.useMutation({
    onSuccess: () => { toast.success("Usuario creado"); setEditing(null); refresh(); },
    onError: (e) => toast.error(e.message),
  });
  const updateUser = trpc.users.update.useMutation({
    onSuccess: () => { toast.success("Usuario actualizado"); setEditing(null); refresh(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteUser = trpc.users.delete.useMutation({
    onSuccess: () => { toast.success("Usuario eliminado"); refresh(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-[#102a68]">Usuarios del sistema</h2>
          <p className="mt-1 text-sm text-slate-500">Crea, edita y elimina cuentas de administradores, instructores y estudiantes.</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d5cbd] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-[#102a68]"
        >
          <Plus className="h-4 w-4" /> Nuevo usuario
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {(users.data ?? []).map((u) => (
          <div key={u.id} className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-slate-700">{u.name}</p>
              <p className="text-xs text-slate-400">@{u.username}{u.email ? ` · ${u.email}` : ""}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${roleStyles[u.role]}`}>{roleLabels[u.role]}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${u.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                {u.status === "active" ? "Activo" : "Inactivo"}
              </span>
              <button onClick={() => setEditing(u as UserRow)} aria-label={`Editar ${u.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                disabled={u.id === currentUserId}
                onClick={() => window.confirm(`¿Eliminar al usuario ${u.name}?`) && deleteUser.mutate({ id: u.id })}
                aria-label={`Eliminar ${u.name}`}
                className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {users.data?.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No hay usuarios.</p>}
      </div>

      {editing && (
        <UserModal
          user={editing === "new" ? null : editing}
          students={(students.data ?? []).map((s) => ({ id: s.id, fullName: s.fullName, groupName: s.groupName, userId: s.userId }))}
          loading={createUser.isPending || updateUser.isPending}
          onClose={() => setEditing(null)}
          onCreate={(v) => createUser.mutate(v)}
          onUpdate={(v) => updateUser.mutate(v)}
        />
      )}
    </section>
  );
}

function UserModal({
  user,
  students,
  loading,
  onClose,
  onCreate,
  onUpdate,
}: {
  user: UserRow | null;
  students: { id: number; fullName: string; groupName: string; userId: number | null }[];
  loading: boolean;
  onClose: () => void;
  onCreate: (v: { username: string; password: string; name: string; email?: string; role: Role; studentId: number | null }) => void;
  onUpdate: (v: { id: number; name: string; email?: string; role: Role; status: "active" | "inactive"; password?: string; studentId: number | null }) => void;
}) {
  const [username, setUsername] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<Role>(user?.role ?? "teacher");
  const [status, setStatus] = useState<"active" | "inactive">(user?.status ?? "active");
  const [studentId, setStudentId] = useState<number | null>(user?.studentId ?? null);

  const available = students.filter((s) => s.userId === null || s.id === user?.studentId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = role === "student" ? studentId : null;
    if (user) {
      onUpdate({ id: user.id, name, email, role, status, password: password || undefined, studentId: link });
    } else {
      onCreate({ username, password, name, email, role, studentId: link });
    }
  };

  return (
    <AppModal title={user ? "Editar usuario" : "Nuevo usuario"} onClose={onClose}>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Nombre completo
          <input required minLength={3} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Usuario
          <input required minLength={3} disabled={!!user} value={username} onChange={(e) => setUsername(e.target.value)} className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400`} />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          {user ? "Nueva contraseña (opcional)" : "Contraseña"}
          <input
            required={!user}
            minLength={6}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Correo (opcional)
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Rol
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={inputClass}>
              <option value="admin">Administrador</option>
              <option value="teacher">Instructor</option>
              <option value="student">Estudiante</option>
            </select>
          </label>
          {user && (
            <label className="text-sm font-semibold text-slate-700">
              Estado
              <select value={status} onChange={(e) => setStatus(e.target.value as "active" | "inactive")} className={inputClass}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </label>
          )}
        </div>
        {role === "student" && (
          <label className="block text-sm font-semibold text-slate-700">
            Ficha de estudiante vinculada
            <select value={studentId ?? ""} onChange={(e) => setStudentId(e.target.value ? Number(e.target.value) : null)} className={inputClass}>
              <option value="">Sin vincular</option>
              {available.map((s) => (
                <option key={s.id} value={s.id}>{s.fullName} · {s.groupName}</option>
              ))}
            </select>
            <span className="mt-1 block text-xs font-normal text-slate-400">Define de qué ficha verá las asistencias.</span>
          </label>
        )}
        <button disabled={loading} className="mt-2 w-full rounded-xl bg-[#0d5cbd] px-4 py-3 font-bold text-white hover:bg-[#102a68] disabled:opacity-60">
          {loading ? "Guardando..." : user ? "Guardar cambios" : "Crear usuario"}
        </button>
      </form>
    </AppModal>
  );
}
