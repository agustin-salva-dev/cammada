"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const LABELS: Record<number, string> = {
  1: "Muy malo",
  2: "Malo",
  3: "Regular",
  4: "Bueno",
  5: "Excelente",
};

const SIZE_CLASSES = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = "md",
  showLabel = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const effectiveValue = hovered > 0 ? hovered : value;

  return (
    <div className="flex items-center gap-1">
      <div
        className="flex gap-0.5"
        onMouseLeave={() => !readonly && setHovered(0)}
        role={readonly ? undefined : "group"}
        aria-label={
          readonly ? `${value} de 5 estrellas` : "Selecciona una calificación"
        }
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            aria-label={`${star} estrella${star !== 1 ? "s" : ""}`}
            className={[
              "transition-all duration-150",
              readonly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded",
            ].join(" ")}
          >
            <Star
              className={[
                SIZE_CLASSES[size],
                "transition-colors duration-150",
                star <= effectiveValue
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-600",
              ].join(" ")}
            />
          </button>
        ))}
      </div>

      {showLabel && effectiveValue > 0 && (
        <span className="text-sm text-muted-foreground ml-1">
          {LABELS[effectiveValue]}
        </span>
      )}
    </div>
  );
}

export function StarDisplay({
  value,
  total,
}: {
  value: number;
  total?: number;
}) {
  const filled = Math.floor(value);
  const partial = value - filled;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5" aria-label={`${value} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFullFilled = star <= filled;
          const isPartial = star === filled + 1 && partial > 0;

          return (
            <span key={star} className="relative inline-block w-5 h-5">
              <Star className="w-5 h-5 fill-transparent text-gray-600 absolute inset-0" />
              {(isFullFilled || isPartial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isPartial ? `${partial * 100}%` : "100%" }}
                >
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span className="font-semibold text-sm text-foreground">
        {value.toFixed(1)}
      </span>
      {total !== undefined && (
        <span className="text-xs text-muted-foreground">({total})</span>
      )}
    </div>
  );
}
