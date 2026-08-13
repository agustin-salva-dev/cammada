"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MessageSquarePlus, X } from "lucide-react";
import { responderOpinion } from "../../actions";

interface RespuestaModalProps {
  opinionId: string;
  opinionTitulo: string;
  respuestaExistente?: string;
  onClose: () => void;
  onSuccess: (nuevoContenido: string) => void;
}

export function RespuestaModal({
  opinionId,
  opinionTitulo,
  respuestaExistente,
  onClose,
  onSuccess,
}: RespuestaModalProps) {
  const [contenido, setContenido] = useState(respuestaExistente ?? "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    const trimmed = contenido.trim();
    if (trimmed.length < 5) {
      toast.error("La respuesta debe tener al menos 5 caracteres.");
      return;
    }

    startTransition(async () => {
      const result = await responderOpinion({
        opinionId,
        contenido: trimmed,
      });
      if (result.success) {
        toast.success(
          respuestaExistente
            ? "Respuesta actualizada correctamente."
            : "Respuesta publicada correctamente.",
        );
        onSuccess(trimmed);
        onClose();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="respuesta-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[hsl(var(--background))] shadow-2xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="respuesta-modal-title"
              className="font-semibold text-base flex items-center gap-2"
            >
              <MessageSquarePlus className="w-5 h-5 text-blue-400" />
              {respuestaExistente
                ? "Editar respuesta oficial"
                : "Responder oficialmente"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              A: &quot;{opinionTitulo}&quot;
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-white/10 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-300">
          Tu nombre, rol y la hora de respuesta serán visibles públicamente
          junto a esta respuesta.
        </div>

        <div className="space-y-1.5">
          <label htmlFor="respuesta-contenido" className="text-sm font-medium">
            Respuesta de la organización
          </label>
          <textarea
            id="respuesta-contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Escribí la respuesta oficial de la organización a esta opinión..."
            maxLength={1000}
            rows={5}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors"
          />
          <p className="text-xs text-muted-foreground text-right">
            {contenido.length}/1000
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm hover:bg-white/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            id="btn-publicar-respuesta"
            onClick={handleSubmit}
            disabled={isPending || contenido.trim().length < 5}
            className={[
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
              !isPending && contenido.trim().length >= 5
                ? "bg-blue-500 hover:bg-blue-400 text-white cursor-pointer"
                : "bg-white/10 text-muted-foreground cursor-not-allowed opacity-60",
            ].join(" ")}
          >
            {isPending
              ? "Publicando..."
              : respuestaExistente
                ? "Actualizar respuesta"
                : "Publicar respuesta"}
          </button>
        </div>
      </div>
    </div>
  );
}
