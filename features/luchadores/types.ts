export interface RecordModalidad {
  id: string;
  modalidad: string;
  victorias: number;
  derrotas: number;
  empates: number;
}

export interface LuchadorFormData {
  nombre: string;
  apodo: string;
  apellido: string;
  edad?: number;
  altura?: number;
  ultimoPeso?: number;
  categoria: string;
  pais: string;
  ciudad: string;
  equipo: string;
  records: RecordModalidad[];
}
