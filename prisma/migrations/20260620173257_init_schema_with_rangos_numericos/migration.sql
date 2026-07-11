-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EstadoEvento" AS ENUM ('BORRADOR', 'PROGRAMADO', 'CONFIRMADO', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoCombate" AS ENUM ('ESTELAR', 'CO_ESTELAR', 'CARTELERA_PRINCIPAL', 'PRELIMINAR');

-- CreateEnum
CREATE TYPE "EstadoCombate" AS ENUM ('CANCELADO', 'PROGRAMADO', 'CONFIRMADO', 'FINALIZADO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "imagen" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'AYUDANTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuenta" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "proveedor" TEXT NOT NULL,
    "proveedorCuentaId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" INTEGER,

    CONSTRAINT "Cuenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolConfig" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "permisos" TEXT[],
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolConfig_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "lugarNombre" TEXT NOT NULL,
    "calle" TEXT NOT NULL,
    "calleNumero" TEXT NOT NULL,
    "estado" "EstadoEvento" NOT NULL DEFAULT 'PROGRAMADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Combate" (
    "id" TEXT NOT NULL,
    "peleador1Id" TEXT NOT NULL,
    "peleador2Id" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL DEFAULT 3,
    "duracionRounds" INTEGER NOT NULL DEFAULT 5,
    "eventoId" TEXT NOT NULL,
    "tipo" "TipoCombate" NOT NULL DEFAULT 'PRELIMINAR',
    "numeroPelea" INTEGER NOT NULL DEFAULT 1,
    "horarioEstimado" TEXT,
    "categoriaPesoId" TEXT NOT NULL,
    "modalidadId" TEXT NOT NULL,
    "titulo" BOOLEAN NOT NULL DEFAULT false,
    "estado" "EstadoCombate" NOT NULL DEFAULT 'PROGRAMADO',
    "ganadorId" TEXT,
    "viaVictoria" TEXT,
    "roundFin" INTEGER,
    "minutoFin" INTEGER,
    "segundoFin" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Combate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" TEXT NOT NULL,
    "categoriaPesoId" TEXT,
    "modalidadId" TEXT NOT NULL,
    "campeonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingItem" (
    "id" TEXT NOT NULL,
    "rankingId" TEXT NOT NULL,
    "luchadorId" TEXT NOT NULL,
    "posicion" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RankingItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cuenta_proveedor_proveedorCuentaId_key" ON "Cuenta"("proveedor", "proveedorCuentaId");

-- CreateIndex
CREATE UNIQUE INDEX "RolConfig_nombre_key" ON "RolConfig"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Equipo_nombre_key" ON "Equipo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaPeso_nombre_key" ON "CategoriaPeso"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Modalidad_nombre_key" ON "Modalidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "RecordLuchador_luchadorId_modalidadId_key" ON "RecordLuchador"("luchadorId", "modalidadId");

-- CreateIndex
CREATE UNIQUE INDEX "Evento_numero_key" ON "Evento"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_categoriaPesoId_modalidadId_key" ON "Ranking"("categoriaPesoId", "modalidadId");

-- CreateIndex
CREATE UNIQUE INDEX "RankingItem_rankingId_luchadorId_key" ON "RankingItem"("rankingId", "luchadorId");

-- CreateIndex
CREATE UNIQUE INDEX "RankingItem_rankingId_posicion_key" ON "RankingItem"("rankingId", "posicion");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_fkey" FOREIGN KEY ("rol") REFERENCES "RolConfig"("nombre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Luchador" ADD CONSTRAINT "Luchador_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaPeso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Luchador" ADD CONSTRAINT "Luchador_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordLuchador" ADD CONSTRAINT "RecordLuchador_luchadorId_fkey" FOREIGN KEY ("luchadorId") REFERENCES "Luchador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordLuchador" ADD CONSTRAINT "RecordLuchador_modalidadId_fkey" FOREIGN KEY ("modalidadId") REFERENCES "Modalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combate" ADD CONSTRAINT "Combate_peleador1Id_fkey" FOREIGN KEY ("peleador1Id") REFERENCES "Luchador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combate" ADD CONSTRAINT "Combate_peleador2Id_fkey" FOREIGN KEY ("peleador2Id") REFERENCES "Luchador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combate" ADD CONSTRAINT "Combate_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combate" ADD CONSTRAINT "Combate_categoriaPesoId_fkey" FOREIGN KEY ("categoriaPesoId") REFERENCES "CategoriaPeso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combate" ADD CONSTRAINT "Combate_modalidadId_fkey" FOREIGN KEY ("modalidadId") REFERENCES "Modalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combate" ADD CONSTRAINT "Combate_ganadorId_fkey" FOREIGN KEY ("ganadorId") REFERENCES "Luchador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_categoriaPesoId_fkey" FOREIGN KEY ("categoriaPesoId") REFERENCES "CategoriaPeso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_modalidadId_fkey" FOREIGN KEY ("modalidadId") REFERENCES "Modalidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_campeonId_fkey" FOREIGN KEY ("campeonId") REFERENCES "Luchador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingItem" ADD CONSTRAINT "RankingItem_rankingId_fkey" FOREIGN KEY ("rankingId") REFERENCES "Ranking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingItem" ADD CONSTRAINT "RankingItem_luchadorId_fkey" FOREIGN KEY ("luchadorId") REFERENCES "Luchador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

