import * as React from "react";

interface FighterNameProps {
  luchador: {
    nombre: string;
    apellido: string;
    apodo: string | null;
  };
  className?: string;
}

export const FighterName = React.memo(function FighterName({
  luchador,
  className = "",
}: FighterNameProps) {
  return (
    <span className={`font-heading text-shadow-lg text-xs sm:text-sm xl:text-base ${className}`}>
      {luchador.nombre}{" "}
      {luchador.apodo && (
        <span className="text-primary font-semibold">
          &quot;{luchador.apodo}&quot;
        </span>
      )}{" "}
      {luchador.apellido}
    </span>
  );
});
