-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPERADMIN', 'ADMIN', 'AYUDANTE');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'AYUDANTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Desconocido',
    "ciudad" TEXT NOT NULL DEFAULT 'Desconocida',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaPeso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "limiteInferior" INTEGER,
    "limiteSuperior" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriaPeso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modalidad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Modalidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Luchador" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apodo" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "edad" INTEGER,
    "altura" INTEGER,
    "ultimoPeso" DOUBLE PRECISION,
    "pais" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Luchador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordLuchador" (
    "id" TEXT NOT NULL,
    "luchadorId" TEXT NOT NULL,
    "modalidadId" TEXT NOT NULL,
    "victorias" INTEGER NOT NULL DEFAULT 0,
    "derrotas" INTEGER NOT NULL DEFAULT 0,
    "empates" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RecordLuchador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Equipo_nombre_key" ON "Equipo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaPeso_nombre_key" ON "CategoriaPeso"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Modalidad_nombre_key" ON "Modalidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "RecordLuchador_luchadorId_modalidadId_key" ON "RecordLuchador"("luchadorId", "modalidadId");

-- AddForeignKey
ALTER TABLE "Luchador" ADD CONSTRAINT "Luchador_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaPeso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Luchador" ADD CONSTRAINT "Luchador_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordLuchador" ADD CONSTRAINT "RecordLuchador_luchadorId_fkey" FOREIGN KEY ("luchadorId") REFERENCES "Luchador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordLuchador" ADD CONSTRAINT "RecordLuchador_modalidadId_fkey" FOREIGN KEY ("modalidadId") REFERENCES "Modalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
