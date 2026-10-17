import { CalendarCheck, Check, Clock3, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

const statusLabels = { present: "Presente", absent: "Ausente", late: "Tardanza", excused: "Excusa" } as const;
const statusStyles = { present: "bg-emerald-100 text-emerald-700", absent: "bg-rose-100 text-rose-700", late: "bg-amber-100 text-amber-700", excused: "bg-sky-100 text-sky-700" } as const;

export function MyAttendance() {
  const mine = trpc.attendance.mine.useQuery();
  const records = mine.data?.records ?? [];
  const count = (s: keyof typeof statusLabels) => records.filter((r) => r.status === s).length;

  if (mine.data && !mine.data.student) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Tu cuenta todavía no está vinculada a una ficha de estudiante. Pide al administrador que la vincule para ver tus asistencias.
      </section>
    );
  }

  const cards = [
    { label: "Presente", value: count("present"), icon: Check, tone: "bg-emerald-100 text-emerald-700" },
    { label: "Ausente", value: count("absent"), icon: X, tone: "bg-rose-100 text-rose-700" },
    { label: "Tardanza", value: count("late"), icon: Clock3, tone: "bg-amber-100 text-amber-700" },
    { label: "Excusa", value: count("excused"), icon: CalendarCheck, tone: "bg-sky-100 text-sky-700" },
  ];

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-[#102a68]">Mis asistencias</h2>
        <p className="mt-1 text-sm text-slate-500">
          {mine.data?.student ? `${mine.data.student.fullName} · Grupo ${mine.data.student.groupName}` : "Cargando..."}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">{c.label}</p>
              <p className="mt-2 text-3xl font-black text-[#102a68]">{c.value}</p>
            </div>
            <div className={`rounded-xl p-3 ${c.tone}`}><c.icon className="h-5 w-5" /></div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {records.map((r) => (
          <div key={r.recordId} className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-slate-700">{r.activity}</p>
              <p className="text-xs text-slate-500">{r.sessionDate} · Grupo {r.groupName}{r.note ? ` · ${r.note}` : ""}</p>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusStyles[r.status]}`}>{statusLabels[r.status]}</span>
          </div>
        ))}
        {mine.data?.student && records.length === 0 && <p className="p-10 text-center text-sm text-slate-500">Aún no tienes asistencias registradas.</p>}
      </div>
    </section>
  );
}

export function EventsList() {
  const sessions = trpc.attendance.sessions.useQuery();
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-[#102a68]">Eventos</h2>
        <p className="mt-1 text-sm text-slate-500">Actividades programadas para tu grupo.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {(sessions.data ?? []).map((s) => (
          <div key={s.id} className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 last:border-0">
            <div className="rounded-xl bg-blue-50 p-2.5 text-[#0d5cbd]"><CalendarCheck className="h-5 w-5" /></div>
            <div>
              <p className="font-bold text-slate-700">{s.activity}</p>
              <p className="text-xs text-slate-500">{s.sessionDate} · Grupo {s.groupName}</p>
            </div>
          </div>
        ))}
        {sessions.data?.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No hay eventos registrados para tu grupo.</p>}
      </div>
    </section>
  );
}
