export type RespuestaOficialPublica = {
  id: string;
  contenido: string;
  usuario: {
    nombre: string;
    rol: string;
  };
  createdAt: Date;
};

export type OpinionPublica = {
  id: string;
  nombreUsuario: string;
  rolParticipante: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  estrellas: number | null;
  conteoVotos: number;
  respuesta: RespuestaOficialPublica | null;
  createdAt: Date;
};

export type MetricaCategoria = {
  categoria: string;
  promedio: number;
  total: number;
  distribucion: {
    estrellas: number;
    cantidad: number;
    porcentaje: number;
  }[];
};

export type MetricasGenerales = {
  promedioGeneral: number;
  totalOpiniones: number;
  distribucionGeneral: {
    estrellas: number;
    cantidad: number;
    porcentaje: number;
  }[];
  metricas: MetricaCategoria[];
};

export type NPSResultados = {
  npsScore: number;
  totalRespuestas: number;
  distribucion: {
    promotores: { cantidad: number; porcentaje: number };
    pasivos: { cantidad: number; porcentaje: number };
    detractores: { cantidad: number; porcentaje: number };
  };
  promedioRetencion: number;
  promedioSatisfaccionWeb: number;
};

export type OpinionModeracion = {
  id: string;
  nombreUsuario: string;
  rolParticipante: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  estrellas: number | null;
  estado: string;
  conteoVotos: number;
  respuesta: RespuestaOficialPublica | null;
  createdAt: Date;
};

export type EstadisticasModeracion = {
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
  total: number;
};
