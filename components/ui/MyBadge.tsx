import { Badge } from "@/components/ui/badge";

export function MyBadge({
  text,
  variant,
  secondaryText,
}: {
  text: string;
  variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
    | "green";
  secondaryText?: string;
}) {
  return (
    <div
      className={`flex w-fit gap-1 ${secondaryText && "bg-muted rounded-xl flex items-center"}`}
    >
      <Badge variant={variant}>
        {text} {secondaryText && `:`}
      </Badge>
      {secondaryText && (
        <p className="text-xs text-foreground pr-1.5">{secondaryText}</p>
      )}
    </div>
  );
}
