"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const columnLabels: Record<string, string> = {
  nombre: "Nombre",
  edad: "Edad",
  altura: "Altura",
  ultimoPeso: "Último Peso",
  ubicacion: "Ubicación",
  equipo: "Equipo",
  categoria: "Categoría",
  esExportado: "Talento Exportado",
  records: "Récords",
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  categorias: string[];
  equipos: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  categorias,
  equipos,
}: DataTableProps<TData, TValue>) {
  "use no memo";

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [categoriaFilter, setCategoriaFilter] = React.useState("");
  const [equipoFilter, setEquipoFilter] = React.useState("");
  const [exportadoFilter, setExportadoFilter] = React.useState("");

  const filteredData = React.useMemo(() => {
    let result = data as Record<string, unknown>[];

    if (categoriaFilter) {
      result = result.filter((row) => {
        const cat = row.categoria as { nombre: string } | null;
        return cat?.nombre === categoriaFilter;
      });
    }

    if (equipoFilter) {
      result = result.filter((row) => {
        const eq = row.equipo as { nombre: string } | null;
        return eq?.nombre === equipoFilter;
      });
    }

    if (exportadoFilter === "exportados") {
      result = result.filter((row) => row.esExportado === true);
    } else if (exportadoFilter === "locales") {
      result = result.filter((row) => !row.esExportado);
    }

    return result as TData[];
  }, [data, categoriaFilter, equipoFilter, exportadoFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: Search + Filters + Column Visibility */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search input */}
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-luchadores"
            placeholder="Buscar por nombre, apodo..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>

        <NativeSelect
          value={categoriaFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setCategoriaFilter(e.target.value)
          }
        >
          <NativeSelectOption value="">Todas las categorías</NativeSelectOption>
          {categorias.map((cat) => (
            <NativeSelectOption key={cat} value={cat}>
              {cat}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <NativeSelect
          value={equipoFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setEquipoFilter(e.target.value)
          }
        >
          <NativeSelectOption value="">Todos los equipos</NativeSelectOption>
          {equipos.map((eq) => (
            <NativeSelectOption key={eq} value={eq}>
              {eq}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <NativeSelect
          value={exportadoFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setExportadoFilter(e.target.value)
          }
        >
          <NativeSelectOption value="">
            Todos (Exportados y Locales)
          </NativeSelectOption>
          <NativeSelectOption value="exportados">
            Solo Exportados
          </NativeSelectOption>
          <NativeSelectOption value="locales">Solo Locales</NativeSelectOption>
        </NativeSelect>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-9">
              <Settings2 className="h-4 w-4" />
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-45">
            <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide(),
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnLabels[column.id] ?? column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron luchadores.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} luchador(es) en total
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              Filas por página
            </p>
            <NativeSelect
              value={`${table.getState().pagination.pageSize}`}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                table.setPageSize(Number(e.target.value))
              }
            >
              {[10, 20, 30, 50].map((size) => (
                <NativeSelectOption key={size} value={`${size}`}>
                  {size}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <p className="text-sm font-medium whitespace-nowrap">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Primera página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Página siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Última página</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
