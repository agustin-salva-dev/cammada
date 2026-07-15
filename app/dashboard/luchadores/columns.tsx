"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type LuchadorRow = {
  id: string;
  nombre: string;
  apodo: string;
  apellido: string;
  edad: number | null;
  altura: number | null;
  ultimoPeso: number | null;
  pais: string;
  ciudad: string;
  createdAt: Date;
  categoria: { id: string; nombre: string } | null;
  equipo: { id: string; nombre: string } | null;
  records: {
    id: string;
    victorias: number;
    derrotas: number;
    empates: number;
    modalidad: { id: string; nombre: string } | null;
  }[];
};

export function getColumns(
  onDelete: (id: string, nombre: string) => void,
  onEdit: (luchador: LuchadorRow) => void,
  canEdit = true,
  canDelete = true,
): ColumnDef<LuchadorRow>[] {
  const columns: ColumnDef<LuchadorRow>[] = [
    {
      accessorKey: "nombre",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const nombre = row.original.nombre || "—";
        const apodo = row.original.apodo;
        const apellido = row.original.apellido || "";

        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {nombre} {apellido}
            </span>
            {apodo && apodo.trim() !== "" && (
              <Badge className="italic">&quot;{apodo}&quot;</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "edad",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Edad
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const edad = row.original.edad;
        return (
          <span className={edad == null ? "text-muted-foreground" : ""}>
            {edad != null ? `${edad} años` : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "altura",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Altura
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const altura = row.original.altura;
        if (altura == null) {
          return <span className="text-muted-foreground">—</span>;
        }
        const metros = (altura / 100).toFixed(2);
        return <span>{metros} m</span>;
      },
    },
    {
      accessorKey: "ultimoPeso",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Último Peso
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const peso = row.original.ultimoPeso;
        if (peso == null) {
          return <span className="text-muted-foreground">—</span>;
        }
        return <span>{peso} kg</span>;
      },
    },
    {
      id: "ubicacion",
      accessorFn: (row) => `${row.ciudad}, ${row.pais}`,
      header: "Ubicación",
      cell: ({ row }) => {
        const ciudad = row.original.ciudad;
        const pais = row.original.pais;
        const hasCiudad = ciudad && ciudad !== "Desconocida";
        const hasPais = pais && pais !== "Desconocido";

        if (!hasCiudad && !hasPais) {
          return <span className="text-muted-foreground">—</span>;
        }

        return (
          <span>
            {hasCiudad ? ciudad : "—"}, {hasPais ? pais : "—"}
          </span>
        );
      },
    },
    {
      id: "equipo",
      accessorFn: (row) => row.equipo?.nombre ?? "",
      header: "Equipo",
      cell: ({ row }) => {
        const equipo = row.original.equipo;
        if (!equipo || equipo.nombre === "Sin equipo") {
          return <span className="text-muted-foreground">Sin equipo</span>;
        }
        return <span>{equipo.nombre}</span>;
      },
    },
    {
      id: "categoria",
      accessorFn: (row) => row.categoria?.nombre ?? "",
      header: "Categoría",
      cell: ({ row }) => {
        const categoria = row.original.categoria;
        if (!categoria || categoria.nombre === "Sin categoría") {
          return <span className="text-muted-foreground">Sin categoría</span>;
        }
        return <Badge variant="secondary">{categoria.nombre}</Badge>;
      },
    },
    {
      id: "records",
      header: "Récords",
      enableSorting: false,
      cell: ({ row }) => {
        const records = row.original.records;
        if (!records || records.length === 0) {
          return <span className="text-muted-foreground">0-0-0</span>;
        }

        return (
          <div className="flex flex-col gap-1">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex flex-col items-center gap-1.5"
              >
                <Badge variant="outline" className="text-[10px] font-normal">
                  {record.modalidad?.nombre ?? "—"}
                </Badge>
                <span className="text-xs font-medium tabular-nums">
                  <span className="text-green-600 dark:text-green-400">
                    {record.victorias}
                  </span>
                  -
                  <span className="text-red-500 dark:text-red-400">
                    {record.derrotas}
                  </span>
                  -
                  <span className="text-muted-foreground">
                    {record.empates}
                  </span>
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const luchador = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              {canEdit && (
                <DropdownMenuItem onClick={() => onEdit(luchador)}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      onDelete(
                        luchador.id,
                        `${luchador.nombre} ${luchador.apellido}`,
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (!canEdit && !canDelete) {
    return columns.filter((c) => (c as { id?: string }).id !== "actions");
  }

  return columns;
}
