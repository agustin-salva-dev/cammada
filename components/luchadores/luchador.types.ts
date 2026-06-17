export type ModalidadCombate =
  | "MMA Pro"
  | "MMA Amateur"
  | "Kick Boxing Pro"
  | "Kick Boxing Semi-Pro"
  | "Kick Boxing Amateur"
  | "Grappling"
  | "Only Submission"
  | "Box";

export interface RecordModalidad {
  id: string;
  modalidad: ModalidadCombate | "";
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
