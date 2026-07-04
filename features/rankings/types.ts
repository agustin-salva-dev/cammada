export interface LuchadorSelectItem {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  categoriaId: string;
  equipo: { nombre: string };
}

export interface RankingItemDraft {
  luchadorId: string;
  nombre: string;
  apellido: string;
  apodo: string;
  posicion: number;
  equipo: string;
}

export interface ModalidadSelectItem {
  id: string;
  nombre: string;
}

export interface CategoriaPesoSelectItem {
  id: string;
  nombre: string;
}
