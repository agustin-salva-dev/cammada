"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { StarRating } from "../shared/StarRating";
import { submitOpinion } from "../../actions";
import {
  CATEGORIA_LABELS,
  ROL_LABELS,
  TIPO_OPINION_LABELS,
} from "../../constants";

const CATEGORIAS = Object.entries(CATEGORIA_LABELS) as [
  string,
  { label: string; emoji: string; descripcion: string },
][];

const ROLES = Object.entries(ROL_LABELS) as [string, string][];
const TIPOS = Object.entries(TIPO_OPINION_LABELS) as [
  string,
  { label: string; descripcion: string },
][];

interface FormularioOpinionProps {
  onSuccess?: () => void;
}

export function FormularioOpinion({ onSuccess }: FormularioOpinionProps = {}) {
  const [form, setForm] = useState({
    nombreUsuario: "",
    rolParticipante: "OTRO" as string,
    tipo: "COMENTARIO" as string,
    titulo: "",
    descripcion: "",
    categoria: "GENERAL" as string,
    estrellas: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (form.titulo.trim().length < 3)
      newErrors.titulo = "El título debe tener al menos 3 caracteres.";
    if (form.descripcion.trim().length < 10)
      newErrors.descripcion =
        "La descripción debe tener al menos 10 caracteres.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data = {
      nombreUsuario: form.nombreUsuario.trim() || "Anónimo",
      rolParticipante: form.rolParticipante,
      tipo: form.tipo,
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      categoria: form.categoria,
      estrellas: form.estrellas > 0 ? form.estrellas : undefined,
    };

    startTransition(async () => {
      const result = await submitOpinion(data);
      if (result.success) {
        setSubmitted(true);
        toast.success(
          "¡Opinión enviada! Será visible tras ser revisada por la organización.",
        );
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
    });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-400" />
        <p className="text-lg font-semibold">¡Opinión enviada correctamente!</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Tu opinión está en revisión. Será visible públicamente una vez
          aprobada por la organización. ¡Gracias por tu feedback!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="opinion-nombre" className="text-sm font-medium">
            Nombre o alias
          </label>
          <input
            id="opinion-nombre"
            type="text"
            placeholder="Tu nombre (opcional)"
            value={form.nombreUsuario}
            onChange={(e) => update("nombreUsuario", e.target.value)}
            maxLength={50}
            className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="opinion-rol" className="text-sm font-medium">
            Tu rol en el evento
          </label>
          <select
            id="opinion-rol"
            value={form.rolParticipante}
            onChange={(e) => update("rolParticipante", e.target.value)}
            className="w-full rounded-lg border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-colors"
          >
            {ROLES.map(([key, label]) => (
              <option
                key={key}
                value={key}
                className="bg-popover text-popover-foreground"
              >
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="opinion-tipo" className="text-sm font-medium">
            Tipo de publicación
          </label>
          <select
            id="opinion-tipo"
            value={form.tipo}
            onChange={(e) => update("tipo", e.target.value)}
            className="w-full rounded-lg border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-colors"
          >
            {TIPOS.map(([key, val]) => (
              <option
                key={key}
                value={key}
                className="bg-popover text-popover-foreground"
              >
                {val.label} — {val.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="opinion-categoria" className="text-sm font-medium">
            Categoría
          </label>
          <select
            id="opinion-categoria"
            value={form.categoria}
            onChange={(e) => update("categoria", e.target.value)}
            className="w-full rounded-lg border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-colors"
          >
            {CATEGORIAS.map(([key, val]) => (
              <option
                key={key}
                value={key}
                className="bg-popover text-popover-foreground"
              >
                {val.emoji} {val.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="opinion-titulo" className="text-sm font-medium">
          Título <span className="text-red-400">*</span>
        </label>
        <input
          id="opinion-titulo"
          type="text"
          placeholder="Un título breve y descriptivo..."
          value={form.titulo}
          onChange={(e) => update("titulo", e.target.value)}
          maxLength={100}
          className={[
            "w-full rounded-lg border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors",
            errors.titulo
              ? "border-red-500/60 focus:ring-red-400/50"
              : "border-white/10 bg-white/5 focus:ring-yellow-400/50",
          ].join(" ")}
        />
        {errors.titulo && (
          <p className="text-xs text-red-400">{errors.titulo}</p>
        )}
        <p className="text-xs text-muted-foreground text-right">
          {form.titulo.length}/100
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="opinion-descripcion" className="text-sm font-medium">
          Descripción / Comentario <span className="text-red-400">*</span>
        </label>
        <textarea
          id="opinion-descripcion"
          placeholder="Contá tu experiencia, lo que viviste, qué mejorarías..."
          value={form.descripcion}
          onChange={(e) => update("descripcion", e.target.value)}
          maxLength={2000}
          rows={5}
          className={[
            "w-full rounded-lg border px-3 py-2 text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 transition-colors",
            errors.descripcion
              ? "border-red-500/60 focus:ring-red-400/50"
              : "border-white/10 bg-white/5 focus:ring-yellow-400/50",
          ].join(" ")}
        />
        {errors.descripcion && (
          <p className="text-xs text-red-400">{errors.descripcion}</p>
        )}
        <p className="text-xs text-muted-foreground text-right">
          {form.descripcion.length}/2000
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium">Valoración general (opcional)</p>
        <StarRating
          value={form.estrellas}
          onChange={(val) => update("estrellas", val)}
          size="lg"
          showLabel
        />
      </div>

      <button
        type="button"
        id="btn-enviar-opinion"
        onClick={handleSubmit}
        disabled={isPending}
        className={[
          "w-full px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md",
          !isPending
            ? "bg-yellow-400 text-black hover:bg-yellow-300 cursor-pointer"
            : "bg-white/10 text-muted-foreground cursor-not-allowed opacity-60",
        ].join(" ")}
      >
        {isPending ? "Enviando..." : "Publicar mi opinión"}
      </button>
    </div>
  );
}
