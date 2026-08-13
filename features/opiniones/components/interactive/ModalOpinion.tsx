"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormularioOpinion } from "./FormularioOpinion";

export function ModalOpinion() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          id="btn-dejar-comentario-modal"
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:scale-[1.02] cursor-pointer"
        >
          <MessageSquarePlus className="w-5 h-5" />
          Deja tu comentario o sugerencia
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-white/10  p-6">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-white/10">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-yellow-400" />
            Escribir opinión o sugerencia
          </DialogTitle>
          <DialogDescription className="text-sm">
            Comparte tu experiencia detallada o propone una mejora para las
            próximas ediciones del evento.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          <FormularioOpinion
            onSuccess={() => setTimeout(() => setOpen(false), 2000)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
