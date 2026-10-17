import { useState } from "react";

const PHOTO_PATH = "/creador.jpg";

// Para poner la foto del creador, guarda la imagen como client/public/creador.jpg.
export function CreatorCard({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [hasPhoto, setHasPhoto] = useState(true);
  const dark = variant === "dark";

  return (
    <div className={`flex flex-col items-center gap-3 text-center ${dark ? "text-white" : "text-slate-700"}`}>
      {hasPhoto ? (
        <img
          src={PHOTO_PATH}
          alt="Jhon Sebastian Macías Bohórquez, creador de la plataforma"
          onError={() => setHasPhoto(false)}
          className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg ring-2 ring-[#11a8d9]"
        />
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-cyan-500 text-3xl font-black text-white shadow-lg ring-2 ring-[#11a8d9]">
          SM
        </div>
      )}
      <div>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#0d5cbd]">Creador de la plataforma</p>
        <p className="mt-1 text-lg font-black text-[#102a68]">Jhon Sebastian Macías Bohórquez</p>
        <p className="text-sm text-slate-500">Desarrollador Full Stack · Grado 11A</p>
      </div>
    </div>
  );
}
