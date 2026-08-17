import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

export function TalentoExportadoSkeleton() {
  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in">
      {/* Skeleton para Barra de Filtros */}
      <div className="w-full flex flex-col gap-4 p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <Skeleton className="md:col-span-5 h-10 rounded-xl" />
          <Skeleton className="md:col-span-2 h-10 rounded-xl" />
          <Skeleton className="md:col-span-2 h-10 rounded-xl" />
          <Skeleton className="md:col-span-3 h-10 rounded-xl" />
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          <Skeleton className="h-4 w-40 rounded" />
        </div>
      </div>

      {/* Skeleton Grilla de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="flex flex-col justify-between overflow-hidden border border-border/80 bg-card/60 shadow-lg"
          >
            <CardHeader className="py-3 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-3 w-28 rounded" />
                  <Skeleton className="h-7 w-48 rounded-md" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full shrink-0" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-32 rounded" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-border/40">
              <Skeleton className="h-9 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
